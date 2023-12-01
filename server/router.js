const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getInbox', mid.requiresLogin, controllers.Domo.getInbox);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);

  app.get('/scribble', mid.requiresLogin, controllers.Domo.scribblePage);
  app.post('/scribble', mid.requiresLogin, controllers.Domo.sendScribbles);

  app.get('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
