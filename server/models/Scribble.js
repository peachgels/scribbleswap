const mongoose = require('mongoose');
const _ = require('underscore');

let ScribbleModel = {};

const ScribbleSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ScribbleSchema.statics.toAPI = (doc) => ({
  image: doc.img,
  owner: doc.owner,
  _id: doc._id,
});

ScribbleModel = mongoose.model('Scribble', ScribbleSchema);
module.exports = ScribbleModel;
