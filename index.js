"use strict";
const settings = require('./settings.json');
const async = require('async');
const mail_transport = settings.mail_transport;
let participants = settings.participants;

let generator = require('./pairs_generator.js');
let templating = require('./templating.js');
let transporter = require('nodemailer').createTransport(mail_transport);

templating.init(settings.language);

let default_options = settings.mail_options;
default_options.attachments = templating.extract_images();

let send_mail = function(pair, callback, retry = 0) {
  var mail_options = JSON.parse(JSON.stringify(default_options));
  mail_options.to = `${pair.sender.name} <${pair.sender.email}>`;

  mail_options.html = templating.fill_html({
    'giver_name'      : pair.sender.name.split(" ")[0],
    'recipient_name'  : pair.receiver.name,
    'recipient_genre' : settings.mail_options[`lucky_${pair.receiver.sex}`]
  });

  transporter.sendMail(mail_options, function(error, info){
      if(error){
          if (retry < 5) {
            console.log(`Error sending message to ${mail_options.to}. going to retry ${retry}`);
            return send_mail(pair, retry + 1)
          }
          callback(`Error sending message to ${mail_options.to}`, error, pair + "")
          return console.log(`Error sending message to ${mail_options.to}`, error, pair + "");
      }
      callback()
      console.log(`Message sent to ${mail_options.to}: ${info.response}`);
  });

}
// Send ALL the emails Sync with wating!
const combinations = generator.generate(participants)

async.eachSeries(combinations, send_mail)
// if you want to see possible combinations comment the above line
// and uncomment the line below:
//console.log(generator.generate(participants).map((pair)=>(pair+"")))
