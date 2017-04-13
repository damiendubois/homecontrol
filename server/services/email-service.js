'use strict';

var nodemailer = require('nodemailer');
var logger = require('./logger-service')(module);
var config = require('../config/environment');


// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://'+config.smtp.user+':'+config.smtp.password+'@'+config.smtp.server);
var transporter = nodemailer.createTransport({
  host: config.smtp.server,
  port: config.smtp.port,
  auth: {
  user: config.smtp.user,
  pass: config.smtp.password
},
tls: {rejectUnauthorized: false}
});

var emailService = {
  sendEmail : sendEmail
};

module.exports = emailService;

function sendEmail(sender,recipients,subject,contentText,contentHtml,attachment,attachmentName){
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: sender+' <'+config.smtp.user+'>', // sender address
      to: fromListToReceiverList(recipients), // list of receivers
      subject: subject, // Subject line
      text: contentText, // plaintext body
      html: contentHtml // html body
  };
  if(attachment){
    mailOptions.attachments = [{
      filename : attachmentName,
      content: attachment
    }];
  }
  // send mail with defined transport object
  return transporter.sendMail(mailOptions).catch(function(error){
    logger.error(error);
  });
}

  function fromListToReceiverList(listOfEmails){
    var listOfEmailsString = "";
    listOfEmails.map(function(email){
      if(listOfEmailsString!==""){ //not the first element
        listOfEmailsString+= ", ";
      }
      listOfEmailsString += email;
    });
    return listOfEmailsString;
  }
