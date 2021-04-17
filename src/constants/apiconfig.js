

const baseUrl = 'http://59.110.68.178:8086/' ;

const axios = require('axios');

export  async function swapHistory(account,pageNum=1,showNum=10,chainID){
   const method_names =['swapExactTokensForTokens','removeLiquidityWithPermit','addLiquidity',
  'addLiquidityETH','swapExactETHForTokens','removeLiquidityETHWithPermit','swapExactTokensForETH',
  'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'].join(',');

   const pair_addresses=[
    '0x4B5ea1218Ac0544fb03617ca9780a2b0ed7edef5',
    '0x51f624116513a9f4606a368f2eC9899c821258B3',
    '0x0CC750e4426D677657409fab33E7957DDA8cC1F1',
    '0x01c06572D6d351863270baC558ca945E2DBB56FE',
  ].join(',');

   const data =  await  axios.get(`${baseUrl}api/txs?&category=swap&from=${account}&pageNum=${pageNum}&showNum=${showNum}&pair_addresses=${pair_addresses}`);

  // console.log(data);
  return data.data;

    /*
    http://59.110.68.178:8080/api/txs?method_names=*&
    from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
    pageNum=1&showNum=2
    */



}


//['stake','exit','getReward']


export  async function pledgeHistory(account,pageNum=1,showNum=10,chainID){
  const names =['uniswap_stake','synthetic_stake'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?&category=${names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;

   /*
   http://59.110.68.178:8080/api/txs?method_names=*&
   from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
   pageNum=1&showNum=2
   */



}


export  async function buildrHistory(account,pageNum=1,showNum=10,chainID){
  const method_names =['Mint','Burn','Join','Exit','approval'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?&category=builder&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;
}

export async function coinohlc(id){
  const data =  await  axios.get(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1`);

//  console.log(data);
 return data.data;


}


export async function pairPrice(pair_address){
  const data =  await  axios.get(`${baseUrl}api/24h_price_info?pair_address=${pair_address}`);

//  console.log(data);
 return data.data;


}


export  async function syntheticHistory(account,pageNum=1,showNum=10,chainID){
  const names =['synthetic_exchange','synthetic_stake'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?&category=${names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;

   /*
   http://59.110.68.178:8080/api/txs?method_names=*&
   from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
   pageNum=1&showNum=2
   */



}