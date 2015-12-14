"use strict";
const crypto = require('crypto');
const upperLimitUInt32 = Math.pow(2, 32) - 1;

function random_safe(limit) {
    return ~~(crypto.randomBytes(4).readUInt32LE() / upperLimitUInt32 * limit);
}

function generate(participants) {
  let present_pairs = [];
  let participants_copy = participants.slice(0, participants.length);
  while (participants.length > 0) {
    var pick_sender = random_safe(participants.length);
    var pick_receiver = random_safe(participants_copy.length);

    // when only two persons are left, pick manually the only viable option
    // if it wasn't already picked
    if (participants.length >= 2 &&
        (participants[pick_sender].email === participants_copy[pick_receiver].email
         || participants[~~!pick_sender].email === participants_copy[~~!pick_receiver].email)
       ) {
        pick_receiver = ~~!pick_receiver;
    } else if (participants[pick_sender].email === participants_copy[pick_receiver].email) {
      // if we chose the same person, skip
      continue;
    }

    var pick = {
      sender: participants.splice(pick_sender, 1)[0],
      receiver: participants_copy.splice(pick_receiver, 1)[0],
      toString() {
        return `${this.sender.name} ⇾ ${this.receiver.name} (${this.receiver.sex})`;
      }
    };

    present_pairs.push(pick);
  }
  return present_pairs;
}

module.exports = { generate, random_number: random_safe, default: generate };
