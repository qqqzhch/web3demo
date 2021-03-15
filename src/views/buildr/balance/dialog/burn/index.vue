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
              @click="onMintClick"
            >
              铸造
            </button>
          </div>
          <div>
            <button
              class="btn btn-disabled"
            >
              偿还
            </button>
          </div>
        </div>
        <div
          v-if="step === 1"
          class="step-one"
        >
          <div class="grid-2">
            <div>数量</div>
            <div>
              余额：{{ currMaxMintable }} scUSD
            </div>
          </div>
          <div>
            <ScInput
              title=""
              unit="scUSD"
              :on-change="onChangeValue"
            />
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step-two"
        >
          <div>确认</div>
          <div>{{ coinAmount }}</div>
          <div>LOGO LAMB</div>
          <div>将偿还债务</div>
        </div>
        <div>
          <ul class="grid-2">
            <li>偿还资产：</li>
            <li>scUSD</li>
          </ul>
          <ul class="grid-2">
            <li>偿还数量：</li>
            <li><span>{{ coinAmount }}</span> scUSD </li>
          </ul>
          <ul class="grid-2">
            <li>抵押率？</li>
            <li><span class="f-green">{{ poolData.collateralisationRatio }}%</span>至{{ currPledgeRatio }} %</li>
          </ul>
          <ul class="grid-2">
            <li>清算价格</li>
            <li><span>{{ currLiquidationPrice }}</span> USD</li>
          </ul>
          <ul
            v-if="step===2"
            class="grid-2"
          >
            <li>手续费</li>
            <li><span>{{ currFee }}</span> scUSD</li>
          </ul>
        </div>
        <div>
          <button
            v-if="step === 1"
            class="btn"
            @click="onNextClick"
          >
            下一步
          </button>
          <button
            v-if="step === 2"
            class="btn"
            @click="onBurnClick"
          >
            确定
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
