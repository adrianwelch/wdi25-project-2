const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const s3 = require('../lib/s3');

const imageSchema = new mongoose.Schema({
  filename: { type: String },
  caption: { type: String }
});

// imageSchema.virtual('src')
//   .get(function getImageSRC(){
//     if(!this.filename) return null;
//     return `https://s3-eu-west-1.amazonaws.com/wdi-london-25/${this.filename}`;
//   });

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  aboutMe: { type: String },
  password: { type: String },
  image: { type: String},
  facebookId: { type: String},
  githubId: { type: Number }
});

userSchema
  .virtual('imageSRC')
  .get(function getImageSRC() { //only runs when we want to access that property
    if(!this.image) return null;
    if(this.image.match(/^http/)) return this.image;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-25/${this.image}`;
  });

userSchema
  .virtual('passwordConfirmation') //virtual because dont want to store in database, if we didnt have virtual wouldnt beable to access it, virtual gets hold of it from req.body and set it on the record temporarily.
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

// lifecyclehook - mongoose middleware
userSchema.pre('validate', function checkPassword(next) {
  if(!this.password && !this.githubId && !this.facebookId) {
    this.invalidate('password', 'required');
  }
  if(this.isModified('password') && this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.pre('remove', function removeUsersDives(next) {
  this.model('Dive').remove({ createdBy: this.id }, next);
});

userSchema.pre('remove', function removeImage(next) {
  if(!this.image || this.image.match(/^http/)) return next();
  s3.deleteObject({ Key: this.image }, next);
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', userSchema); //telling mongoose what collection to collect in the database. so storing in db User
