const express = require('express');
const ethers = require("ethers");
const fs = require('fs');

// Завантаження ABI та excluded addresses
const contractABI = require("./abi.js");
const excludedAddresses = JSON.parse(fs.readFileSync('excluded-addresses.json'));

// Налаштування провайдера та адреси контракту
const RPC = 'https://1rpc.io/3xqg8ovc66BLPn7mp/bnb';
console.log("Перевірка підключення до провайдера");
const provider = new ethers.providers.JsonRpcProvider(RPC);
console.log("Провайдер ініціалізовано");

const contractAddress = '0xa236fd48f30ad4dee145652a71912189855dd575';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Створення сервера
const app = express();
const port = 80;

app.get('/value/:param', async (req, res) => {
    const param = req.params.param;
    let result;

    switch (param) {
        case 'totalsupply': {
            const totalSupply = await contract.totalSupply();
            result = ethers.utils.formatUnits(totalSupply, 18);
            break;
        }
        case 'circulationsupply': {
            const totalSupply = await contract.totalSupply();
            let excludedTotal = ethers.BigNumber.from(0);

            for (let address of excludedAddresses) {
                const balance = await contract.balanceOf(address);
                excludedTotal = excludedTotal.add(balance);
            }

            const circulatingSupply = totalSupply.sub(excludedTotal);
            result = ethers.utils.formatUnits(circulatingSupply, 18);
            break;
        }
        default:
            result = 'Невідомий параметр';
    }

    res.send(result); // Повертаємо результат як простий текст
});

app.listen(port, () => {
    console.log(`Сервер запущений на порті ${port}`);
});
