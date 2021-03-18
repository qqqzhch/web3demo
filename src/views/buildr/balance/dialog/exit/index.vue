<template>
  <div class="dialog-wrap">
    <Modal
      v-model="isOpen"
      class-name="farm-modal"
      :transfer="true"
      title=""
      :footer-hide="true"
      :closable="true"
    >
      <div class="modal-content">
        <div
          v-if="step === 1"
          class="grid-2"
        >
          <div>
            <button
              class="btn"
              @click="onJoinClick"
            >
              Collateral
            </button>
          </div>
          <div>
            <button
              class="btn btn-disabled"
            >
              Withdraw
            </button>
          </div>
        </div>
        <div
          v-if="step === 1"
          class="step-one"
        >
          <div class="grid-2">
            <div>Amount</div>
            <div>
              Balance：{{ unlockedCollateral }} {{ poolData.tokenName }}
            </div>
          </div>
          <div>
            <ScInput
              title=""
              :unit="poolData.tokenName"
              placetext="请输入数量"
              :on-change="onChangeValue"
            />
          </div>
          <div v-if="checkValue==='overMaxValue'">
            超过最大值
          </div>
          <div v-if="checkValue==='isNaN'">
            不是有效数值
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step-two"
        >
          <div>Confirm</div>
          <div>{{ coinAmount }}</div>
          <div>LOGO {{ poolData.tokenName }}</div>
          <div>will send to your wallet address</div>
        </div>
        <div>
          <ul class="grid-2">
            <li>Generating：</li>
            <li><span>{{ maxMintable }}</span></li>
          </ul>
          <ul class="grid-2">
            <li>Collateral Ratio？</li>
            <li><span>{{ collRatio }}</span></li>
          </ul>
          <ul class="grid-2">
            <li>Liquidation Price</li>
            <li><span>{{ liquidationPrice }}</span></li>
          </ul>
        </div>
        <div>
          <button
            v-if="step === 1 && !checkValue"
            class="btn"
            @click="onNextClick"
          >
            Next
          </button>
          <button
            v-if="step === 1 && checkValue"
            class="btn btn-disabled"
          >
            Next
          </button>
          <button
            v-if="step === 2"
            class="btn"
            @click="onExitClick"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .grid-2 {
    display: grid;
    grid-template-columns: 45% 45%;
    justify-content: space-between;
  }
  .btn{
    line-height: 40px;
    height: 40px;
    padding-top: 3px;
    background-color: #0058FF;
    color: #ffffff;
    &:hover {
      background-color: #0547ff;
    }
  }
  .btn-disabled {
    cursor: not-allowed;
    background-color: #999;
    &:hover {
      background-color: #999 !important;
    }
  }
  .step-one, .step-two {
    margin: 20px 0px;
  }
</style>
