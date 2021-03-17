

import {coinohlc} from  "@/constants/apiconfig.js";


export  async function  getHTPrice(){
   const data  = await  coinohlc('huobi-token');
   const  result = data[data.length-1];

   return result[1];
}