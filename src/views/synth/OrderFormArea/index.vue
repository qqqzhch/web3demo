<template>
  <div class="from-warpper">
    <div class="Tab-wapper flex">
      <button :class="{'active': side === 'buy'}" @click="onChangeTab('buy')">
        Buy {{ focusedProduct.baseSymbol }} <span />
      </button>
      <button :class="{'active': side === 'sell'}" @click="onChangeTab('sell')">
        Sell {{ focusedProduct.baseSymbol }} <span />
      </button>
    </div>
    <div class="input-warpper">
      <div class="title-warpper">
        <p v-if="side === 'buy'">
          Balance <i>{{ synthScUSDAmount }} scUSD</i>
        </p>
        <p v-else>
          Balance <i>{{ assetAmount | formatNormalValue }} {{ focusedProduct.baseSymbol }}</i>
        </p>
        <span>Deposit</span>
      </div>
      <div class="input-item flex">
        <i>Price</i>
        <input type="text" :value="focusedProduct.price" class="amount-input" disabled>
        <div class="flex unit">
          <img width="32" src="../../../assets/img/eth48.png">
          <p>scUSD</p>
        </div>
      </div>
      <div class="input-item flex">
        <i>Amount</i>
        <input v-model="volume" type="text" class="amount-input padding-input" @input="onChangeInputValue">
        <div class="flex unit">
          <img width="32" src="../../../assets/img/eth48.png">
          <p>{{ focusedProduct.baseSymbol }}</p>
        </div>
      </div>
      <div class="Slider-warpper">
        <Slider
          v-model="sliderValue"
          class="mySlider"
          :marks="marks"
          :tip-format="sliderTipFormat"
          @on-change="getNumber"
        />
      </div>
      <div class="Fee-warpper">
        <div class=" flex items-center justify-between">
          <p>Fee</p>
          <span>{{ totalFee | formatNormalValue }} {{ side === 'buy' ? 'scUSD' : focusedProduct.baseSymbol }}</span>
        </div>
        <div class="flex items-center justify-between">
          <p> {{ side === 'buy' ? 'Buying' : 'Selling' }} Value</p>
          <span>{{ volume ? BigNumber(volume).times(focusedProduct.price).toFixed(2) : 0 }} scUSD</span>
        </div>
      </div>
      <div class="button-warpper">
        <button @click="onConfrimSubmit">
          {{ side === 'buy' ? 'Buy' : 'Sell' }} {{ focusedProduct.baseSymbol }}
        </button>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog" />
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
i{
  font-style: normal;
}
.from-warpper {
  margin-top: 10px;
  width: 100%;
  height: 468px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .Tab-wapper {
    button {
      width: 50%;
      height: 60px;
      background: #f7f8f9;
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 60px;
      position: relative;
      span {
        width: 16%;
        height: 2px;
        background: #0058ff;
        border-radius: 1px;
        position: absolute;
        left: 42%;
        bottom: 6px;
        display: none;
      }
    }
    .active {
      background: #ffffff;
      color: #0058ff;
      span {
        display: block;
      }
    }
  }
  .input-warpper {
    padding: 0 30px;
    margin-top: 20px;
    .title-warpper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        height: 16px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #8690a8;
        line-height: 16px;
        i {
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 16px;
        }
      }
      span {
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #0058ff;
        line-height: 16px;
      }
    }
    .input-item {
      margin-top: 16px;
      width: 100%;
      height: 56px;
      background: #f7f8f9;
      border-radius: 6px;
      position: relative;
      i {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #8690a8;
        line-height: 19px;
        position: absolute;
        left: 16px;
        top: 19px;
      }
      .amount-input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        background: #f7f8f9;
        font-size: 16px;
        line-height: 47px;
        color: #14171c;
        padding: 0px 0px 0px 70px;
        caret-color: #0058ff;
        &:focus {
          border: 1px solid #0058ff;
          border-radius: 4px;
        }
      }
      .padding-input {
        padding-left: 90px;
      }
      .amount-input-error {
        &:focus {
          border: 1px solid #ff3c00;
          border-radius: 4px;
        }
      }
      .unit {
        position: absolute;
        right: 16px;
        top: 24%;
        width: 80px;
        justify-content: space-between;
        align-items: center;
        line-height: 32px;
        img {
          max-width: 24px;
          max-height: 24px;
        }
        p {
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
        }
        img {
          max-width: 24px;
        }
      }
    }
  }
  .Slider-warpper {
    margin-top: 30px;
  }
  .Fee-warpper {
    margin-top: 36px;
    p {
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 16px;
      margin-bottom: 8px;
    }
    span {
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 16px;
    }
  }
  .button-warpper {
    margin-top: 16px;
    button {
      width: 100%;
      height: 48px;
      background: #0058ff;
      border-radius: 24px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #ffffff;
      line-height: 48px;
    }
  }
}
</style>
