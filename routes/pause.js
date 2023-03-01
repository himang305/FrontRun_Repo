const express = require("express");
const pauseRoute = express.Router();
const ABI = require("../ContractABI.json");

require('dotenv').config();  

const Web3 = require("web3");
const ethUrl = process.env.RPC;
const contractAddress = process.env.CONTRACT;
const web3Eth = new Web3(ethUrl);
const owner = process.env.OWNER;

pauseRoute.get("/", async (req, res)=> {
    let result = await pauseWithdraw(req.query.gasPrice);
    res.status(200).send({ "state": result });
}); 

async function pauseWithdraw(gasPrice) {
   
    const contractInstance = new web3Eth.eth.Contract(ABI, contractAddress);

    try {
        let transactionABI = contractInstance.methods.pause().encodeABI();
        let estimateGas = await web3Eth.eth.estimateGas({
            'from': owner,
            'to': contractAddress,
            'data': transactionABI,
        });
        let transactionParameters = {
            to: contractAddress,
            from: owner,
            data: transactionABI,
            chainId: 80001,
            gas: estimateGas,
            gasPrice: gasPrice
        } 
        let key = process.env.PVT_KEY ;
        let signTransaction = await web3Eth.eth.accounts.signTransaction(transactionParameters, key);
        console.log('signTransaction');
        let sentTx = await web3Eth.eth.sendSignedTransaction(signTransaction.rawTransaction);
        console.log('Transaction Hash: ' + sentTx);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

module.exports = pauseRoute
