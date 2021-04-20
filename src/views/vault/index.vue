<template>
  <div v-if="liquityReady" class="buildr-wrap">
    <div class="tab">
      <div
        :class="{'tab-item': true, 'tab-active': nav === 'balance'}"
        @click="toPage('balance')"
      >
        {{ $t('build-manage') }}
      </div>
      <div v-if="isOpen">
        <button
          class="btn create-btn"
          @click="toPage('close')"
        >
          关闭
        </button>
      </div>
      <div v-else>
        <button
          class="btn create-btn"
          @click="toPage('create')"
        >
          + {{ $t('build-create-vault') }}
        </button>
      </div>
    </div>
    <div class="buildr-content">
      <router-view />
    </div>
  </div>
  <div v-else>
    <Loading />
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
  .buildr-wrap {
    .mrg-t-10 {
      margin-top: 10px;
    }
    .mrg-t-20 {
      margin-top: 20px;
    }
    .mrg-b-5 {
      margin-bottom: 5px;
    }
    .mrg-tb-10 {
      margin: 10px 0px;
    }
    .mrg-tb-20 {
      margin: 20px 0px;
    }
    .mrg-tb-40 {
      margin: 40px 0px;
    }
    .mrg-b-40 {
      margin-bottom: 40px;
    }
    .f-gray {
      color: #828489;
    }
    .f-size-20 {
      font-size: 20px;
    }
    input::-webkit-input-placeholder {
      color: #afb1b6;
      font-size: 24px;
    }
    .text-right {
      text-align: right;
    }
    .box-shadow {
      padding: 32px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
    }
    .title{
      font-size: 20px;
      font-weight: 500;
      color: #14171C;
      line-height: 24px;
    }
    .tab {
      position: relative;
      margin: 24px 0px;
      .tab-item {
        position: relative;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-right: 40px;
        color: #14171c66;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
      .tab-active {
        color: rgba(0, 88, 255, 1);
      }
      .tab-active::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -10px;
        transform: translateX(-50%);
        width: 48px;
        height: 2px;
        background: #0058FF;
      }
      .create-btn {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 120px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #0058FF;
        background: rgba(0, 88, 255, 0.1);
        border-radius: 16px;
        &:hover{
          background: rgba(0, 88, 255, 0.2);
        }
      }
    }
  }
</style>
