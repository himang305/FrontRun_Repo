const express = require("express");
require('dotenv').config();
const request = require('request-promise');
const mempoolRoute = express.Router();
const Web3 = require("web3");
const url = process.env.WSS;
const contractAddress = process.env.CONTRACT;
const functionSignature = process.env.FUNCTIONSIG;

var options = {
    timeout: 30000,
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 15,
        onTimeout: false,
    },
};

var web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));
const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});

async function init() {
    subscription.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx.to == contractAddress && tx.input.includes(functionSignature)) { // signature for Withdraw()
                    pauseContract(tx.gasPrice);
                }
            } catch (err) {
                console.error(err);
            }
        });
    });
};
// gasPrice  2500000032

async function pauseContract(gas) {

    const options = {
        uri: `http://localhost:3000/pause`,
        json: true,
        qs: {
            gasPrice: Number(gas + 500)
        },
        resolveWithFullResponse: true,
        method: 'GET'
    };

    return request(options).then((response) => {
        console.log('Last response : ', response.body);
    }).catch((err) => {
        console.log('errorstatuscode:' + err.statusCode)
    })
}

init();

module.exports = mempoolRoute