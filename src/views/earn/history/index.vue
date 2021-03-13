<template>
  <div class="content-wapper">
    <div class="earn-wapper">
      <p class="earn-title">
        History
      </p>
      <div class="list-wapper">
        <div class="list-title flex">
          <span class="Pool">Pool</span>
          <span class="Action">Action</span>
          <span class="amount">Amount</span>
          <span class="status">Status</span>
        </div>
        <div class="list-item">
          <div>
            <div class="imgages-warpper">
              <img src="../../../assets/img/comp.svg" class="imgLeft">
              <img src="../../../assets/img/comp.svg" class="imgRight">
            </div>
            <p>scUSD-USDT LP</p>
          </div>
          <p class="action">
            Stake scUSD/USDT LP
          </p>
          <p class="amout">
            1234 
          </p>
          <p class="status success">
            Success
          </p>
        </div>
        <div class="list-item">
          <div>
            <div class="imgages-warpper">
              <img src="../../../assets/img/comp.svg" class="imgLeft">
              <img src="../../../assets/img/comp.svg" class="imgRight">
            </div>
            <p>scUSD-USDT LP</p>
          </div>
          <p class="action">
            Stake scUSD/USDT LP
          </p>
          <p class="amout">
            1234 
          </p>
          <p class="status success">
            Success
          </p>
        </div>
        <div class="list-item">
          <div>
            <div class="imgages-warpper">
              <img src="../../../assets/img/comp.svg">
            </div>
            <p>scUSD</p>
          </div>
          <p class="action">
            Stake scUSD
          </p>
          <p class="amout">
            1234 
          </p>
          <p class="status success">
            Success
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.content-wapper {
  height: 549px;
  width: 980px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 0;
  padding: 44px;
  .earn-wapper {
    .earn-title {
      font-size: 20px;
      padding: 0 16px;
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
        width: 892px;
        height: 56px;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
        padding: 16px;
        position: relative;
        div {
          display: flex;
          width: 30%;
          img {
            margin: auto;
            width: 24px;
            p {
              height: 80px;
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #14171c;
              line-height: 19px;
            }
          }
          .imgages-warpper{
            margin-right: 12px;
            width: 40px;
            height: 24px;
            position: relative;
            .imgLeft{
              position: absolute;
              left: 0;
              top: 0;
            }
            .imgRight{
              position: absolute;
              left: 16px;
              top: 0;
              z-index: 5;
            }
          }
        }
        .action {
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
        .success{
          color: #00D075;
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
</style>