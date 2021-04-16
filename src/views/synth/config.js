/**
 * 产品类型
 * */

export const productTypes = [
  {
    label: 'Crypto',
    value: 'crypto',
  },{
    label: 'Stock',
    value: 'stock',
  },
  // {
  //   label: 'Index',
  //   value: 'indexes',
  // },{
  //   label: 'Futures',
  //   value: 'futures',
  // },
];

/**
 * 如果没有指定类型，默认选中加密货币
 * */
export const defaultProductType = 'crypto';

/**
 * 价格轮训的周期1分钟
 * */

export const loopDuration = 2 * 60 * 1000;
