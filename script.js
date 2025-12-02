const connectButton = document.getElementById('connectButton');
const accountInfo = document.getElementById('accountInfo');

const incrementButton = document.getElementById('incrementButton');
const countDisplay = document.getElementById('countDisplay');
const currentBlockSpan = document.getElementById('currentBlock');
const blockCountSpan = document.getElementById('blockCount');
const timeAfterSpan = document.getElementById('timeAfter');
const chainIdSpan = document.getElementById('chainId');

// Адрес вашего развернутого контракта BlockInfo
const contractAddress = "0x2905ecCAf4ad7f3773393EEceD2a534729AB88F2"; 

// ABI контракта
const contractAbi = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "inputs": [], "name": "creationBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "creationTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "count", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "increment", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getCurrentBlockNumber", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getBlockCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getTimeAfter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getNet", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

let provider, signer, contract;

if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);

    connectButton.addEventListener('click', async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            accountInfo.innerHTML = `
                <p>Адрес кошелька: ${address}</p>
                <p>Баланс (в ETH): ${ethers.utils.formatEther(balance)}</p>
            `;
            // Инициализация контракта после подключения
            contract = new ethers.Contract(contractAddress, contractAbi, signer);
            await updateInfo();
        } catch (error) {
            console.error("Ошибка при подключении:", error);
        }
    });

    incrementButton.addEventListener('click', async () => {
        if (!contract) return alert("Подключите кошелек!");
        await contract.increment();
        alert("count увеличен!");
        await updateInfo();
    });

    async function updateInfo() {
        const count = await contract.count();
        const currentBlock = await contract.getCurrentBlockNumber();
        const blockCount = await contract.getBlockCount();
        const timeAfter = await contract.getTimeAfter();
        const chainId = await contract.getNet();

        countDisplay.innerText = count.toString();
        currentBlockSpan.innerText = currentBlock.toString();
        blockCountSpan.innerText = blockCount.toString();
        timeAfterSpan.innerText = timeAfter.toString();
        chainIdSpan.innerText = chainId.toString();
    }
} else {
    alert('Установите MetaMask или другой совместимый кошелек.');
}
