<template>
  <footer class="footer-wrapper">
    <div class="footer-content container mx-auto flex justify-between items-center">
      <div class="left-wrapper">
        <div class="logo-wrapper">
          <img src="../../assets/footlogo.svg" alt="logo">
        </div>
        <p>© 2021 SuperCash All rights reserved</p>
      </div>
      <div class="right-wrapper flex">
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
      </div>
    </div>
  </footer>
</template>


<script>
import jscookie from 'js-cookie';
export default {
  data() {
    return {
      lang: null,
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
  },
  mounted() {
    this.getKey();
  },
};
</script>

<style lang="less" scoped>
.footer-wrapper {
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