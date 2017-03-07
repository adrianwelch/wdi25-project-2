const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const imageSchema = new mongoose.Schema({
  filename: { type: String },
  caption: { type: String }
});

imageSchema.virtual('src')
  .get(function getImageSRC(){
    if(!this.filename) return null;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-25/${this.filename}`;
  });

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  profileImage: { type: String},
  images: [ imageSchema ],
  githubId: { type: String }
});

userSchema.virtual('profileImageSRC')
  .get(function getProfileImageSRC(){
    if(!this.profileImage) return null;
    if(this.profileImage.match(/^http/)) return this.profileImage;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-25/${this.profileImage}`;
  });

userSchema
  .virtual('passwordConfirmation') //virtual because dont want to store in database, if we didnt have virtual wouldnt beable to access it, virtual gets hold of it from req.body and set it on the record temporarily.
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

// lifecyclehook - mongoose middleware
userSchema.pre('validate', function checkPassword(next) {
  if(!this.password && !this.githubId) {
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

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', userSchema); //telling mongoose what collection to collect in the database. so storing in db User
