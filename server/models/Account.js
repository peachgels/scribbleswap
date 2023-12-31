const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

/* Our schema defines the data we will store. A username (string of alphanumeric
   characters), a password (actually the hashed version of the password created
   by bcrypt), and the created date.
*/
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  profilePic: {
    type: mongoose.Schema.ObjectId,
    ref: 'Scribble',
  },
  inbox:
    [{ type: mongoose.Schema.Types.ObjectId }],
  scrapbook:
    [{ type: mongoose.Schema.Types.ObjectId }],
  premium: {
    type: Boolean,
    default: false,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
  profilePic: doc.profilePic,
  inbox: doc.inbox,
  scrapbook: doc.scrapbook,
  premium: doc.premium,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

// this function acts similarly to the above, but updates the session
// while the user is in it so inbox and pfp updates
// can be seen on refresh without having to log out/in.
// When a model is updated in mongoose, this code retrieves the updated data
AccountSchema.statics.update = async (userId, callback) => {
  try {
    const doc = await AccountModel.findById({ userId }).exec();
    if (!doc) {
      return callback();
    }

    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
