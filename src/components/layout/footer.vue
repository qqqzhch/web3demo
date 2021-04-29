<template>
  <!-- Pc端页脚 -->
  <footer v-if="!isMobile" class="footer pcFooter">
    <div class="footer-content container mx-auto flex justify-between items-center">
      <div class="left-wrapper">
        <div class="logo-wrapper">
          <img src="../../assets/footlogo.svg" alt="logo">
        </div>
        <p>© 2021 BABEL All rights reserved</p>
      </div>
      <!-- <div class="right-wrapper flex">
        <div class="contact-wrapper flex justify-between items-center">
          <div class="contact-item mr">
            <a href="/" target="_blank">
              <img src="../../assets/img/telegram.svg" alt="telegram">
            </a>
          </div>
          <div class="contact-item mr">
            <a href="/" target="_blank">
              <img src="../../assets/img/twiter.svg" alt="twiter">
            </a>
          </div>
          <div class="contact-item">
            <a href="/" target="_blank">
              <img src="../../assets/img/medium.svg" alt="medium">
            </a>
          </div>
        </div>
        <Select v-model="lang" class="lang-wrapper" style="width: 124px" @on-change="getSelectLang">
          <Option value="zh">
            简体中文
          </Option>
          <Option value="en">
            English
          </Option>
        </Select>
      </div> -->
    </div>
  </footer>

  <!-- 移动端页脚 -->
  <footer v-else class="mobileFooter container">
    <div :class="isActive=='vault'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('vault')">
      <img src="../../assets/m-img/$.svg" alt="$">
      <img src="../../assets/m-img/$-active.svg" alt="$" class="acitveImg">
      <p>Vault</p>
    </div>
    <div :class="isActive=='stabilityPool'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('stabilityPool')">
      <img src="../../assets/m-img/slider-active.svg" alt="slider">
      <img src="../../assets/m-img/slider.svg" alt="slider" class="acitveImg">
      <p>Stability Pool</p>
    </div>
    <div :class="isActive=='babelPool'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('babelPool')">
      <img src="../../assets/m-img/babel-active.svg" alt="babel">
      <img src="../../assets/m-img/babel.svg" alt="babel" class="acitveImg">
      <p>BABEL Pool</p>
    </div>
    <div :class="isActive=='lpPool'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('lpPool')">
      <img src="../../assets/m-img/paper-active.svg" alt="paper">
      <img src="../../assets/m-img/paper.svg" alt="paper" class="acitveImg">
      <p>LP Pool</p>
    </div>
    <div :class="isActive=='riskyVaults'? 'menu-item activeMenu':'menu-item'" @click="activeMenu('riskyVaults')">
      <img src="../../assets/m-img/risky-active.svg" alt="risky">
      <img src="../../assets/m-img/risky.svg" alt="risky" class="acitveImg">
      <p>Risky Vaults</p>
    </div>
  </footer>
</template>


<script>
import { mapState } from 'vuex';
import jscookie from 'js-cookie';
export default {
  data() {
    return {
      lang: null,
      isActive:'vault'
    };
  },
  methods: {
    // 获取语言key
    getKey() {
      const key = jscookie.get('langkey');
      key === 'zh' ? (this.lang = 'zh') : (this.lang = 'en');
      this.$i18n.locale = this.lang;
    },

    // 改变语言
    getSelectLang(val) {
      this.lang = val;
      this.$i18n.locale = this.lang;
      jscookie.set('langkey', this.lang, { expires: 180 });
    },
    activeMenu(name) {
      this.isActive = name;
      this.$router.push({
          path:`/${name}`,
      });
    },
  },
  mounted() {
    // this.getKey();
    if (this.isReady) {
      this.getStatus();
    }
  },
  computed: {
    ...mapState(['isMobile']),
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getStatus();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./media/index.less";
.footer {
  width: 100%;
  height: 120px;
  background: #050d26;
  .footer-content {
    height: 100%;
    .left-wrapper {
      .logo-wrapper {
        width: 150px;
      }
      p {
        margin-top: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
      }
    }
    .right-wrapper {
      .mr {
        margin-right: 24px;
      }
    }
  }
}
.lang-wrapper {
  margin-left: 48px;
}
</style>