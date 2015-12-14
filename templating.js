"use strict";
let mail_template = require('fs').readFileSync('./templ/index.html', { encoding: 'utf8' });
let i18n = {};

// modify the template to use the cid- versions of the images
function extract_images() {
  let extract_images = /src="images\/([a-zA-Z0-9\.\_]+)"/gm;
  let attachment_images = [];
  let result;
  while ( result = extract_images.exec(mail_template) ) {
    attachment_images.push(result[1]);
  }
  let attachments = attachment_images.map(
    (f) => ({ path: `./templ/images/${f}`, cid: `cid-${f}` })
  );
  attachment_images.forEach( (image) => {
    mail_template = mail_template.replace(`images/${image}`, `cid:cid-${image}`)
  });
  return attachments;
}

function fill_html(vars) {
  let str, local_template = mail_template;
  for (str in vars) {
    local_template = local_template.replace(`__${str}__`, vars[str]);
  }
  return local_template;
}

function init(language) {
  i18n = require(`./templ/i18n/${language}.json`);
  mail_template = fill_html(i18n);
}

module.exports = { extract_images, fill_html, mail_template, init }
