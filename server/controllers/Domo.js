const models = require('../models');

const { Scribble, Account } = models;

const makerPage = async (req, res) => res.render('app');
const scribblePage = (req, res) => res.render('scribble');

const sendScribbles = async (req, res) => {
  const scribData = {
    img: req.body.img,
    owner: req.session.account._id,
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
    // updatePromises.push(
    //   req.session.account = Account.toAPI(req.session.account)
    // );
    await Promise.all(updatePromises);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const updateScrapbook = async (req, res) => {
  console.log('updateScrapbook got called')
  try {
    const currentAct = req.session.account.username;
    Account.findOne({ username: currentAct }).exec().then(current => {
      if (!current) {
        console.log(`No account found!`);
        return;
      }
      current.scrapbook.push(Scribble.findOne({ _id: req.body.id }).exec());
      return current.save();
    })
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

module.exports = {
  makerPage,
  // makeDomo,
  getPFP,
  getInbox,
  updateScrapbook,
  getScrapbook,
  scribblePage,
  sendScribbles,
};
