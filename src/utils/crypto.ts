// import EthCrypto from 'eth-crypto'
import utils from "web3-utils";
import EthereumEncryption from "ethereum-encryption";
import Dex from "config/contracts/Dex.json";
import Eth from "web3-eth";
//@ts-ignore
const eth = new Eth();

export const encryptMessage = async (_publicKey: string, _msg: string) => {
  const publicKey = _publicKey.slice(2);
  const encrypted = EthereumEncryption.encryptWithPublicKey(
    publicKey, // publicKey
    _msg // data
  );
  return encrypted;
};

export const decryptMessage = async (
  _privateKey: string,
  _encryptedMsg: string
) => {
  const privateKey = _privateKey.slice(2);
  const rs = EthereumEncryption.decryptWithPrivateKey(
    privateKey, // privateKey
    _encryptedMsg // encrypted-data
  );
  return rs;
};

export const publicKeyToAddress = (publicKey: string) => {
  try {
    const hash = utils.sha3("0x" + publicKey.slice(4)) || "";
    const address = "0x" + hash.slice(26);
    return address;
  } catch (e) {
    return false;
  }
};

export const toWei = (value: number) => {
  return utils.toWei(value.toFixed(16).toString(), "ether");
};

export const fromWei = (value: number | string) => {
  return utils.fromWei(value.toString(), "ether");
};

export const CONTRACTS = {
  DEX: {
    ABI: Dex.abi,
    ADDRESS: Dex.networks["66"].address,
  },
};

export const addressBytes32 = (address: string) => {
  const without0x = address.slice(2);
  const rs = utils.padLeft(without0x, 2 * 32);
  return "0x" + rs;
};

const getEvents = (sig?: any) => {
  // const rs = {};
  // Object.keys(CONTRACTS).forEach(function(key) {
  //     const CONTRACT = Object(CONTRACTS)[key];
  //     const ABI = CONTRACT.ABI;
  //     ABI.forEach((abi) => {
  //         if (abi.type === 'event') {
  // console.log('xxx abi ', abi)
  //             const id = abi.signature + CONTRACT.ADDRESS;
  //             rs[`${id}`] = {
  //                 contract: {
  //                     name: key,
  //                     address: CONTRACT.ADDRESS,
  //                 },
  //                 event: abi,
  //             };
  //         }
  //     });
  // });
  const rs = CONTRACTS.DEX.ABI.filter((abi) => {
    return abi.type === "event" && abi.signature === sig;
    // if (abi.type === 'event') {
    // console.log('xxx abi ', abi)
    //     const id = abi.signature + CONTRACT.ADDRESS;
    //     rs[`${id}`] = {
    //         contract: {
    //             name: key,
    //             address: CONTRACT.ADDRESS,
    //         },
    //         event: abi,
    //     };
    // }
  });
  return rs[0];
};

export const EVENTS = getEvents();

const decodeLog = (log: any) => {
  const signature = log.topics[0];
  const eventAbi = getEvents(signature);
  const { inputs, anonymous } = eventAbi;
  const hexString = log.data;
  if (!anonymous) {
    log.topics.splice(0, 1);
  }
  const returnValues = eth.abi.decodeLog(inputs, hexString, log.topics);
  // 8000000 / 76 ~ 1e5
  return {
    event: eventAbi.name,
    returnValues,
    blockNumber: log.blockNumber,
    logIndex: log.logIndex,
  };
};

export const logEvents = (logs: any) => {
  if (logs.length === 0) return [];
  const events = logs.map((log: any) => decodeLog(log));
  return events.sort((a: any, b: any) => {
    if (a.blockNumber !== b.blockNumber) {
      return Number(a.blockNumber) - Number(b.blockNumber);
    } else {
      return Number(a.logIndex) - Number(b.logIndex);
    }
  });
};

export const getRawPrivKeyTrx = (privkey: string) => {
  return privkey.substring(2);
};
