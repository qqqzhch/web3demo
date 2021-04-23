<template>
  <div class="troves-wrapper">
    <div class="content">
      <div class="title-warpper">
        <div class="title-content">
          <img src="../../assets/img/import.svg" alt="import">
          <h2>Bot functionality</h2>
        </div>
        <p>Liquidation is expected to be carried out by bots.</p>
        <p>
          Early on you may be able to manually liquidate Troves, but as the system matures this will become less
          likely.
        </p>
      </div>
      <!-- <div class="liquidata">
        <div class="title-content">
          <img src="../../assets/img/paper.svg" alt="liquidata">
          <h2>Liquidate</h2>
        </div>
        <div class="input-warpper flex items-center">
          <p>Up to</p>
          <div class="input-item">
            <input type="number">
          </div> -->

      <!-- <p>Troves</p> -->
      <!-- <img src="../../assets/img/delete.svg" alt="delete"> -->
      <!-- </div>
      </div> -->
    </div>
    <div class="list-wapper">
      <h2>Risky Troves</h2>
      <Table :columns="columns1" :data="troveList">
        <template slot="Owner" slot-scope="{row}">
          <div class=" Owner">
            <p>{{ row.ownerAddress }}</p>
          </div>
        </template>
        <template slot="Collateral" slot-scope="{row}">
          <div class=" Collateral">
            <p>{{ row.collateral }} BNB</p>
          </div>
        </template>
        <template slot="Debt" slot-scope="{row}">
          <div class=" Debt">
            <p>{{ row.Debt }} LAI</p>
          </div>
        </template>
        <template slot="Coll.Ratio" slot-scope="{row}">
          <div class=" Coll.Ratio">
            <p :class="row.color">
              {{ row.collateralRatio }}
            </p>
          </div>
        </template>
        <template slot="Coll.Liquidate" slot-scope="{row}">
          <div class=" Coll.Ratio">
            <p>
              <img v-if="1" src="../../assets/img/backspace.svg" alt="delete">
              <img v-else src="../../assets//img/delete-b.svg" alt="delete">
            </p>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import event from '@/common/js/event';
import initLiquity from '@/common/mixin/initLiquity';

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

export default {
  mixins: [initLiquity],
  data() {
    return {
      columns1: [
        {
          title: "Owner",
          slot: "Owner",
          minWidth:350,
        },
        {
          title: "Collateral",
          slot: "Collateral",
          minWidth: 50,
        },
        {
          title: "Debt",
          slot: "Debt",
          minWidth: 50,
        },
        {
          title: "Coll.Ratio",
          slot: "Coll.Ratio",
          minWidth: 100,
        },
        {
          title: "Liquidate",
          slot: "Coll.Liquidate",
          minWidth: 50,
        },
      ],
      
      troveList:[],
      shortAdress:''
    };
  },
  methods: {
  async  list(){
    
    const pageSize=10;
   const clampedPage =0;
   const {numberOfTroves,
      price,
      total,
      lusdInStabilityPool,
      blockTag} =  this.liquityState;
      const recoveryMode= total.collateralRatioIsBelowCritical(price);
      const totalCollateralRatio= total.collateralRatio(price);
      const  data =  await this.liquity
          .getTroves(
            {
              first: pageSize,
              sortedBy: "ascendingCollateralRatio",
              startingAt: clampedPage * pageSize
            },
            { blockTag });
              data.forEach((trove)=>{
        if(recoveryMode){
          trove.disable = this.liquidatableInRecoveryMode(
                                  trove,
                                  price,
                                  totalCollateralRatio,
                                  lusdInStabilityPool
                                );
        }else{
          trove.disable = this.liquidatableInNormalMode(trove, price);
        }
        
       const collateralRatio = trove.collateralRatio(price);
       
      trove.color =collateralRatio.gt(CRITICAL_COLLATERAL_RATIO)
                    ? "success"
                    : collateralRatio.gt(1.2)
                    ? "warning"
                    : "danger";
        trove.collateral = trove.collateral.prettify();
        trove.Debt = trove.debt.prettify();
        trove.collateralRatio = collateralRatio.mul(100).prettify()+"%";
        
        
        // if(collateralRatio.lt(1.1)){
          
        // }      
      });
      this.$data.troveList  =data;
      this.shortAdress = `${this.troveList.ownerAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
      console.log(this.$data.troveList);
          
          
    },
  liquidatableInRecoveryMode(trove,price,totalCollateralRatio,lusdInStabilityPool){
    const collateralRatio = trove.collateralRatio(price);
  if (collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) && collateralRatio.lt(totalCollateralRatio)) {
    if(trove.debt.lte(lusdInStabilityPool)){
      return "There's not enough LUSD in the Stability pool to cover the debt";
    }else{
      return false;
    }
  } else {
    return this.liquidatableInNormalMode(trove, price);
  }
  },
  liquidatableInNormalMode(trove,price){
    if(trove.collateralRatioIsBelowMinimum(price)){
        return "Collateral ratio not low enough";
    }else{
       return false;
    }
    
    
  }

  },
  mounted() {
    console.log('---');
    const _this=this;
   var id = setInterval(() => {
     if(_this.liquityState&&_this.liquityState.blockTag){
       clearInterval(id);
      _this.list();

    }
      
    }, 100);
    
    
  },
  wacth:{
    // liquityReady:function(){
    //   if(this.liquityState&&this.liquityState.blockTag){
    //     this.list();
    //   }

    // }
  },
  computed: {
    ...mapState('pool', ['liquity']),
    ...mapState('buildr', ['liquityState','liquityReady']),
    liquityInstance() {
      const val = this.liquity && this.liquity.send;
      return val;
    },
  }
};
</script>

<style lang="less" scoped>
.troves-wrapper {
  font-family: Gilroy-Bold, Gilroy;
  color: #ffffff;
  h2 {
    font-size: 26px;
    font-family: Gilroy-Bold, Gilroy;
    font-weight: 500;
    color: #ffffff;
    line-height: 38px;
  }
  .title-content {
    margin: 8px 0 16px;
    display: flex;
    align-items: center;
    img {
      max-width: 30px;
      margin-right: 10px;
    }
  }
  .content {
    width: 100%;
    background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    .title-warpper {
      p {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #ffffff;
        line-height: 16px;
        margin: 8px 0 16px;
      }
    }
    .liquidata {
      margin-top: 40px;
      width: 40%;
      .input-warpper {
        margin-top: 16px;
        p {
          font-size: 24px;
        }
        .input-item {
          width: 60%;
          height: 34px;
          margin: 0 10px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #fff;
          input {
            width: 100%;
            height: 100%;
            background: transparent;
            color: #fff;
            font-size: 20px;
            padding: 5px 10px;
          }
        }
        img {
          cursor: pointer;
          max-width: 26px;
          margin-left: 10px;
        }
      }
    }
  }
  .list-wapper {
    margin-top: 30px;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    padding: 24px;
    border-radius: 12px;
    h2 {
      color: #333;
      margin-bottom: 16px;
    }
    img{
      max-width: 30px;
    }
  }
}
.success{
 color:green
}
.warning{
color:yellow
}
.danger{
color:red
}
</style>