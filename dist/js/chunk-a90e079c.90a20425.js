(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a90e079c"],{"2c29":function(t,e,a){t.exports=a.p+"img/closeBtn.9647d73b.svg"},"5d6d":function(t,e,a){t.exports=a.p+"img/wenhao.ae15efd2.svg"},6853:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{"input-group":!0,"input-focus":t.focus,"input-error":t.isError}},[t.title?a("div",{staticClass:"input-prepend"},[t._v(" "+t._s(t.title)+" ")]):t._e(),a("input",{directives:[{name:"model",rawName:"v-model",value:t.inputVal,expression:"inputVal"}],class:{"input-inner":!0,"no-title":!t.title},attrs:{type:"input",name:"repay",autoComplete:"off",placeholder:t.placetext,disabled:t.disabled},domProps:{value:t.inputVal},on:{focus:t.onInputFocus,blur:t.onInputBlur,input:function(e){e.target.composing||(t.inputVal=e.target.value)}}}),a("div",{staticClass:"input-append"},[t._v(" "+t._s(t.unit)+" ")])])},i=[],o={name:"ScInput",props:["title","unit","placetext","disabled","onChange","defaultValue","isError"],data:function(){return{inputVal:"",focus:!1}},methods:{onInputFocus:function(){this.focus=!0},onInputBlur:function(){this.focus=!1},onChangeValue:function(t){var e=t||0;this.onChange&&this.onChange(e)}},watch:{inputVal:function(t){this.onChangeValue(t)},defaultValue:function(t){this.inputVal=t}},created:function(){this.onChangeValue(this.inputVal)}},s=o,l=(a("7b49"),a("2877")),c=Object(l["a"])(s,n,i,!1,null,"1c42f5ce",null);e["a"]=c.exports},"7b49":function(t,e,a){"use strict";a("e652")},9307:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dialog-wrap"},[n("Modal",{attrs:{"class-name":"valut-modal",transfer:!0,title:"","footer-hide":!0,closable:!1},model:{value:t.isOpen,callback:function(e){t.isOpen=e},expression:"isOpen"}},[n("div",{staticClass:"modal-content"},[1===t.step?n("div",{staticClass:"flex"},[n("div",{staticClass:"tab-warpper"},[n("button",{staticClass:"tab"},[t._v(" "+t._s(t.$t("build-buildr"))+" ")])]),n("div",{staticClass:"tab-warpper"},[n("button",{staticClass:"tab  tab-disabled",on:{click:t.onBurnClick}},[t._v(" "+t._s(t.$t("build-payback"))+" ")])])]):t._e(),n("div",{staticClass:"padding-warpper"},[1===t.step?n("div",{staticClass:"step-one"},[n("div",{staticClass:"grid-2"},[n("h2",[t._v(t._s(t.$t("build-Amount")))]),n("p",[n("span",[t._v(t._s(t.$t("build-balance"))+"：")]),t._v(" "+t._s(t._f("formatNormalValue")(t.LAIBalance))+" "+t._s(t.poolData.stableName))])]),n("div",{staticClass:"input-warpper"},[n("ScInput",{attrs:{unit:t.poolData.stableName,"on-change":t.onChangeValue,"is-error":t.checkValue}}),n("img",{attrs:{src:t.getTokenImg(t.poolData.stableName)}})],1),t.checkValue?n("div",{staticClass:"notice-warpper"},[n("div",{staticClass:"notice-content"},[n("img",{attrs:{src:a("fb2e")}}),n("p",[t._v(t._s(t.checkValue))])])]):t._e(),t.checkValue?t._e():n("div",{staticClass:"notice"},[n("span",[t._v(t._s(t.$t("build-generate-scUSD")))]),n("img",{attrs:{src:a("5d6d"),alt:"?"}})])]):t._e(),2===t.step?n("div",{staticClass:"step-two"},[n("div",{staticClass:"title-warpper"},[n("img",{attrs:{src:a("f3a0"),alt:"arrow"},on:{click:t.changeStep}}),n("h2",[t._v(t._s(t.$t("build-confirm")))])]),n("div",{staticClass:"confirm-content flex flex-col items-center"},[n("img",{attrs:{src:t.getTokenImg(t.poolData.stableName)}}),n("h2",[t._v(t._s(t.coinAmount))]),n("p",[t._v(t._s(t.poolData.stableName))]),n("span",[t._v(t._s(t.$t("build-will-send")))])])]):t._e(),n("div",{staticClass:"items-content"},[n("ul",[n("li",{staticClass:"title"},[t._v(" "+t._s(t.$t("build-debt"))+"： ")]),n("li",[n("span",[t._v(t._s(t._f("formatNormalValue")(t.poolData.debtAmount)))]),t._v(" "+t._s(t.$t("build-to"))+" "),n("span",{class:{"f-green":t.totalDebt>t.poolData.debtAmount,"f-danger":t.totalDebt<t.poolData.debtAmount}},[t._v(t._s(t._f("formatNormalValue")(t.totalDebt))+" "+t._s(t.poolData.stableName))])])]),n("ul",[n("li",{staticClass:"title"},[t._v(" Borrowing Fee: ")]),n("li",[n("span",[t._v(t._s(t._f("formatNormalValue")(t.debtFee))+" "+t._s(t.poolData.stableName)+" ")]),n("span",[t._v("("+t._s(t.BigNumber(t.poolData.borrowingRate).times(100).toFixed(2))+"%)")])])]),n("ul",[n("li",{staticClass:"title flex"},[n("span",[t._v(t._s(t.$t("build-coll-ratio"))+":")])]),t.poolData.collateralRatio?n("li",[n("span",{class:{"f-green":t.poolData.collateralRatio>=1.5,"f-warning":t.poolData.collateralRatio<1.5&&t.poolData.collateralRatio>=1.2,"f-danger":t.poolData.collateralRatio<1.2}},[t._v(t._s(t.BigNumber(t.poolData.collateralRatio).times(100).toFixed(2))+"%")]),t._v(" "+t._s(t.$t("build-to"))+" "),n("span",{class:{"f-green":t.newCollateralRatio>=1.5,"f-warning":t.newCollateralRatio<1.5&&t.newCollateralRatio>=1.2,"f-danger":t.newCollateralRatio<1.2}},[t._v(t._s(t.BigNumber(t.newCollateralRatio).times(100).toFixed(2))+"%")])]):n("li",[n("span",[t._v("0% "+t._s(t.$t("build-to"))+" 0%")])])])]),n("div",{staticClass:"button-warpper"},[1!==t.step||t.checkValue?t._e():n("button",{staticClass:"btn",on:{click:t.onNextClick}},[t._v(" "+t._s(t.$t("build-next"))+" ")]),1===t.step&&t.checkValue?n("button",{staticClass:"btn btn-disabled"},[t._v(" "+t._s(t.$t("build-next"))+" ")]):t._e(),2!==t.step||t.btnLoading?t._e():n("button",{staticClass:"btn",on:{click:t.onMintClick}},[t._v(" "+t._s(t.$t("build-confirm"))+" ")]),2===t.step&&t.btnLoading?n("button",{staticClass:"btn"},[t._v(" Loading... ")]):t._e()]),1===t.step?n("div",{staticClass:"close-warpper"},[n("img",{attrs:{src:a("2c29"),alt:"closeBtn"},on:{click:t.closeDialog}})]):t._e()])])])],1)},i=[],o=a("1da1"),s=a("5530"),l=(a("96cf"),a("2f62")),c=a("6853"),r=a("97a5"),u=a("901e"),p=a.n(u),d=a("12cb"),b=a("1062"),h={data:function(){return{step:1,isOpen:!1,coinAmount:0,poolData:{},BigNumber:p.a,LAIBalance:0,btnLoading:!1}},components:{ScInput:c["a"]},computed:Object(s["a"])(Object(s["a"])({},Object(l["c"])(["web3","ethersprovider","ethChainID","ethAddress"])),{},{debtFee:function(){var t=this.poolData.borrowingRate?this.poolData.borrowingRate:0;return p()(this.coinAmount).times(t)},newDebt:function(){return p()(this.coinAmount).div(p()(1).plus(this.poolData.borrowingRate)).toNumber()},totalDebt:function(){return p()(this.poolData.debtAmount).plus(this.coinAmount).toNumber()},newCollateralRatio:function(){var t=this.poolData.depositAmount,e=this.checkValue?{collateralRatio:0}:this.$parent.getTroveIndicators(t,this.totalDebt),a=e.collateralRatio;return a},checkValue:function(){return p()(this.coinAmount).isLessThan(0)?d["a"].t("notice.swapNotice.n2"):isNaN(this.coinAmount)?d["a"].t("notice.buidrNotice.n1"):this.$parent.validate(this.poolData.depositAmount,this.totalDebt)}}),methods:Object(s["a"])(Object(s["a"])({},Object(l["b"])("buildr",["setCurrentPool"])),{},{getTokenImg:function(t){return this.$parent.getTokenImg(t)},open:function(t){this.poolData=t,this.isOpen=!0,this.step=1,this.getLAIBalance()},getLAIBalance:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={tokenName:"LAI",chainID:t.ethChainID,library:t.ethersprovider,account:t.ethAddress,web3:t.web3},e.next=3,Object(b["b"])(a);case 3:t.LAIBalance=e.sent;case 4:case"end":return e.stop()}}),e)})))()},closeDialog:function(){this.isOpen=!1,this.coinAmount=0,this.setCurrentPool({})},changeStep:function(){this.step=1,this.coinAmount=0},onBurnClick:function(){this.isOpen=!1,this.coinAmount=0,this.$parent.openBurnDialog(this.poolData)},onChangeValue:function(t){this.coinAmount=t},onNextClick:function(){this.step=2},onMintClick:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var a,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.setCurrentPool({}),a={type:"borrow",liquityState:t.poolData.liquityState,tokenName:t.poolData.tokenName,chainID:t.ethChainID,library:t.ethersprovider,account:t.ethAddress,web3:t.web3,coinAmount:t.newDebt,unit:t.poolData.stableName},t.btnLoading=!0,e.prev=3,e.next=6,Object(r["d"])(a);case 6:n=e.sent,t.$parent.sendtx(n),t.isOpen=!1,e.next=14;break;case 11:e.prev=11,e.t0=e["catch"](3),t.btnLoading=!1;case 14:case"end":return e.stop()}}),e,null,[[3,11]])})))()}})},m=h,f=(a("bd2d"),a("2877")),v=Object(f["a"])(m,n,i,!1,null,"2b2fbb0a",null);e["default"]=v.exports},bb8f:function(t,e,a){},bd2d:function(t,e,a){"use strict";a("bb8f")},e652:function(t,e,a){},f3a0:function(t,e,a){t.exports=a.p+"img/arrow-left.e1aaf66f.svg"},fb2e:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAqklEQVQoU2NkgIL/oQxsDC8Y0hn+M0QzMDBoQYWvMTAyLGWQYJjJuJrhF0iMEUT8t2SQZmBm2MLAwGAAMwCNvsDwl8GH8TjDU0awyc8ZTqIoNnSAqD9/AFnfBQZJBnPG/7YMuQz/GSahmJjYAOHOh9IwSUaGPMb/NgwnGBgYzInSwMBwEqThEwMDAy+RGj6TpQHTSdg9DXLESeyexqUB7GlSg5XkiCM1aQAAzyZIc7QaxZMAAAAASUVORK5CYII="}}]);
//# sourceMappingURL=chunk-a90e079c.90a20425.js.map