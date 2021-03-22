

import {coinohlc} from  "@/constants/apiconfig.js";


export  async function  getPrice(coinID){
   const data  = await  coinohlc(coinID);
   const  result = data[data.length-1];

   return result[1];
}