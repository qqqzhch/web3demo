<template>
  <footer class="footer-wrapper">
    <div class="footer-content container mx-auto flex justify-between items-center">
      <div class="left-wrapper">
        <div class="logo-wrapper">
          <img
            src="../../assets/footlogo.svg"
            alt="logo"
          >
        </div>
        <p>2020 TransGo yriuwewet</p>
      </div>
      <div class="right-wrapper">
        <div class="contact-wrapper flex justify-between items-center">
          <div class="contact-item mr">
            <a
              href="/"
              target="_blank"
            >
              <img
                src="../../assets/img/telegram.svg"
                alt="telegram"
              >
            </a>
          </div>
          <div class="contact-item mr">
            <a
              href="/"
              target="_blank"
            >
              <img
                src="../../assets/img/twiter.svg"
                alt="twiter"
              >
            </a>
          </div>
          <div class="contact-item">
            <a
              href="/"
              target="_blank"
            >
              <img
                src="../../assets/img/medium.svg"
                alt="medium"
              >
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.footer-wrapper {
  width: 100%;
  height: 120px;
  background: #050d26;
  .footer-content {
    height: 100%;
    .left-wrapper {
      .logo-wrapper{
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
</style>