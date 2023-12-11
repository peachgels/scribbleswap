const models = require('../models');

const { Scribble, Account } = models;

const makerPage = async (req, res) => res.render('app');
const scribblePage = (req, res) => res.render('scribble');

const sendScribbles = async (req, res) => {
  const scribData = {
    img: req.body.img,
    owner: req.session.account._id,
    ownerUsername: req.session.account.username,
  };
  try {
    const newScrib = new Scribble(scribData);
    newScrib.save();
    const updatePromises = [];
    const currentAct = req.session.account.username;
    console.log(req.body.savedAsPFP);
    if (req.body.savedAsPFP) {
      updatePromises.push(
        Account.findOne({ username: currentAct }).exec().then((thisGuy) => {
          const current = thisGuy;
          current.profilePic = newScrib;
          current.save();
        }),
      );
    }
    req.body.sendToList.forEach(friend => {
      updatePromises.push(
        Account.findOne({ username: friend }).exec().then((sentTo) => {
          if (!sentTo) {
            return;
          }
          const recipient = sentTo;
          recipient.inbox.push(newScrib);
          recipient.save();
        }),
      );
    }
    );
    await Promise.all(updatePromises);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getInbox = async (req, res) => {
  let docs;
  try {
    if (req.session.account.premium){
      docs = await Scribble.find({ _id: { $in: req.session.account.inbox } })
      .sort({_id:-1}).limit(100);
    }
    else{
      docs = await Scribble.find({ _id: { $in: req.session.account.inbox } })
      .sort({_id:-1}).limit(50);
    }
    console.log(req.session.account._id)
    const account = await Account.findById(req.session.account._id).exec();

    if (!account) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ inbox: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving inbox here!' });
  }
};

const getScrapbook = async (req, res) => {
  try {
    const docs = await Scribble.find({ _id: { $in: req.session.account.scrapbook } });
    return res.json({ scrapbook: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving scrapbook!' });
  }
};

const getPFP = async (req, res) => {
  try {
    const docs = await Scribble.find({ _id: req.session.account.profilePic });
    return res.json({ profilePic: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving PFP!' });
  }
};

const getUserData = async (req, res) => {
  try {
    const docs = await Account.find({ _id: req.session.account._id });
    return res.json({ stuff: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user info!' });
  }
};

module.exports = {
  makerPage,
  getPFP,
  getUserData,
  getInbox,
  getScrapbook,
  scribblePage,
  sendScribbles,
};
