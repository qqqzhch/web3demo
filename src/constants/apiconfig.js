

const baseUrl = 'http://59.110.68.178:8080/' ;

const axios = require('axios');

export  async function swapHistory(account,pageNum=1,showNum=10){
   const method_names =['swapExactTokensForTokens','removeLiquidityWithPermit','addLiquidity'].join(',');

   const data =  await  axios.get(`${baseUrl}api/txs?method_names=${method_names}&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

  console.log(data);
  return data.data;

    /*
    http://59.110.68.178:8080/api/txs?method_names=*&
    from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
    pageNum=1&showNum=2
    */



}