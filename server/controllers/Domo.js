const models = require('../models');

const { Scribble, Account } = models;

const makerPage = async (req, res) => res.render('app');
const scribblePage = (req, res) => res.render('scribble');

// const makeDomo = async (req, res) => {
//   if (!req.body.name || !req.body.age || !req.body.level) {
//     return res.status(400).json({ error: 'Name, age, and level are required!' });
//   }

//   const domoData = {
//     name: req.body.name,
//     age: req.body.age,
//     level: req.body.level,
//     owner: req.session.account._id,
//   };

//   try {
//     const newDomo = new Domo(domoData);
//     await newDomo.save();
//     return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
//   } catch (err) {
//     console.log(err);
//     if (err.code === 11000) {
//       return res.status(400).json({ error: 'Domo already exists!' });
//     }
//     return res.status(500).json({ error: 'An error occured making domo!' });
//   }
// };

const sendScribbles = async (req, res) => {
  const scribData = {
    img: req.body.img,
    owner: req.session.account._id,
  };
  try {
    const newScrib = new Scribble(scribData)
    newScrib.save();
    const updatePromises = [];
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

const getInbox = async (req, res) => {
  try {
    const docs = await Scribble.find({ _id: { $in: req.session.account.inbox } });
    return res.json({ inbox: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving inbox!' });
  }
};

module.exports = {
  makerPage,
  // makeDomo,
  getInbox,
  scribblePage,
  sendScribbles,
};
