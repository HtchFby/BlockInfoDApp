// Вставь сюда адрес твоего развернутого контракта
const contractAddress = '0x3C80DAF6099538971ceD6C4377E40bAd4D7cD614';

// ABI твоего контракта BlockInfo
const contractAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "count",
        "outputs": [{"internalType": "uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creationBlock",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creationTimestamp",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentBlockNumber",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBlockCount",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeAfter",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNet",
        "outputs": [{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Проверяем наличие MetaMask
if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const connectButton = document.getElementById('connectButton');
    const accountInfo = document.getElementById('accountInfo');

    let signer;
    let contract;

    connectButton.onclick = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            accountInfo.innerHTML = `
                <p>Адрес кошелька: ${address}</p>
                <p>Баланс (Ether): ${ethers.utils.formatEther(balance)}</p>
            `;
            contract = new ethers.Contract(contractAddress, contractAbi, signer);
            // Показываем сразу начальные данные
            updateContractData();
        } catch (err) {
            console.error(err);
        }
    };

    const incrementButton = document.getElementById('incrementButton');
    const getCountButton = document.getElementById('getCountButton');

    incrementButton.onclick = async () => {
        if (!contract) return alert("Сначала подключите кошелек!");
        const tx = await contract.increment();
        await tx.wait();
        alert("Count увеличен!");
        updateContractData();
    };

    getCountButton.onclick = async () => {
        if (!contract) return alert("Сначала подключите кошелек!");
        updateContractData();
    };

    async function updateContractData() {
        const count = await contract.count();
        const currentBlock = await contract.getCurrentBlockNumber();
        const blockCount = await contract.getBlockCount();
        const timeAfter = await contract.getTimeAfter();
        const chainId = await contract.getNet();

        document.getElementById('countDisplay').innerText = count;
        document.getElementById('currentBlock').innerText = currentBlock;
        document.getElementById('blockCount').innerText = blockCount;
        document.getElementById('timeAfter').innerText = timeAfter;
        document.getElementById('chainId').innerText = chainId;
    }

} else {
    alert('Установите MetaMask или другой кошелек.');
}
