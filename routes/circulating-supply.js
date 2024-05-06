const express = require('express');
const ethers = require("ethers");
const fs = require('fs');
const router = express.Router();

// Завантаження ABI та excluded addresses
const contractABI = require("./abi.js");
const excludedAddresses = JSON.parse(fs.readFileSync('excluded-addresses.json'));

// Налаштування провайдера та адреси контракту
const RPC = 'https://1rpc.io/3xqg8ovc66BLPn7mp/bnb';
console.log("Перевірка підключення до провайдера");
const provider = new ethers.providers.JsonRpcProvider(RPC);
console.log("Провайдер ініціалізовано");

// Інші частини коду
const contractAddress = '0xa236fd48f30ad4dee145652a71912189855dd575';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

router.get('/circulating-supply', async (req, res) => {
    const totalSupply = await contract.totalSupply();
    let excludedTotal = ethers.BigNumber.from(0);

    for (let address of excludedAddresses) {
        const balance = await contract.balanceOf(address);
        excludedTotal = excludedTotal.add(balance);
    }

    const circulatingSupply = totalSupply.sub(excludedTotal);
    const formattedCirculatingSupply = ethers.utils.formatUnits(circulatingSupply, 18);

    res.json({
        totalSupply: ethers.utils.formatUnits(totalSupply, 18),
        excludedTotal: ethers.utils.formatUnits(excludedTotal, 18),
        circulatingSupply: formattedCirculatingSupply
    });
});

module.exports = router;