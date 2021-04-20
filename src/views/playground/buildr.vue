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
    <br>
    <button @click="getscsudValtAddress">
      scusd 存款
    </button>
    <br>
    <button @click="readscsudValt">
      scusd 累计存款
    </button>
    <br>
    <button @click="withdrawscsudValt">
      scusd 取款
    </button>
    <br>
    <button @click="readMyLP">
      我的 scusd存款份额
    </button>
    <br>
    <button @click="readMyLP2">
      查询我的存款提取的scusd
    </button>
    <br>
    <button @click="lp2Masterwithdraw">
      提取奖励
    </button>
    <button @click="getPriceinfo">
      读取单个交易对价格
    </button>
    <br>
    <button @click="History">
      读取历史记录
    </button>
    <br>
    <button @click="getfetchSynthAssets">
      批量读取合成资产的余额
    </button>
    <br>
    <button @click="readSyntheticHistory">
      读取资产合成历史记录
    </button><br>
    <button @click="Getstore">
      sdk载入系统数据
    </button><br>
    <button @click="openTrove">
      创建
    </button><br>
    <button @click="adjustTrove">
      调整
    </button><br>
    <br>
    <button @click="closeTrove">
      关闭
    </button>
    <br>
    <button @click="changeva">
      构建验证
    </button>
    <br>
    <button @click="fee">
      手续费相关
    </button>
    <br>
    <button @click="getStabilityPool">
      Stability Pool 展示信息相关
    </button>
    <br>
    <button @click="stakeLQTStabilityPool">
      Stability Pool 存钱
    </button>
    <br>
    <button @click="withdrawLUSDFromStabilityPool">
      Stability Pool 取钱
    </button>
    <br>
    <button @click="withdrawGainsFromStabilityPool">
      Stability Pool 提取奖励
    </button>
    <br>
    <button @click="transferCollateralGainToTrove">
      Stability Pool 提取奖励，并将eth存款
    </button>
    <br>
    <button @click="Stakingreadinfo">
      Staking 读取信息
    </button>
    <br>
    <button @click="Stakingpledge">
      Staking 存钱
    </button>
    <br>
    <button @click="StakingWithdraw">
      Staking 取钱
    </button>
    <br>
    <button @click="StakingExtractreward">
      Staking 提取奖励
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
  import {readbuildrHistory,readSyntheticHistory} from '@/contactLogic/history.js';
  import Web3 from 'web3';
  import   {getPrice} from '@/contactLogic/tokenPrice.js';
  import {StakingRewardListbatch} from '@/views/earn/utils/helpUtils/mineUtilFunc.js';
  import {getUnClaimedReward} from '@/contactLogic/earn/Reward.js';
  import {fetchCollateralIndicatorsCurrentDebt} from '@/contactLogic/buildr/create.js';
  import {getSCUSDVaultContract,getMasterUserInfo,getMasterPendingScash,
    getmaxExitableAmount,Masterwithdraw} from '@/contactLogic/earn/scusdDeposit.js';
  import {getTokenPriceinfo,getTokenListPriceinfo,getTokenHistory} from '@/contactLogic/Oracles.js'
  import {fetchSynthAssetsList} from '@/contactLogic/synth/assets.js';
  const { Wallet, providers } = require("ethers");
  const { EthersLiquity,  _connectByChainId } = require("@webfans/lib-ethers");
  import {
    Percent,
    Difference,
    Decimalish,
    Decimal,
    Trove,
    LiquityStoreState,
    LUSD_LIQUIDATION_RESERVE,
    LUSD_MINIMUM_DEBT,//系统最小债务
    MINIMUM_COLLATERAL_RATIO,
    CRITICAL_COLLATERAL_RATIO,
  } from "@liquity/lib-base";
  const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
  const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);
  import { AddressZero } from "@ethersproject/constants";
  export default {
    data() {
      return {
        id:'',
        data:{},
        maxborrowingRate:'',
        trove:'',
        borrowingRate:'',
        state:{}
      }
    },
    methods: {
      async Stakingreadinfo(){
        //lqtyBalance
        var {lqtyBalance,lqtyStake} = this.$data.state;
        var originalStake=lqtyStake;
        //  const collateralGain = originalStake.collateralGain.nonZero?.prettify(4).concat(" ETH");
        // const lusdGain = originalStake.lusdGain.nonZero?.prettify().concat(" ", 'xxx');
        const collateralGain = originalStake.collateralGain.prettify(4).concat(" ETH");
        const lusdGain = originalStake.lusdGain.prettify().concat(" ", 'xxx');
        console.log('stakedLQTY',originalStake.stakedLQTY.prettify().concat(" ", 'xxx'))
        console.log('collateralGain',collateralGain)
        console.log('collateralGain',collateralGain)
        console.log('lusdGain',lusdGain)
      },
      async Stakingpledge(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.stakeLQTY(1,{gasLimit:800000})
        console.log(data)
      },
      async StakingWithdraw(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.unstakeLQTY(1,{gasLimit:800000})
        console.log(data)
      },
      async StakingExtractreward(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.withdrawGainsFromStaking({gasLimit:800000})
        console.log(data)

      },
      async stakeLQTStabilityPool(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.depositLUSDInStabilityPool(100,AddressZero,{gasLimit:800000})
        console.log(data)
      },
      async withdrawLUSDFromStabilityPool(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.withdrawLUSDFromStabilityPool(1,{gasLimit:800000})
        console.log(data)
      },
      async withdrawGainsFromStabilityPool(){
        //提取奖励
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.withdrawGainsFromStabilityPool({gasLimit:800000})
        console.log(data)
      },
      async transferCollateralGainToTrove(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var data = await  liquity.send.transferCollateralGainToTrove({gasLimit:800000})
        console.log(data)
      },
      getStabilityPool(){
        const { remainingStabilityPoolLQTYReward,stabilityDeposit,lusdBalance, lusdInStabilityPool  } = this.$data.state;
        console.log('num LQTY remaining',remainingStabilityPoolLQTYReward.prettify(0))
        console.log(stabilityDeposit)
        const collateralGain = stabilityDeposit.collateralGain.prettify(4).concat(" ETH");
        const lqtyReward = stabilityDeposit.lqtyReward.prettify().concat(" ", 'xx');
        console.log(collateralGain)
        console.log(lqtyReward)
        var  originalDeposit= stabilityDeposit;
        var  editedLUS= stabilityDeposit.currentLUSD;
        const originalPoolShare = originalDeposit.currentLUSD.mulDiv(100, lusdInStabilityPool);
        console.log('originalPoolShare',originalPoolShare.toString())
        const lusdInStabilityPoolAfterChange = lusdInStabilityPool
          .sub(originalDeposit.currentLUSD)
          .add(5);
        const newPoolShare = editedLUSD.mulDiv(100, lusdInStabilityPoolAfterChange);
      },
      feeFrom  (original, edited, borrowingRate) {
        const change = original.whatChanged(edited, borrowingRate);
        if (change && change.type !== "invalidCreation" && change.params.borrowLUSD) {
          return change.params.borrowLUSD.mul(borrowingRate);
        } else {
          return Decimal.ZERO;
        }
      },

      fee(){
        var originalTrove = this.$data.trove;
        var edited = new Trove(originalTrove.collateral, originalTrove.debt);
        const { total, price } = this.$data.state;
        edited=edited.setCollateral(4.5)
        edited=edited.setDebt(100000)
        var borrowingRate = this.$data.borrowingRate ;
        console.log('Liquidation Reserve',LUSD_LIQUIDATION_RESERVE.toString())
        console.log('Borrowing Fee',this.feeFrom(originalTrove, edited, borrowingRate).toString())
        const originalCollateralRatio = !originalTrove.isEmpty ? originalTrove.collateralRatio(price) : undefined;
        const collateralRatio = !edited.isEmpty ? edited.collateralRatio(price) : undefined;
        const collateralRatioChange = Difference.between(collateralRatio, originalCollateralRatio);
        console.log('Collateral ratio ',collateralRatio.toString())
      },
      async changeva(){
        var originalTrove = this.$data.trove;
        var edited = new Trove(originalTrove.collateral, originalTrove.debt);

        edited=edited.setCollateral(4.5)
        edited=edited.setDebt(100000)
        //edited.setDebt(LUSD_MINIMUM_DEBT)
        var  original = originalTrove;
        var borrowingRate = this.$data.borrowingRate ;
        const { total, price } = this.$data.state;
        const change = originalTrove.whatChanged(edited, borrowingRate);
        console.log(change);
        if (!change) {
          //没有变化
          return [undefined, undefined];
        }
        const resultingTrove = originalTrove.apply(change, borrowingRate);
        const recoveryMode = total.collateralRatioIsBelowCritical(price);
        const wouldTriggerRecoveryMode = total
          .subtract(originalTrove)
          .add(resultingTrove)
          .collateralRatioIsBelowCritical(price);
        var sysNextInfocontext={
          resultingTrove,
          recoveryMode,
          wouldTriggerRecoveryMode
        }
        console.log(sysNextInfocontext)
        if (change.type === "invalidCreation") {
          // Trying to create a Trove with negative net debt
          return [undefined,`Debt must be at least ${LUSD_MINIMUM_DEBT.toString()}`]
        }
        console.log('change.type',change.type)
        const errorDescription =
          change.type === "creation"
            ? this.validateTroveCreation(change.params, sysNextInfocontext)
            : change.type === "closure"
            ? this.validateTroveClosure(change.params, sysNextInfocontext)
            : this.validateTroveAdjustment(change.params, sysNextInfocontext);
        console.log('errorDescription',errorDescription);

        if (errorDescription) {
          console.log(1)
          return [undefined, errorDescription];
        }else{
          console.log(2)
          return null
        }


      },
      validateTroveCreation({ depositCollateral },{
        resultingTrove,
        recoveryMode,
        wouldTriggerRecoveryMode
      })
      {
        const { accountBalance, price } = this.$data.state;
        if (resultingTrove.debt.lt(LUSD_MINIMUM_DEBT)) {
          return `Debt must be at least ${LUSD_MINIMUM_DEBT.toString()}`;
        }
        if (recoveryMode){
          if (!resultingTrove.isOpenableInRecoveryMode(price)) {
            return `You're not allowed to open a Trove with less than ${ccrPercent} Collateral
                Ratio during recovery mode. Please increase your Trove's Collateral Ratio.`


          }
        }else{
          if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return `Collateral ratio must be at least ${mcrPercent}.`;
          }
          if (wouldTriggerRecoveryMode) {
            return `You're not allowed to open a Trove that would cause the Total Collateral Ratio to fall
                      below ${ccrPercent}. Please increase your Trove's Collateral Ratio.`;
          }
        }
        if (depositCollateral.gt(accountBalance)) {
          return `The amount you're trying to deposit exceeds your balance by
                    ${depositCollateral.sub(accountBalance).prettify()} BNB.`;
        }
        return null
      },
      validateTroveClosure({ repayLUSD },{recoveryMode,wouldTriggerRecoveryMode})
      {
        var {numberOfTroves,lusdBalance}  = this.$data.state;
        if (numberOfTroves === 1) {
          return `You're not allowed to close your Trove when there are no other Troves in the system.`;
        }
        if (recoveryMode) {
          return `You're not allowed to close your Trove during recovery mode.`;
        }
        if (repayLUSD?.gt(lusdBalance)) {
          return`You need ${repayLUSD.sub(lusdBalance).prettify()} more to close your Trove` ;
        }
        if (wouldTriggerRecoveryMode) {
          return `You're not allowed to close a Trove if it would cause the Total Collateralization Ratio to
        fall below ${ccrPercent}. Please wait until the Total Collateral Ratio
        increases.`;
        }
        return null;
      },
      validateTroveAdjustment({ depositCollateral, withdrawCollateral, borrowLUSD, repayLUSD },
                              {originalTrove,
                                resultingTrove,
                                recoveryMode,
                                wouldTriggerRecoveryMode}){
        var {price,
          accountBalance,
          lusdBalance} = this.$data.state;
        if (recoveryMode) {
          if (withdrawCollateral) {
            return `You're not allowed to withdraw collateral during recovery mode.`;
          }
          if (borrowLUSD){
            if (resultingTrove.collateralRatioIsBelowCritical(price)) {
              return `Your collateral ratio must be at least ${ccrPercent} to borrow during
                    recovery mode. Please improve your collateral ratio.`;
            }
            if (resultingTrove.collateralRatio(price).lt(originalTrove.collateralRatio(price))) {
              return `You're not allowed to decrease your collateral ratio during recovery mode.`;
            }
          }
        }else{
          if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
            return  `Collateral ratio must be at least ${mcrPercent}.`;
          }
          if (wouldTriggerRecoveryMode) {
            return `The adjustment you're trying to make would cause the Total Collateral Ratio to
            fall below ${ccrPercent} . Please increase your Trove's Collateral Ratio.
            `;
          }
        }
        if (repayLUSD) {
          if (resultingTrove.debt.lt(LUSD_MINIMUM_DEBT)) {
            return ` Debt must be at least ${LUSD_MINIMUM_DEBT.toString()}` ;
          }
          if (repayLUSD.gt(lusdBalance)) {
            return `The amount you're trying to repay exceeds your balance by ${repayLUSD.sub(lusdBalance).prettify()}`;
          }
        }
        if (depositCollateral&&depositCollateral.gt(accountBalance)) {
          return `The amount you're trying to deposit exceeds your balance by
                ${depositCollateral.sub(accountBalance).prettify()} ETH`;
        }
        return null;
      },
      async closeTrove(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: '0xc7B375ce501a2432A25d584dF1f40c73c83f9534',
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        const { newTrove } = await liquity.closeTrove({gasLimit:800000})
        console.log(newTrove)
      },
      async adjustTrove(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: '0xc7B375ce501a2432A25d584dF1f40c73c83f9534',
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        const maxBorrowingRate = this.$data.data.maxborrowingRate; // TODO slippage tolerance
        const { newTrove } = await liquity.adjustTrove({
          depositCollateral: 1.5, // ETH
          borrowLUSD: 0
        },maxBorrowingRate,{gasLimit:800000})
        console.log(newTrove)
      },
      async openTrove(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: '0xc7B375ce501a2432A25d584dF1f40c73c83f9534',
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        // const borrowingRate = fees.borrowingRate();
        const maxBorrowingRate = this.$data.data.maxborrowingRate; // TODO slippage tolerance
        console.log()
        const { newTrove } = await liquity.openTrove({
          depositCollateral: 2, // ETH
          borrowLUSD: 1800
        },maxBorrowingRate,{gasLimit:800000})
        console.log(newTrove)
      },
      async Getstore(){
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: '0xc7B375ce501a2432A25d584dF1f40c73c83f9534',
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        var pram = new Trove();
        pram =pram.setCollateral(2.5)
        pram =pram.setDebt(2000) ///首次创建有个最小债务量
        console.log(pram)
        //创建
        //如何拼姐参数？
        liquity.store.onLoaded = () => {
          console.info("Waiting for price drops...");
          console.log(liquity)
          console.log('系统参数',liquity.store.state)
          console.log('accountBalance',liquity.store.state.accountBalance.toString())
          console.log('price',liquity.store.state.price.toString())
          console.log('borrowingRate',liquity.store.state.borrowingRate.toString())
          console.log('collateralSurplusBalance',liquity.store.state.collateralSurplusBalance.toString())
          console.log('lusdBalance',liquity.store.state.lusdBalance.toString())
          console.log('trove.collateral',liquity.store.state.trove.collateral.toString())
          console.log('trove.debt',liquity.store.state.trove.debt.toString())
          console.log('trove.status',liquity.store.state.trove.status.toString())
          console.log('系统统计信息')
          console.log('tvl',liquity.store.state.total.collateral.toString())
          console.log('LUSD supply',liquity.store.state.total.debt.toString())
          console.log('Troves',liquity.store.state.numberOfTroves)
          console.log('LUSD in Stability Pool',liquity.store.state.lusdInStabilityPool.toString())

          // const lusdInStabilityPoolPct =
          // total.debt.nonZero && new Percent(lusdInStabilityPool.div(total.debt));
          // console.log('LUSD in Stability Pool 百分比',liquity.store.state.lusdInStabilityPool.toString())
          console.log('Staked LQTY',liquity.store.state.totalStakedLQTY.shorten())
          console.log('Total Collateral Ratio',liquity.store.state.totalCollateralRatioPct)







          this.$data.data.maxborrowingRate= liquity.store.state.borrowingRate.add(0.005).toString()

          var rate = pram.collateralRatio(liquity.store.state.price)
          console.log(rate.toString()*100+"%")
          this.$data.trove = liquity.store.state.trove;
          this.$data.borrowingRate = liquity.store.state.borrowingRate;
          this.$data.state = liquity.store.state;
          // tryToLiquidate(liquity);
        };
        liquity.store.subscribe(({ newState, oldState }) => {
          // Try to liquidate whenever the price drops
          if (newState.price.lt(oldState.price)) {
            // tryToLiquidate(liquity);
          }
        });
        liquity.store.start();
      },
      async testFN(){
        console.log('----')
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        var connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: '0xc7B375ce501a2432A25d584dF1f40c73c83f9534',
          useStore: "blockPolled"
        })
        console.log(connection)
        const liquity = EthersLiquity._from(connection)
        console.log(liquity)
        console.log('Trove',Trove)
        var pram = new Trove();
        pram =pram.setCollateral(2.5)
        pram =pram.setDebt(2000) ///首次创建有个最小债务量
        console.log(pram)

        //创建
        //如何拼姐参数？
        liquity.store.onLoaded = () => {
          console.info("Waiting for price drops...");
          console.log(liquity)
          console.log('系统参数',liquity.store.state)
          console.log(liquity.store.state.accountBalance.toString())
          console.log(liquity.store.state.price.toString())
          console.log(liquity.store.state.borrowingRate.toString())

          var rate = pram.collateralRatio(liquity.store.state.price)
          console.log(rate.toString()*100+"%")
          // tryToLiquidate(liquity);
        };
        liquity.store.subscribe(({ newState, oldState }) => {
          // Try to liquidate whenever the price drops
          if (newState.price.lt(oldState.price)) {
            // tryToLiquidate(liquity);
          }
        });
        liquity.store.start();
        const { newTrove } = await liquity.adjustTrove({
          depositCollateral: 2.2, // ETH
          borrowLUSD: 2000
        })
        console.log(newTrove)
        /*
        const [sendTransaction] = useTransactionFunction(
  transactionId,
  change.type === "creation"
    ? liquity.send.openTrove.bind(liquity.send, change.params, maxBorrowingRate)
    : change.type === "closure"
    ? liquity.send.closeTrove.bind(liquity.send)
    : liquity.send.adjustTrove.bind(liquity.send, change.params, maxBorrowingRate)
)

        */

        //   const wallet = new Wallet('').connect(library);
        //   const liquity = await EthersLiquity.connect(wallet);
        //  console.log(liquity)
      },
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
      async readSyntheticHistory(){
        // const library = this.ethersprovider;
        const account = this.ethAddress;
        const chainID = this.ethChainID;
        // readSwapHistory(chainID,account,1,10);
        // readPledgeHistory(chainID,account,1,10);
        var data = await readSyntheticHistory(chainID,account,1,10);
        console.log(data)
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
      },
      async getscsudValtAddress(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var Contract = getSCUSDVaultContract({chainID,account, library});
        const  amount = Web3.utils.toWei('10');
        var tx = await Contract.stake(amount);
        console.log(tx)
      },
      async readscsudValt(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var Contract = getSCUSDVaultContract({chainID,account, library});
        console.log(Contract)
        var totalSupply = await Contract.totalSupply()
        console.log(Web3.utils.fromWei(totalSupply.toString()))
      },
      async withdrawscsudValt(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var Contract = getSCUSDVaultContract({chainID,account, library});
        const  amount = Web3.utils.toWei('1');
        var tx = await Contract.exit(account,amount);
        console.log(tx)
      },
      async readMyLP(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var data = await getMasterUserInfo({chainID,account, library});
        console.log(data[0].toString())
        console.log(data[1].toString())
        console.log(data[2].toString())
        console.log('我的份额',data[0].toString())
        // console.log('我的奖励 sccash',data[0].toString())
        var data = await getMasterPendingScash({chainID,account, library});
        console.log('未提取的scash',data.toString())
        // var data2 = getmaxExitableAmount({chainID,account, library});
        // console.log('存款可以提取的scusd数量',data2.toString())
      },
      async readMyLP2(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        // var data = await getMasterUserInfo({chainID,account, library});
        // console.log(data[0].toString())
        // console.log(data[1].toString())
        // console.log(data[2].toString())
        // console.log('我的份额',data[0].toString())
        // // console.log('我的奖励 sccash',data[0].toString())
        // var data = await getMasterPendingScash({chainID,account, library});
        // console.log('未提取的scash',data.toString())
        var data2 = await  getmaxExitableAmount({chainID,account, library});
        console.log('存款可以提取的scusd数量',data2.toString())
      },
      async lp2Masterwithdraw() {
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var tx = await Masterwithdraw({chainID, account, library});
        console.log(tx)
      },
      async getPriceinfo(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var key ='lamb_usdt'
        var result = await getTokenPriceinfo(library,account,chainID,key)
        console.log(result)
        console.log('币对名',Web3.utils.hexToUtf8(result[0]))
        console.log('价格',Web3.utils.fromWei(result[1].toString()))
        console.log('时间戳',result[2].toString())
        console.log('id',result[3].toString())
        this.$data.id = result[3].toString();
        var keys =['lamb_usdt','ht_usdt','eth_usdt']//,'ht_usdt'
        var result = await getTokenListPriceinfo(library,account,chainID,keys)
        console.log('批量读取',result)
      },
      async History(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var key ='lamb_usdt';
        var nowid = this.$data.id-0;
        var data = await getTokenHistory(library,account,chainID,key,nowid)
        console.log(data)
      },
      async getfetchSynthAssets(){
        var chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        var web3 = this.web3;
        var tokenList=['sBTC']
        var data =await fetchSynthAssetsList({web3, chainID, account, library,tokenList})
        console.log(data)
      }
    },
    computed: {
      ...mapState(['ethAddress','ethChainID','web3','ethersprovider']),
    }
  };
</script>
<style lang="less" scoped>
</style>
