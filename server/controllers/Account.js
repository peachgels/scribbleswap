const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');
const changePasswordPage = (req, res) => res.render('changePassword');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// compares new passwords, saves and re-encrypts new password
const changePassword = async (req, res) => {
  const { username } = req.session.account;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(newPass);
    const existingAccount = await Account.findOne({ username });
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found!' });
    }
    existingAccount.password = hash;
    await existingAccount.save();

    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// sets account to premium
// obviously in a legitimate implementation payment details would go here
const premiumToggle = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.session.account.username });
    account.premium = !account.premium;
    await account.save();
    req.session.account.premium = !account.premium;
    return res.redirect('/maker');
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  changePasswordPage,
  premiumToggle,
};
