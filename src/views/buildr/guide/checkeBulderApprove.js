import  { getCollateralPools } from '@/contactLogic/buildr/balance.js';

import {
    fetchAllowanceAmount,
  } from '@/contactLogic/buildr/create';

  import Cookies  from  'js-cookie' ;


  export async function checkeBulderApprove($router,chainID,library,account){
    //检测金库是否授权

    if(checklocal(chainID,account)=='true'){
      console.log('已经授权过了');
      $router.push('/buildr/balance');
      return true;
    }

    const callList = [];
    const collateralPools = getCollateralPools(chainID);
    collateralPools.forEach(element => {
      console.log(element.token);
      const tokenName = element.token;

      callList.push(fetchAllowanceAmount({ chainID, account, library, tokenName }));

    });
    const  AllowanceList = await  Promise.all(callList);

    console.log(AllowanceList);
    let  haveAllowance=false;

    AllowanceList.forEach((item)=>{

      if(item.allowanceAmount !='0'){
        haveAllowance = true ;
      }

    });
    console.log('haveAllowance',haveAllowance);

    if(haveAllowance){
      // 页面跳转
      //cookie 保存 页面跳转
      Cookies.set(account+"_"+chainID+"_"+'buildrhaveAllowance', haveAllowance, { expires: 365, path: '/' });

      $router.push('/buildr/balance');
    }



  }

 export function checklocal(chainID,account){

    const    buildrhaveAllowance = Cookies.get(account+"_"+chainID+"_"+'buildrhaveAllowance');
    console.log('cookie',buildrhaveAllowance);
     return buildrhaveAllowance;

   }
