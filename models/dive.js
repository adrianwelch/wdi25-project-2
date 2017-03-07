const mongoose = require('mongoose');
const s3 = require('../lib/s3');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

commentSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};


// populated createdBy. turned into string so can edit
// diveSchema.methods.belongsTo = function belongsTo(user) {
//   if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
//   return user.id === this.createdBy.toString();
// };

const imageSchema = new mongoose.Schema({
  filename: { type: String },
  caption: { type: String }
});

const diveSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, timestamps: true },
  diveNo: { type: Number },
  date: { type: Date},
  diveTime: {type: Number},
  diveSite: { type: String },
  location: { type: String },
  diveShop: { type: String },
  animalTags: { type: String },
  stars: { type: Number },
  review: { type: String },
  images: { type: String },
  comments: [ commentSchema ]
},{
  timestamps: true
});

diveSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.images) return null;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-25/${this.images}`;
  });

diveSchema.pre('remove', function removeImage(next) {
  if(!this.image || this.image.match(/^http/)) return next();
  s3.deleteObject({ Key: this.image }, next);
});

diveSchema.methods.ownedBy = function ownedBy(user) {
  if(typeof this.createdBy.id === 'string') return this.createdBy.id === user.id;
  return this.createdBy.id === user.id;
};

module.exports = mongoose.model( 'Dive', diveSchema);
