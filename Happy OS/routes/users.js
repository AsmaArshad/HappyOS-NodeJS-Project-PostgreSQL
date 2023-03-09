const expres = require('express')
const routes = expres.Router();

// controllers
const users =require('../controllers/users/users');
const Policy = require('../controllers/users/Policy');
const Billing = require('../controllers/users/billing');
routes.get('/', (req, res)=> {
    res.render('index');
});
routes.get('/signup',users.signup);
routes.post('/signup', users.SignupAuth);
routes.get('/register-signup/:Email',users.registerSignUp );
routes.post('/register-signup/:Email', users.registerSignUpAuth);
routes.get('/login',users.login);
routes.post('/auth', users.login.auth);
routes.get('/admin', users.admin);
routes.get('/forget-pass',users.forgetPassword);
routes.post('/forget-pass', users.Forget_Password);
routes.get('/reset-password/:Email', users.PasswordResetEmail);
routes.post('/reset-password/:Email', users.ResetPassword);
routes.get('/billing', Billing.checkPaymentStatus);
routes.get('/buy-subscription', Billing.BuySubscription);
routes.post('/buy-subscription', Billing.Subscription_Details);
routes.get('/view_policy', Policy.viewPolicy);
routes.get('/view_policy/:Id', Policy.ViewStatues);
routes.get('/downloadPdf/:Id', Policy.Download_File);
routes.get('/ViewPdf/:Id', Policy.View_File);
routes.post('/view_policy/:Id', (req, res)=> {
    res.redirect('/view_policy');
});
routes.post('/view_policy', Policy.getProgramPolicy)
routes.get('/logout', users.logout);
module.exports = routes