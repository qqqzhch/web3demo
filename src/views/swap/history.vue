<template>
  <div class="content-wapper">
    <div class="exchanges-wapper">
      <p class="exchanges-title">
        Order History
      </p>
      <div class="list-wapper">
        <div class="list-title flex">
          <span class="pair">Pair</span>
          <span class="price">Price</span>
          <span class="amount">Amount</span>
          <span class="status">Status</span>
        </div>
        <div class="list-item">
          <div>
            <img src="../../assets/img/eth.png">
            <p>cUSD/USD</p>
          </div>
          <p class="price">
            $ 1.62
          </p>
          <p class="amout">
            19284.24
          </p>
          <p class="status executed">
            Executed
          </p>
        </div>
        <div class="list-item">
          <div>
            <img src="../../assets/img/eth.png">
            <p>TFI/tUSD</p>
          </div>
          <p class="price">
            $ 1.62
          </p>
          <p class="amout">
            224.24
          </p>
          <p class="status fall">
            Fail
          </p>
        </div>
        <div class="list-item">
          <div>
            <img src="../../assets/img/eth.png">
            <p>cUSD/USD</p>
          </div>
          <p class="price">
            $ 1.62
          </p>
          <p class="amout">
            8472.39
          </p>
          <p class="status sending">
            Sending
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
  margin: 20px auto 100px;
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
        width: 892px;
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
</style>