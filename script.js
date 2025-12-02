const connectButton = document.getElementById('connectButton');
const accountInfo = document.getElementById('accountInfo');
if (typeof window.ethereum !== 'undefined') {
console.log('установлен!');
// Создаем провайдер Ethers.js
const provider = new ethers.providers.Web3Provider(window.ethereum);
// Слушаем событие подключения кошелька
connectButton.addEventListener('click', async () => {
try {
await window.ethereum.request({ method: 'eth_requestAccounts' });
const signer = provider.getSigner();
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
accountInfo.innerHTML = `
<p>Адрес кошелька: ${address}</p>
<p>Баланс (в Wei): ${balance.toString()}</p>
<p>Баланс (в Ether): ${ethers.utils.formatEther(balance)}</p>
`;
} catch (error) {
console.error("Ошибка при подключении:", error);
}
});
}
else {
accountInfo.innerHTML = '<p>Пожалуйста, установите .</p>';
}
