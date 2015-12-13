"use strict";
const settings = require('./settings.json');
const mail_transport = settings.mail_transport;
let participants = settings.participants;
let mail_template = require('fs').readFileSync('./templ/index.html', { encoding: 'utf8' });

let generator = require('./pairs_generator.js');
let transporter = require('nodemailer').createTransport(mail_transport);

// modify the template to use the cid- versions of the images
let extract_images = /src="images\/([a-zA-Z0-9\.\_]+)"/gm;
let attachment_images = [], result;
while ( result = extract_images.exec(mail_template) ) {
  attachment_images.push(result[1]);
}
let attachments = attachment_images.map(
  (f) => ({ path: `./templ/images/${f}`, cid: `cid-${f}` })
);
attachment_images.forEach( (image) => {
  mail_template = mail_template.replace(`images/${image}`, `cid:cid-${image}`)
});

let default_options = settings.mail_options;
default_options.attachments = attachments;

let send_mail = function(pair) {
  var mail_options = JSON.parse(JSON.stringify(default_options));
  mail_options.to = `${pair.sender.name} <${pair.sender.email}>`;
  mail_options.html = mail_template.replace('__giver_name__', pair.sender.name.split(" ")[0]);
  mail_options.html = mail_options.html.replace('__recipient_genre__',
                                (pair.receiver.sex === 'M' ? 'Norocosul' : 'Norocoasa') );
  mail_options.html = mail_options.html.replace('__recipient_name__', pair.receiver.name);

  transporter.sendMail(mail_options, function(error, info){
      if(error){
          return console.log(`Error sending message to ${mail_options.to}`, error);
      }
      console.log(`Message sent to ${mail_options.to}: ${info.response}`);
  });

}

// Send ALL the emails!
generator.generate(participants).forEach(send_mail)
