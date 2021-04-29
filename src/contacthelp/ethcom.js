const Web3 = require("web3");
import chainConfig from '@/config/config.js';

 export async function getTime() {
  const web3 = new Web3(window.ethereum||chainConfig.walletconnectRPC[chainConfig.getChainID()]);
    // const getBlock = util.promisify(web3.eth.getBlock)
    return new Promise((resolve, reject) => {
     web3.eth.getBlock("latest", (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.timestamp);
        }
      });
    });
  }