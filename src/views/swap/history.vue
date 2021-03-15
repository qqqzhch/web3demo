<template>
  <div class="content-wapper">
    <div class="exchanges-wapper">
      <p class="exchanges-title">
        Order History
      </p>
      <div class="list-wapper">
        <div class="list-title flex">
          <span class="pair">Pair</span>
          <span class="price">Action</span>
          <span class="amount">Amount</span>
          <span class="amount">Recived</span>
          <span class="status">Status</span>
        </div>
        <Scroll
          :loading-text="'loading....'"
          :on-reach-bottom="onreachbottom"
          :height="550"
        >
          <div
            v-for="item in list"
            :key="item.hash"
            class="list-item"
          >
            <div>
              <img
                width="32"
                :src="getTokenImg(item.show.tokenB)"
              >
              <p>{{ item.show.tokenB }}/{{ item.show.tokenA }}</p>
            </div>
            <p class="price">
              {{ actions[item.method_name] }}
            </p>
            <p class="amout">
              <span v-if="item.show.inamount.constructor === Array">
                {{ item.show.inamount[0]|format1e18ValueList }} {{ item.show.tokenA }}<br>
                {{ item.show.inamount[1]|format1e18ValueList }} {{ item.show.tokenB }}
              </span>
              <span v-else>
                {{ item.show.inamount|format1e18ValueList }}
                <span v-if="item.show.outamount.constructor === Array">
                  LP
                </span>
                <span v-else>
                  {{ item.show.tokenA }}
                </span>
              </span>
            </p>
            <p class="amout">
              <span v-if="item.show.outamount.constructor === Array">
                {{ item.show.outamount[0]|format1e18ValueList }} {{ item.show.tokenA }}<br>
                {{ item.show.outamount[1]|format1e18ValueList }} {{ item.show.tokenB }}
              </span>
              <span v-else>
                {{ item.show.outamount|format1e18ValueList }} 
                <span v-if="item.show.inamount.constructor === Array">
                  LP
                </span>
                <span v-else>
                  {{ item.show.tokenB }}
                </span>
              </span>
            </p>
            <p class="status executed">
              {{ item.tx_status==1?"Executed":"Fail" }} 
            </p>
          </div>
        </Scroll>
        <!-- <div
          v-if="pairloading"
          class="demo-spin-container "
        >
          <loading />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {readSwapHistory} from '@/contactLogic/history.js';
import {getToken,getTokenImg} from '@/contactLogic/readbalance.js';


export default {
  data() {
    return {
      list:[],
      actions:{
        'swapExactTokensForTokens':'swap',
        'addLiquidity':'addLiquidity',
        'removeLiquidityWithPermit':'removeLiquidity'
      },
      pageIndex:1,
      pageNum:1,
      pairloading:false
    };
  },
  components:{
    loading: () => import("@/components/basic/loading.vue"),

  },
  methods: {
   getTokenImg(tokensymbol){
      const chainID = this.ethChainID ;
      return getTokenImg(tokensymbol,chainID);
    },
   async  getreadSwapHistory(){
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const chainID = this.ethChainID;
      
      const   data = await readSwapHistory(chainID,account,this.$data.pageIndex,10);

      this.$data.list = this.$data.list.concat (data.data);

      if(data.count%10==0){
        this.$data.pageNum = data.count/10;

      }else{
        this.$data.pageNum = (data.count-data.count%10)/10+1;
      }
      this.$data.pairloading = false ;
      

    },
    onreachbottom(){
      console.log('onreachbottom',this.$data.pageIndex);
      if(this.$data.pageIndex<this.$data.pageNum)
      this.$data.pairloading = true ;
      
      const  _this = this;

      return new Promise( resolve => {
           setTimeout(async () => {
             _this.$data.pageIndex+=1;
             await _this.getreadSwapHistory();
             resolve({})   ;

           },1);
        
          });

    }
    
  },
  mounted() {
    this.$data.pageIndex =1;
    this.$data.list= [] ;
    if(this.ethAddress){
      
      this.getreadSwapHistory();
    }
    
  },
  watch:{
    ethAddress:function(){
       if(this.ethAddress){
         this.getreadSwapHistory();
      }
    }
  },
  computed: {
    ...mapState(['ethAddress','ethChainID','web3','ethersprovider']),
  }
};
</script>

<style lang="less" scoped>
.content-wapper {
  height: 749px;
  width: 980px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 100px;
  padding: 44px;
  .exchanges-wapper {
    .exchanges-title {
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
    }
    .list-wapper {
      .list-title {
        margin: 16px 0;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        span {
          width: 30%;
          height: 14px;
          font-size: 12px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 14px;
        }
        .status{
          width: 10%;
        }
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        cursor: pointer;
        width: 860px;
        height: 56px;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
        padding: 16px;
        position: relative;
        div {
          display: flex;
          width: 30%;
          img {
            margin-right: 8px;
            p {
              height: 80px;
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #14171c;
              line-height: 19px;
            }
          }
        }
        .price {
          width: 30%;
          height: 19px;
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
        .amout{
          width: 30%;
        }
        .status{
          width: 10%;
        }
        .executed{
          color: #00D075;
        }
        .fall{
          color: #FF3C00;
        }
        .sending{
          color: #0058ff;
        }

      }
      .list-item::before {
        content: "";
        height: 56px;
        width: 2px;
        background: #0058ff;
        position: absolute;
        left: 0;
        top: 0;
        display: none;
      }
    }
  }
}



.demo-spin-container{
    display: inline-block;
    width: 100%;
    height: 100px;
    position: relative;
  }
</style>