const nodemailer = require('nodemailer');
exports.SendEmail = (req, page_res, next) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'asmaminhas160@gmail.com',
      pass: 'fgmdtjvedqkayfce'
    }
  });

  var mailOptions = {
    from: 'asmaminhas160@gmail.com',
    to: next.Email,
    subject: next.subject,
    html: next.html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      page_res.render(next.page, { errorMsg: 'Please Enter Valid Email Address' })
    } else {
      console.log('Email for ' + next.mail_for + ' has been sent successfully!');
      page_res.render(next.page, {
        msg: next.mail_msg
      });
    }
  });
}
