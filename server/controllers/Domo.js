const models = require('../models');

const { Scribble, Account } = models;

const makerPage = async (req, res) => res.render('app');
const scribblePage = (req, res) => res.render('scribble');

const sendScribbles = async (req, res) => {
  const scribData = {
    img: req.body.img,
    owner: req.session.account._id,
    ownerUser: req.session.account.username
  };
  try {
    const newScrib = new Scribble(scribData)
    newScrib.save();
    const updatePromises = [];
    let currentAct = req.session.account.username;
    if (req.body.savedAsPFP) {
      updatePromises.push(
        Account.findOne({ username: currentAct }).exec().then(current => {
          if (!current) {
            console.log(`No account found!`);
            return;
          }
          current.profilePic = newScrib;
          return current.save();
        })
      )
    }
    for (const friend of req.body.sendToList) {
      updatePromises.push(
        Account.findOne({ username: friend }).exec().then(sentTo => {
          if (!sentTo) {
            console.log(`user ${friend} not found`);
            return;
          }
          sentTo.inbox.push(newScrib);
          return sentTo.save();
        })
      );
    }
    await Promise.all(updatePromises);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const updateScrapbook = async (req, res) => {
  try {
    const newScrap = await Scribble.findOne({ _id: req.body.scribID }).exec()
    console.log(newScrap._id);
    const query = req.session.account.username;
    const thisGuy = await Account.findOne({ username: query})
    if (!thisGuy) {
      console.log(`No account found!`);
      return;
    }
    thisGuy.scrapbook.push(newScrap);
    await thisGuy.save();
    return res.status(201);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error!' });
  }
}

const getInbox = async (req, res) => {
  try {
    const docs = await Scribble.find({ _id: { $in: req.session.account.inbox } });
    return res.json({ inbox: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving inbox!' });
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
  updateScrapbook,
  getScrapbook,
  scribblePage,
  sendScribbles,
};
