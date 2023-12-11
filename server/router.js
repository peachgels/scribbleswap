const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getInbox', mid.requiresLogin, controllers.Scribble.getInbox);
  app.get('/getScrapbook', mid.requiresLogin, controllers.Scribble.getScrapbook);
  app.get('/getUserData', mid.requiresLogin, controllers.Scribble.getUserData);
  app.get('/getPFP', mid.requiresLogin, controllers.Scribble.getPFP);
  // app.post('/updateScrapbook', mid.requiresLogin, controllers.Scribble.updateScrapbook);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Scribble.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Scribble.updateScrapbook);

  app.get('/scribble', mid.requiresLogin, controllers.Scribble.scribblePage);
  app.post('/scribble', mid.requiresLogin, controllers.Scribble.sendScribbles);

  app.get('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.post('/premiumToggle', mid.requiresSecure, mid.requiresLogin, controllers.Account.premiumToggle)

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
