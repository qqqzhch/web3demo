(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-29946a83"],{"1dfc":function(e,t,a){e.exports=a.p+"img/metamask48.388c0de6.svg"},"4a34":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAABbUlEQVRIS+2Uv0sCcRiHn1cjQwiCCIKGIBqivd0ICheDQvAghGpwbGiRllwahIaWGqrBIPTKphqiIZCI/oCgMWhtaoh+YNYb6gVmd96Fuvndju97z/Peh/c9oc1H2synI3BNuBNRNaIFHaXEDKZs12fWfERRHcLPNTCMsEhODmolzQni2s8HVyjjwBNCiJzctkYQ0V6CXAITwAswjSk33iOKajd5KdrOYVgD9HGOMgkU8REhKxd2tfYRxXQZSPDKFKfy/OvFkHYxyAkwC3ziwyAreaeF+CuI6gB+HoAgUKCHMBl5rwJUMMigxMsPlSZM2Wu0bfZfYOg8yhHgRznjkTkKUsLQLZQVC5jElLTbKjtPUUyXUPaRyg/xELgH1i1gGlOSbvDyfeMxNXQVZbMOtIspCS9wd0G5IqYbwJoFPGYMg5R8tU5QlewgjFAi4ji6DkZvm5xSH3cEyMub185/6rwJ/kutqe8IXMNre0TfPy1ZGvn/ECQAAAAASUVORK5CYII="},"65b8":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wallet-dialog"},[n("Modal",{attrs:{"class-name":"wallet-modal",transfer:!0,"footer-hide":!0,closable:!0},model:{value:e.openWalletDialog,callback:function(t){e.openWalletDialog=t},expression:"openWalletDialog"}},[n("div",{staticClass:"modal-content"},[n("p",{staticClass:"title text-center",attrs:{slot:"header"},slot:"header"},[e._v(" Connect Wallet ")]),n("div",{staticClass:"wallet-content flex justify-between items-center",class:"metamask"==e.wallet?"wallet-content-active":"",on:{click:function(t){return e.selectWallet("metamask")}}},[n("div",{staticClass:"logo flex items-center text-warpper"},[n("img",{attrs:{src:a("1dfc")}}),n("p",[e._v("MetaMask")])]),n("div",{staticClass:"img-wapper"},[n("img",{attrs:{src:a("4a34")}})])]),n("div",{staticClass:"wallet-content flex items-center justify-between",class:"walletconnect"==e.wallet?"wallet-content-active":"",on:{click:function(t){return e.selectWallet("walletconnect")}}},[n("div",{staticClass:"logo flex items-center text-warpper"},[n("img",{attrs:{src:a("458c")}}),n("p",[e._v("WalletConnect")])]),n("div",{staticClass:"img-wapper"},[n("img",{attrs:{src:a("4a34")}})])]),n("Buttons",{nativeOn:{click:function(t){return e.connectWallet(e.wallet)}}},[e._v(" Connect Wallet ")])],1)])],1)},l=[],c=a("1da1"),i=(a("96cf"),a("d3b7"),a("3ca3"),a("ddb0"),a("307c")),s=a.n(i),r=a("a78e"),o=a.n(r),u=a("5bed"),d=a("a078"),w={inject:["reload"],components:{Buttons:function(){return a.e("chunk-2d225272").then(a.bind(null,"e2d3"))}},data:function(){return{openWalletDialog:!1,wallet:""}},methods:{selectWallet:function(e){this.wallet=e,o.a.set("usewalletname",e,{expires:365,path:"/"}),this.$store.commit("WalletName",e)},open:function(){this.openWalletDialog=!0;var e=o.a.get("usewalletname");e&&(this.wallet=e)},connectWallet:function(e){"metamask"===e?this.getEthAuth():"walletconnect"===e&&this.getwalletconnectAuth()},getEthAuth:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,window.ethereum.enable();case 3:a=t.sent,e.$store.commit("changeEthAddress",a[0]),e.openWalletDialog=!1,e.reload(),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),e.$Notice.warning({title:e.$t("notice.n"),desc:e.$t("notice.n11")});case 13:case"end":return t.stop()}}),t,null,[[0,9]])})))()},getLambAuth:function(){},getwalletconnectAuth:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,a=new s.a({rpc:d["a"].walletconnectRPC,chainId:d["a"].getChainID()}),t.next=5,a.enable();case 5:n=t.sent,e.$store.commit("changeEthAddress",n[0]),e.$store.commit("changeWalletConnectprovider",a),u["a"].$emit("initpageEth"),e.openWalletDialog=!1,e.reload(),t.next=18;break;case 13:t.prev=13,t.t0=t["catch"](0),u["a"].$emit("initpageEth"),e.reload();case 18:case"end":return t.stop()}}),t,null,[[0,13]])})))()}}},g=w,h=(a("8164"),a("2877")),m=Object(h["a"])(g,n,l,!1,null,"31e12104",null);t["default"]=m.exports},8164:function(e,t,a){"use strict";a("eb6d9")},eb6d9:function(e,t,a){}}]);
//# sourceMappingURL=chunk-29946a83.90b8a7ba.js.map