(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-648e0cc8"],{"3f70":function(t,e,a){"use strict";a("6f24")},"6f24":function(t,e,a){},b012:function(t,e){function a(t,e,a){var n,i,s,r,c;function o(){var d=Date.now()-r;d<e&&d>=0?n=setTimeout(o,e-d):(n=null,a||(c=t.apply(s,i),s=i=null))}null==e&&(e=100);var d=function(){s=this,i=arguments,r=Date.now();var d=a&&!n;return n||(n=setTimeout(o,e)),d&&(c=t.apply(s,i),s=i=null),c};return d.clear=function(){n&&(clearTimeout(n),n=null)},d.flush=function(){n&&(c=t.apply(s,i),s=i=null,clearTimeout(n),n=null)},d}a.debounce=a,t.exports=a},b59e:function(t){t.exports=JSON.parse('[{"name":"scUSD/USDT LP","address":"0x2E4644128032FB3CD402F91a663A8d5a233efAe5","decimals":18,"chainId":256,"kind":"multi","symbol":["scUSD","USDT"]},{"name":"scUSD","address":"0xAED82BD6a8657cfa0Ee966b6D431AF6E2CbcAbF5","decimals":18,"chainId":256,"kind":"single","symbol":["scUSD"]},{"name":"LAMB Vault","address":"0xAED82BD6a8657cfa0Ee966b6D431AF6E2CbcAbF5","decimals":18,"chainId":256,"kind":"airdrop","symbol":["scUSD"]},{"name":"scUSD","address":"0xAED82BD6a8657cfa0Ee966b6D431AF6E2CbcAbF5","decimals":18,"chainId":256,"kind":"single","symbol":["scUSD"]},{"name":"SCASH","address":"0x116dFf7c5eD6e66DB8235C836bB17f14eB111943","decimals":18,"chainId":4,"kind":"single","symbol":["SCASH"]},{"name":"scUSD","address":"0xafBeBbDb25A875dC61D8c6f5A92016FdfA114672","decimals":18,"chainId":4,"kind":"single","symbol":["scUSD"]},{"name":"scUSD/USDT LP","address":"0x8506733f7a3Fb8F78A33baA721DB64d80587213E","decimals":18,"chainId":4,"kind":"multi","symbol":["scUSD","USDT"]},{"name":"SCASH/scUSD  LP","address":"0x169AB7543B1Cc55d1C84628047e2c0B6b127269C","decimals":18,"chainId":4,"kind":"multi","symbol":["SCASH","scUSD"]},{"name":"SCASH/USDT  LP","address":"0xA09c001eEb572316ad667EbA3D241fefbdb9aFE6","decimals":18,"chainId":4,"kind":"multi","symbol":["SCASH","USDT"]},{"name":"SCASH/ETH  LP","address":"0x3A0a8e7e6ad5A1A6d76180f81b292c4EF663F68a","decimals":18,"chainId":4,"kind":"multi","symbol":["SCASH","ETH"]},{"name":"SCASH/ETH  LP","address":"0x3A0a8e7e6ad5A1A6d76180f81b292c4EF663F68a","decimals":18,"chainId":4,"kind":"liquity","symbol":["SCASH","ETH"]},{"name":"LAI/BNB  LP","address":"0x3DFA0402b9F66363b3AcB0f5090fE4C70Fbeeb84","decimals":18,"chainId":97,"kind":"liquity","symbol":["LAY","BNB"]},{"name":"LAI/BNB  LP","address":"0x174841c81974ab1FAEb6Ae59fba6B2810bAd2ce4","decimals":18,"chainId":56,"kind":"liquity","symbol":["LAY","BNB"]}]')},df2f:function(t,e,a){t.exports=a.p+"img/LAI.95c27bd8.svg"},e1b0:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pool-wrapper"},[t.showLoading?a("div",[a("loading")],1):a("div",{staticClass:"pool-content"},[a("div",{staticClass:"lp-title-wrapper"},[t._m(0),a("h2",{staticClass:"title",attrs:{target:"_blank"}},[t._v(" "+t._s(t.BNB)+"-"+t._s(t.LAI)+" ")])]),t._m(1),a("div",{staticClass:"pool-detail"},[a("div",{staticClass:"detail-item"},[a("span",{staticClass:"title"},[t._v("Total Stake")]),a("span",{staticClass:"value"},[t._v(t._s(t.totalStake||"--")+" LP")])]),a("div",{staticClass:"detail-item"},[a("span",{staticClass:"title"},[t._v("Staked")]),a("span",{staticClass:"value"},[t._v(t._s(t.haveStake||"--")+" LP")])]),a("div",{staticClass:"detail-item"},[a("span",{staticClass:"title"},[t._v("Unclaimed "+t._s(t.BABEL))]),a("span",{staticClass:"value"},[t._v(t._s(t.unclaim||"--")+" "+t._s(t.BABEL))])])]),a("div",{staticClass:"pool-btn-wrapper"},[t.ethAddress?[a("a",{staticClass:"pancake pool-btn",attrs:{href:t.getAddress,target:"_blank"}},[t._v("Get Pancake V1 LP")]),a("button",{staticClass:"pool-btn",on:{click:t.openPledge}},[t._v(" Stake LP ")]),a("button",{staticClass:"pool-btn",on:{click:t.openExtract}},[t._v(" Claim ")]),a("button",{staticClass:"pool-btn",on:{click:t.openTake}},[t._v(" Unstake LP ")])]:[a("button",{staticClass:"pool-btn disableBtn"},[t._v(" Stake LP ")]),a("button",{staticClass:"pool-btn disableBtn"},[t._v(" Claim ")]),a("button",{staticClass:"pool-btn disableBtn"},[t._v(" Unstake LP ")])]],2)]),a("take",{ref:"take"}),a("pledge",{ref:"pledge"}),a("extract",{ref:"extract"})],1)},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"img-wrapper"},[n("img",{attrs:{src:a("ec18"),alt:"bnb"}}),n("img",{staticClass:"imgRight",attrs:{src:a("df2f"),alt:"lai"}})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tag-wrapper flex justify-center items-center"},[a("div",{staticClass:"tag-item tag1"},[t._v(" BABEL ")]),a("div",{staticClass:"tag-item tag2"},[t._v(" Transfer Fee ")])])}],s=a("5530"),r=a("3835"),c=a("1da1"),o=(a("96cf"),a("d3b7"),a("3ca3"),a("ddb0"),a("4de4"),a("25f0"),a("7db0"),a("159b"),a("b59e")),d=a("fe74"),l=(a("6df3"),a("c46f")),u=a("2332"),b=a("666b"),f=a("901e");function h(t,e){var a;return l["a"].find(d.tokens,(function(n){n.chainId===t&&n.address.toString().toLowerCase()===e.toString().toLowerCase()&&(a=n)})),a}function p(t,e,a){return m.apply(this,arguments)}function m(){return m=Object(c["a"])(regeneratorRuntime.mark((function t(e,a,n){var i,s,r,c,d,l,p,m,k,v,S,A,D,g,C,y,L,B,w,x,E,_,T,I,P;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=o||[],s=[],i.forEach((function(t){t.chainId===n&&s.push(t)})),r=[],s.forEach((function(t){var e=Object(b["e"])(t);r.push(e.rewardRate()),r.push(e.uniToken()),r.push(e.totalSupply()),r.push(e.lqtyToken())})),c=new u["Provider"](e,n),t.next=8,c.init();case 8:return t.next=10,c.all(r);case 10:d=t.sent,r=[],l=0,p=0;case 14:if(!(p<d.length)){t.next=39;break}if(m=s[l],l++,k=d[p],v=d[p+2],S=d[p+1],A=d[p+3],D=new f(k.toString()).div("1e18").toNumber(),g=new f(v.toString()).div("1e18").toNumber(),C=h(n,A),m.data={rewardRate:D,LPTokenAddress:S,totalSupply:g,rewardToken:C.symbol},a){t.next=29;break}m.data={earned:"",balance:"",LPTokenbalance:"",rewardRate:D,LPTokenAddress:S,totalSupply:g,rewardToken:C.symbol},t.next=36;break;case 29:y={address:S};try{L=Object(b["f"])(y),B=Object(b["e"])(m),r.push(L.balanceOf(a)),r.push(B.earned(a)),r.push(B.balanceOf(a))}catch(U){}return t.next=33,c.all(r);case 33:for(w=t.sent,x=0,E=0;E<w.length;E+=3)_=s[x],x++,T=w[E],I=w[E+1],P=w[E+2],_.data["LPTokenbalance"]=new f(T.toString()).div("1e18").toNumber(),_.data["earned"]=new f(I.toString()).div("1e18").toNumber(),_.data["balance"]=new f(P.toString()).div("1e18").toNumber();case 36:p+=4,t.next=14;break;case 39:return t.abrupt("return",s);case 40:case"end":return t.stop()}}),t)}))),m.apply(this,arguments)}f.config({DECIMAL_PLACES:6,ROUNDING_MODE:f.ROUND_DOWN});var k=a("2f62"),v=a("5bed"),S=a("99e5"),A=a.n(S),D=a("b012"),g={data:function(){return{liquidityData:{},showLoading:!0}},components:{take:function(){return a.e("chunk-3774eb52").then(a.bind(null,"f70b"))},pledge:function(){return a.e("chunk-0f98dee6").then(a.bind(null,"d44b"))},extract:function(){return a.e("chunk-d8205d7a").then(a.bind(null,"3bfb"))},loading:function(){return a.e("chunk-6f442e8e").then(a.bind(null,"83ab0"))}},methods:{getListData:D(Object(c["a"])(regeneratorRuntime.mark((function t(){var e,a,n,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.showLoading=!0,t.prev=1,t.next=4,p(this.ethersprovider,this.ethAddress,this.ethChainID);case 4:e=t.sent,a=e.filter((function(t){return"liquity"===t.kind})),n=Object(r["a"])(a,1),i=n[0],this.liquidityData=i,t.next=14;break;case 11:t.prev=11,t.t0=t["catch"](1);case 14:return t.prev=14,this.showLoading=!1,t.finish(14);case 17:case"end":return t.stop()}}),t,this,[[1,11,14,17]])}))),1e3),getPriceData:function(t,e){var a=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){var i,s,r,c,o,d,u;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return i={},s=t.symbol[0],r=t.symbol[1],c=t&&t.data&&t.data.totalSupply,o=A.a.utils.toWei(c.toString()),d=l["a"].find(e,(function(t){if(t.pairInfo.tokenAmounts[0].token.symbol==s&&t.pairInfo.tokenAmounts[1].token.symbol==r||t.pairInfo.tokenAmounts[1].token.symbol==s&&t.pairInfo.tokenAmounts[0].token.symbol==r)return t})),u={aTokenbalance:d.aTokenbalance(o),bTokenbalance:d.bTokenbalance(o),price:d.price(s,r).price},i.usdtNum=u.aTokenbalance.multiply(u.price).add(u.bTokenbalance).toSignificant(6),i.price=u.price&&u.price.toSignificant(6),"SCASH"===s&&"USDT"===r&&a.$store.commit("changeScashPrice",i.price),a.$store.commit("changeEarnPrice",i.price),n.abrupt("return",i);case 12:case"end":return n.stop()}}),n)})))()},openPledge:function(){this.$refs.pledge.open(this.liquidityData)},openExtract:function(){this.$refs.extract.open(this.liquidityData)},openTake:function(){this.$refs.take.open(this.liquidityData)}},computed:Object(s["a"])(Object(s["a"])({},Object(k["c"])(["ethersprovider","ethChainID","ethAddress","earnPrice","scashPrice","LAI","BABEL","BNB"])),{},{isReady:function(){return this.ethChainID&&this.ethersprovider},isConnect:function(){return this.ethAddress},totalStake:function(){var t=this.liquidityData&&this.liquidityData.data&&this.liquidityData.data.totalSupply.toString(),e=this.$BigNumber(t).decimalPlaces(2).toNumber();return e},haveStake:function(){var t=this.liquidityData&&this.liquidityData.data&&this.liquidityData.data.balance.toString(),e=this.$BigNumber(t).decimalPlaces(2).toNumber();return e},unclaim:function(){var t=this.liquidityData&&this.liquidityData.data&&this.liquidityData.data.earned.toString(),e=this.$BigNumber(t).decimalPlaces(2).toNumber();return e},getAddress:function(){var t=this,e=d.tokens.filter((function(e){return"LAI"===e.symbol&&e.chainId===t.ethChainID})),a=Object(r["a"])(e,1),n=a[0];if(void 0==n)return"#";var i="https://pancakeswap.babel.fi/#/add/BNB/".concat(n.address);return i}}),watch:{isReady:function(t){t&&this.getListData()},isConnect:function(t){t&&this.getListData()}},created:function(){this.isReady&&this.getListData()},mounted:function(){var t=this;v["a"].$on("txsuccess",(function(){t.getListData()}))}},C=g,y=(a("3f70"),a("2877")),L=Object(y["a"])(C,n,i,!1,null,"67ae27b0",null);e["default"]=L.exports},ec18:function(t,e,a){t.exports=a.p+"img/bnb48.5e415f14.svg"}}]);
//# sourceMappingURL=chunk-648e0cc8.7d3b91d9.js.map