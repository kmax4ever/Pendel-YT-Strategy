import * as web3 from "web3";
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

const Web3 = new web3.default();

export const isAddress = (address: string) => {
  Web3.utils.isAddress(address);
};
