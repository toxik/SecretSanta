"use strict";
const settings = require('./settings.json');
const mail_transport = settings.mail_transport;
let participants = settings.participants;

let generator = require('./pairs_generator.js');
let templating = require('./templating.js');
let transporter = require('nodemailer').createTransport(mail_transport);

templating.init(settings.language);

let default_options = settings.mail_options;
default_options.attachments = templating.extract_images();

let send_mail = function(pair) {
  var mail_options = JSON.parse(JSON.stringify(default_options));
  mail_options.to = `${pair.sender.name} <${pair.sender.email}>`;

  mail_options.html = templating.fill_html({
    'giver_name'      : pair.sender.name.split(" ")[0],
    'recipient_name'  : pair.receiver.name,
    'recipient_genre' : settings.mail_options[`lucky_${pair.receiver.sex}`]
  });

  transporter.sendMail(mail_options, function(error, info){
      if(error){
          return console.log(`Error sending message to ${mail_options.to}`, error);
      }
      console.log(`Message sent to ${mail_options.to}: ${info.response}`);
  });

}

// Send ALL the emails!
generator.generate(participants).forEach(send_mail)
