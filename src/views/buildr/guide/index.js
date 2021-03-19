import  {collateralPools} from '@/contactLogic/buildr/balance.js';

import { mapState } from 'vuex';

import {
  fetchAllowanceAmount,
} from '@/contactLogic/buildr/create';

import Cookies  from  'js-cookie' ;
import {checkeBulderApprove} from './checkeBulderApprove.js';

export default {
  name: 'manage',
  components: {
  },
  methods: {
  //  async checkeapprove(){
  //     //检测金库是否授权
  //     const chainID = this.ethChainID ;
  //     const library = this.ethersprovider;
  //     const account = this.ethAddress;
  //     if(this.checklocal()=='true'){
  //       console.log('已经授权过了');
  //       this.$router.push('/buildr/balance');
  //       return ;
  //     }
      
  //     const callList = [];
  //     collateralPools.forEach(element => {
  //       console.log(element.token);
  //       const tokenName = element.token;

  //       callList.push(fetchAllowanceAmount({ chainID, account, library, tokenName }));
        
  //     });
  //     const  AllowanceList = await  Promise.all(callList);

  //     console.log(AllowanceList);
  //     let  haveAllowance=false;

  //     AllowanceList.forEach((item)=>{

  //       if(item.allowanceAmount !='0'){
  //         haveAllowance = true ;
  //       }

  //     });
  //     console.log('haveAllowance',haveAllowance);

  //     if(haveAllowance){
  //       // 页面跳转
  //       //cookie 保存 页面跳转
  //       Cookies.set(account+"_"+chainID+"_"+'buildrhaveAllowance', haveAllowance, { expires: 365, path: '/' });

  //       this.$router.push('/buildr/balance');
  //     }

      

  //   },
  //  checklocal(){
  //   const chainID = this.ethChainID ;
  //   const library = this.ethersprovider;
  //   const account = this.ethAddress;
  //   const    buildrhaveAllowance = Cookies.get(account+"_"+chainID+"_"+'buildrhaveAllowance');
  //   console.log('cookie',buildrhaveAllowance);
  //    return buildrhaveAllowance;

  //  },
   CreateCDP(){
    this.$router.push('/buildr/create');
   },
 async  checkeapprove(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      await  checkeBulderApprove(this.$router,chainID,library,account);

   }
    
  },
  mounted() {
    console.log(collateralPools);

    if(this.ethAddress){
      this.checkeapprove();
    }
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress','web3','ethersprovider']),
  },
  watch:{
    ethAddress:function(){
      if(this.ethAddress){
        this.checkeapprove();

      }

    }

  }
};
