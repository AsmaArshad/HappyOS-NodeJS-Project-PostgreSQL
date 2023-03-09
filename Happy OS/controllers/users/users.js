const db = require('../../generics/db/db')
const { encrypt, decrypt } = require('./crypto');
const mail = require('./send-mail');

exports.signup = (req, page_res) => {
  console.log('SignUp page loaded Successfully!');
  page_res.render('signup');
}

exports.SignupAuth = (req, page_res) => {
  const { Email } = req.body;
  var page = 'signup';
  if (Email != "") {
    db('register').insert({ Email }).then((insert_res) => {
      const encryptedEmail = encrypt(Email);
      var subject = 'Complete Signup | HappyOS';
      var html = `Hi, kindly complete your signup process by clicking below link`.concat(`<br><br> <a href="http://localhost:4700/register-signup/${encryptedEmail}">Click here to complete signup</a><br /><br /> `).concat(`Thanks,<br />HappyOS.io`);
      var mail_msg = 'Email has been sent containing a link to complete your signup process.';
      var mail_for = 'Registration process';
      var data = { subject, html, page, Email, mail_msg, mail_for }
      mail.SendEmail(req, page_res, data)
    })
      .catch(err => {
        page_res.render(page, {
          errorMsg: err
        })
      });
  }
}

exports.registerSignUp = (req, res) => {
  res.render('register-signup');
}

exports.registerSignUpAuth = (req, res) => {
  const { org_name, address, city, state, zipcode, country_code, company_phone_number, first_name, title, last_name, coun_code, contact_phone_number, email, confirm_email, user_name, password, confirm_password, policy_check } = req.body;
  if (org_name != "" && address != "" && city != "" && state != "" && zipcode != "" && country_code != "" && company_phone_number != "" && first_name != "" && title != "" && last_name != "" && coun_code != "" && contact_phone_number != "" && email != "" && confirm_email != "" && user_name != "" && password != "" && confirm_password != "" && policy_check != "") {
    var data = { org_name, address, city, state, zipcode, country_code, company_phone_number, first_name, title, last_name, coun_code, contact_phone_number, email, confirm_email, user_name, password, confirm_password, policy_check };
    if (password != confirm_password) {
      return res.render('register-signup', {
        list: data,
        signup_error: 'Passwords did not match'
      })
    }

    if (email != confirm_email) {
      return res.render('register-signup', {
        list: data,
        signup_error: 'Email Addresses did not match'
      })
    }

    var Company_PhoneNo = country_code + company_phone_number;
    var PhoneNo = coun_code + contact_phone_number;
    db('register').update({ Company: org_name, Address: address, City: city, State: state, ZipCode: zipcode, CompanyPhoneNo: Company_PhoneNo, FirstName: first_name, Title: title, LastName: last_name, PhoneNo, UserName: user_name, Password: password, UserType: 'user' }).where({ Email: email }).then((update_res) => {
      res.render('login', {
        Msg: 'User Registered Successfully!'
      });
    })
      .catch((err) => {
        return res.render('login', {
          error: 'Something went wrong in signup process'
        })
      })
  }
}

exports.login = async (req, page_res) => {
  if (req.session.already_logged === 'true') {
    await db.select('UserType').from('register').where({ Email: req.session.Email }).then((select_res) => {
      if (select_res[0].UserType == 'Admin') {
        page_res.redirect('/admin');
      }
      else {
        page_res.redirect('/billing')
      }
    }).catch((err) => {
      page_res.render('login', {
        error: 'Something went wrong while login'
      })
    })
  }
  else {
    console.log('Controller: Login Page Loaded');
    page_res.render('login', {
      title: req.session.already_logged
    })
  }
}

exports.login.auth = async (req, page_res) => {
  const { email_user_name, password } = req.body
  const filter = { Email: email_user_name, Password: password }
  await db.select('Email', 'Password', 'UserName').from('register').where(filter).then(async (res) => {
    if (res.length > 0) {
      req.session.already_logged = 'true';
      req.session.Email = res[0].Email;
      req.session.name = res[0].UserName;
      if (res[0].UserName == "Admin") {
        page_res.send('<script>("User Login Successfully!");window.location.href = "/admin" </script>')
      }
      else {
        page_res.send('<script>("User Login Successfully!");window.location.href = "/billing" </script>')
      }
    }
    else
      page_res.render('login', {
        error: 'Wrong email or password'
      })
  })
    .catch(err => {
      page_res.render('login', { message: err.message })
    })
}

exports.admin = (req, page_res) => {
  if (req.session.already_logged === 'false' || req.session.already_logged === undefined) {
    page_res.render('login')
  }
  else {
    console.log('Admin Dashboard Loaded Succesfully!')
    page_res.render('admin', { name: req.session.name })
  }
}


exports.forgetPassword = (req, res) => {
  res.render('forget-pass');
}

exports.Forget_Password = async (req, page_res) => {
  const { Email } = req.body;
  await db.select('Email').from('register').where({ Email }).then(async (res) => {
    if (res.length > 0) {
      const encryptedEmail = encrypt(Email);
      var subject = 'Reset Password | HappyOS';
      var html = `Hi, reset your password by clicking below link`.concat(`<br><br> <a href="http://localhost:4700/reset-password/${encryptedEmail}">Click here to reset password</a><br /><br /> `).concat(`Thanks,<br />HappyOS.io`);
      var page = 'forget-pass';
      var mail_msg = 'Email has been sent containing a link to reset password.';
      var mail_for = 'Reset password';
      var data = { subject, html, page, Email, mail_msg, mail_for }
      mail.SendEmail(req, page_res, data)
    }
    else {
      page_res.render(page, {
        mail_error: 'Email Address does not Exist'
      })
    }
  }).catch(err => {
    mail_error: 'Something went wrong while getting user Email'
  })
}



exports.PasswordResetEmail = (req, res) => {
  var Email = req.params.Email;
  const decryptedEmail = decrypt(Email);
  if (decryptedEmail != undefined) {
    res.render('reset-password', {
      Email: decryptedEmail
    })
  }
  else {
    res.render('reset-password', {
      resetError: 'Reset Link Expired'
    })
  }
}

exports.ResetPassword = (req, page_res) => {
  const { email, password, confirm_password } = req.body;
  const decryptedEmail = decrypt(req.params.Email);
  if (password != confirm_password) {
    return page_res.render('reset-password', {
      Email: decryptedEmail,
      resetError: 'Passwords did not match'
    })
  }

  db('register').update({ Password: password }).where({ Email: decryptedEmail }).then((update_res) => {
    page_res.render('reset-password', {
      reset_msg: 'Password Reset Successfully!'
    })
  })
    .catch(err => {
      return page_res.render('reset-password', {
        resetError: 'Something went wrong while resetting the password'
      })
    })
}

exports.logout = (req, res) => {
  req.session.already_logged = 'false';
  res.redirect('/login')
}
