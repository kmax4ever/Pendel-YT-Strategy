declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export const askWeb3Permission = async () => {
  try {
    await window.ethereum.enable();
  } catch (e) {
    console.log("Web3 not found!");
  }
};
