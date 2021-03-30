<template>
  <div>
    <button @click="approve">
      授权操作
    </button><br>
    <button @click="join">
      加入操作
    </button><br>
    <button @click="queryAvailableassets">
      查询可用lamb
    </button><br>
    <button @click="tokenMint('LAMB')">
      铸造操作
    </button><br>
    <button @click="getSCusdt">
      查询可用的scusdt
    </button><br>
    <button @click="tokenBurn('LAMB')">
      释放
    </button>
    <br>
    <button @click="tokenExit('LAMB')">
      取出LAMB
    </button><br>
    <button @click="readHistory">
      读取历史记录
    </button><br>
    <button @click="chainTokenPrice">
      <br>
      读取ht价格
    </button>
    <br>

    <button @click="getearnList">
      读取赚钱列表
    </button>
    <br>
    <button @click="syncReward">
      读取铸造金库未提取的奖励
    </button>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState } from 'vuex';

import  {useProxyActionsContractRead,useProxyContractRead,useProxyActionsContractSigna,
useTokenbalance,
useCollateralContractRead}  from '@/contactLogic/buildr/contractApi.js';

import {getTokenBySymbol,getProxyActionsToken,getProxyToActionsToken,
getCollateralToken}  from '@/contactLogic/buildr/tokens.js';

import {useTokenApprove} from '@/contacthelp/Approve.js';

import {readbuildrHistory} from '@/contactLogic/history.js';


import Web3 from 'web3';

import   {getPrice} from '@/contactLogic/tokenPrice.js';

import {StakingRewardListbatch} from '@/views/earn/utils/helpUtils/mineUtilFunc.js';

import {getUnClaimedReward} from '@/contactLogic/earn/Reward.js';

import {fetchCollateralIndicatorsCurrentDebt} from '@/contactLogic/buildr/create.js';


export default {
  methods: {
   async approve(){
      console.log('- -');
      const chainID = this.ethChainID ;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const token = getProxyActionsToken(chainID);

      const methodName  = 'target' ;
      const  parameter  = [] ;

      const target = await useProxyContractRead(
          library,
          account,
          token,
          methodName,
          parameter
        );
      //target 需要操作lamb 授权的地址

      console.log(target);

      const  lambToken =  getTokenBySymbol(chainID,'LAMB');
      const  spender =target;
      const  amount = Web3.utils.toWei('1000000');

      const  tx = await useTokenApprove(library,
          account,
          lambToken,
          spender,
          amount);

      console.log(tx);



   },
   async join (){
     const tokenName ='LAMB';

     const chainID = this.ethChainID ;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const token = getProxyToActionsToken(chainID);

      const ProxyActionsContract = useProxyActionsContractSigna(library,account,token);

      let currencyKey =   Web3.utils.stringToHex(tokenName);
      currencyKey = Web3.utils.rightPad(currencyKey, 64) ;
      const amount = Web3.utils.toWei('1000000');
      try {
      const result = await ProxyActionsContract.join(currencyKey, amount);
      console.log(result);
      } catch (error) {
        console.log(error);

      }



      //

     //getProxyToActionsToken

   },
  async queryAvailableassets(){
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const tokenName ='LAMB';

      let currencyKey = Web3.utils.stringToHex(tokenName);
      currencyKey = Web3.utils.rightPad(currencyKey, 64) ;
      const token = getProxyToActionsToken(chainID);
      const methodName='collateralAddress';
      const parameter =[currencyKey];
      const tokenCollateralAddress = await useProxyActionsContractRead(library,account,token,methodName,parameter);
      console.log('tokenCollateralAddress',tokenCollateralAddress);
      const templateCollateralToken = getCollateralToken(chainID);
      templateCollateralToken.address = tokenCollateralAddress;
      const methodName2 = 'unlockedCollateral';
      const parameter2 = [account];
      const data = await  useCollateralContractRead(library,account,templateCollateralToken,methodName2,parameter2);
      console.log(data.toString());

   },
    async tokenMint(tokenName){
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const token = getProxyToActionsToken(chainID);
      const ProxyActionsContract = useProxyActionsContractSigna(library,account,token);
      let currencyKey =  Web3.utils.stringToHex(tokenName);
      currencyKey = Web3.utils.rightPad(currencyKey, 64) ;
      const amount = Web3.utils.toWei('10');
      try {
      //  const result = await ProxyActionsContract.mint(currencyKey, amount);
      // result.on('receipt',(receipt)=>{
      //   console.log(receipt)
      // }).on('transactionHash', function(hash){
      //   console.log(hash)
      // })
      // .on('confirmation', function(confirmationNumber, receipt){
      //   console.log(confirmation)

      // })

      } catch (error) {
        console.log(error);
      }
    },
    async tokenBurn(tokenName){
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const token = getProxyToActionsToken(chainID);
      const ProxyActionsContract = useProxyActionsContractSigna(library,account,token);
      let currencyKey = Web3.utils.stringToHex(tokenName);
      currencyKey = Web3.utils.rightPad(currencyKey, 64) ;
      const amount = Web3.utils.toWei('1');
      try {
      //  const result = await ProxyActionsContract.burn(currencyKey, amount);
      // result.on('receipt',(receipt)=>{
      //   console.log(receipt)
      // }).on('transactionHash', function(hash){
      //   console.log(hash)
      // })
      // .on('confirmation', function(confirmationNumber, receipt){
      //   console.log(confirmation)

      // })

      } catch (error) {
        console.log(error);
      }
    },
      async tokenExit(tokenName){
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const token = getProxyToActionsToken(chainID);
      const ProxyActionsContract = useProxyActionsContractSigna(library,account,token);
      let currencyKey = Web3.utils.stringToHex(tokenName);
      currencyKey = Web3.utils.rightPad(currencyKey, 64) ;
      const amount = Web3.utils.toWei('1');
      try {
      const result = await ProxyActionsContract.exit(currencyKey, amount);
      console.log(result);
      } catch (error) {
        console.log(error);

      }
    },
    async getSCusdt() {
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const chainID = this.ethChainID;

      const SynthetixToken = getTokenBySymbol(chainID,'scUSD');
      const data = await useTokenbalance(library, account, SynthetixToken);
      if (data) {
       const tUSDBalance = data.toSignificant(6);
        // this.$store.commit('changeTUSDBalance', tUSDBalance);
        console.log('tUSDBalance',tUSDBalance);
      }
    },
    async readHistory(){
      // const library = this.ethersprovider;
      const account = this.ethAddress;
      const chainID = this.ethChainID;

      // readSwapHistory(chainID,account,1,10);
      // readPledgeHistory(chainID,account,1,10);
      readbuildrHistory(chainID,account,1,10);
    },
   async chainTokenPrice(){

     const data = await getPrice();

     console.log(data);

    },
    async getearnList(){
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const chainID = this.ethChainID;
       StakingRewardListbatch(library, account, chainID)

    },
    async syncReward(){
      var web3 = this.web3;
      var chainID = this.ethChainID;
      const account = this.ethAddress;
      const library = this.ethersprovider;
      var tokenName = 'LAMB';

      var data = await getUnClaimedReward({ web3, chainID, account, library, tokenName })

      console.log('未提取的奖励',data.toString())
      var data2 = await fetchCollateralIndicatorsCurrentDebt({ web3, chainID, account, library, tokenName })
      console.log('参与铸造的scusd',data2.toString())



    }

  },
  computed: {
    ...mapState(['ethAddress','ethChainID','web3','ethersprovider']),
  }

};
</script>
<style lang="less" scoped>

</style>