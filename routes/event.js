const express = require("express");
const eventRoute = express.Router();
var nodemailer = require('nodemailer');
require('dotenv').config();

const Web3 = require("web3");
const ethUrl = process.env.WSS;
const contractAddress = process.env.CONTRACT;
const eventSignature = process.env.EVENT_SIGNATURE; // AirdropWithdraw(address user, uint256 amount)
const web3Eth = new Web3(ethUrl);

const mailAuth = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_APP_PASSWORD   // app password
  }
});

const wssOptions = {
  keepAlive: true,
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 20,
    onTimeout: false
  },
  address: contractAddress,
  topics: [
    eventSignature
  ]
};

listenVulnerableCalls = async () => {
  web3Eth.eth.subscribe('logs', wssOptions, function (error, result) {
    if (!error) {
      sendMail(result.transactionHash);
    }
  });
}

listenVulnerableCalls();
console.log('Event Listening Started');

const sendMail = (hash) => {
  console.log('mail initiated');
  var mailOptions = {
    from: process.env.MAIL,
    to: process.env.MAIL_TO,
    subject: 'Vulnerable Transaction Alert',
    text: `Vulnerable call detected on transaction hash : ${hash}`
  };

  mailAuth.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

module.exports = eventRoute