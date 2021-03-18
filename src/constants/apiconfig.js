

const baseUrl = 'http://59.110.68.178:8080/' ;

const axios = require('axios');

export  async function swapHistory(account,pageNum=1,showNum=10){
   const method_names =['swapExactTokensForTokens','removeLiquidityWithPermit','addLiquidity'].join(',');
   const pair_addresses=['0x4DeFcc90F3e2Aabce3c767Ce1D2B1a6DAC308628','0xCF8f72E5053D779B5DbA62439E202a81898922F3'].join(',');

   const data =  await  axios.get(`${baseUrl}api/txs?method_names=${method_names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}&pair_addresses=${pair_addresses}`);

  // console.log(data);
  return data.data;

    /*
    http://59.110.68.178:8080/api/txs?method_names=*&
    from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
    pageNum=1&showNum=2
    */



}


//['stake','exit','getReward']


export  async function pledgeHistory(account,pageNum=1,showNum=10){
  const method_names =['stake','exit','getReward'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?method_names=${method_names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;

   /*
   http://59.110.68.178:8080/api/txs?method_names=*&
   from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
   pageNum=1&showNum=2
   */



}


export  async function buildrHistory(account,pageNum=1,showNum=10){
  const method_names =['proxyMinted','proxyBurned','proxyJoined','proxyExited','approval'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?method_names=${method_names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

 console.log(data);
 return data.data;
}

export async function coinohlc(id){
  const data =  await  axios.get(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1`);

//  console.log(data);
 return data.data;


}


export async function pairPrice(pair_address){
  const data =  await  axios.get(`${baseUrl}api/24h_price_info?pair_address=${pair_address}`);

 console.log(data);
 return data.data;


}