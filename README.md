# Secret Santa shuffler and email sender

This little project takes a list of persons, shuffles everybody without showing the pairs and then sends every one an
email with their present receiver.
It is currently translated into English and Romanian.
There's an HTML template (in the `templ` folder) which is used to give a nice winter-y form to the emails.

Here's a screenshot from a Gmail received message:
![](https://github.com/toxik/SecretSanta/blob/master/templ/images/gmail_screenshot.png)

## Installation

1. `git clone https://github.com/toxik/SecretSanta.git`
2. npm install (for the `nodemailer` dependency)

## Usage

1. clone the `settings.json.sample` into `settings.json`
  1. add the details for the persons you want shuffled: name, email, sex
  2. configure your email provider (smtp/gmail etc. see [the nodemailer project](https://github.com/andris9/Nodemailer) for all available settings)
2. npm start

## Credits

Alexandru Georoceanu

## License

TODO: Write license
