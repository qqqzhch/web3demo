(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4023dc45"],{"11d5":function(e){e.exports=JSON.parse('[{"name":"LAMB","title":"LAMB-A","titlei18":"LAMB-A","token":"LAMB","desc":"Lambda","state":false},{"name":"ETH","title":"ETH-A","titlei18":"ETH-A","token":"ETH","desc":"ETH","state":false},{"name":"SCASH","title":"SCASH-A","titlei18":"SCASH-A","token":"SCASH","desc":"SCASH","state":false},{"name":"HT","title":"HT-A","titlei18":"HT-A","token":"HT","state":false},{"name":"BNB","title":"BNB","titlei18":"BNB","token":"BNB","desc":"BNB","state":true}]')},"49b0":function(e,t,r){"use strict";r.d(t,"c",(function(){return d})),r.d(t,"a",(function(){return f})),r.d(t,"b",(function(){return p}));var a=r("3835"),n=r("1da1"),o=(r("96cf"),r("7db0"),r("2332")),i=r("fe74"),c=r("c46f"),u=r("666b"),l=r("6df3"),s=r("167d");function d(e,t,r,a,n){return b.apply(this,arguments)}function b(){return b=Object(n["a"])(regeneratorRuntime.mark((function e(t,r,n,i,c){var l,d,b,f,p,w,y,m,v;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return l=Object(u["f"])(i),d=Object(u["f"])(c),b=[l.balanceOf(n),d.balanceOf(n)],f=new o["Provider"](r,t),e.next=7,f.init();case 7:return e.next=9,f.all(b);case 9:if(p=e.sent,w=Object(a["a"])(p,2),y=w[0],m=w[1],v=Object(s["a"])(t),i.symbol!=v.coinName){e.next=18;break}return e.next=17,r.getBalance(n);case 17:y=e.sent;case 18:if(c.symbol!=v.coinName){e.next=22;break}return e.next=21,r.getBalance(n);case 21:m=e.sent;case 22:return e.abrupt("return",{TokenAamount:y,TokenBamount:m});case 23:case"end":return e.stop()}}),e)}))),b.apply(this,arguments)}function f(e,t){var r=c["a"].find(i.tokens,{chainId:t,symbol:e}),a=new l["Token"](r.chainId,r.address,r.decimals,r.symbol);return a}function p(e,t){var r=c["a"].find(i.tokens,{chainId:t,symbol:e});return r?r.logoURI:""}},"4c53":function(e,t,r){"use strict";var a=r("23e7"),n=r("857a"),o=r("af03");a({target:"String",proto:!0,forced:o("sub")},{sub:function(){return n(this,"sub","","")}})},"4e7c":function(e,t,r){"use strict";r.d(t,"a",(function(){return s}));r("d3b7"),r("25f0"),r("99af"),r("4c53");var a=r("b565"),n=r("97a5"),o=new a["Percent"](a["MINIMUM_COLLATERAL_RATIO"]).toString(0),i=new a["Percent"](a["CRITICAL_COLLATERAL_RATIO"]).toString(0),c=function(e,t,r){var a=e.depositCollateral,c=t.resultingTrove,u=t.recoveryMode,l=t.wouldTriggerRecoveryMode,s=r.accountBalance,d=r.price;if(c.debt.lt(n["a"]))return"Debt must be at least ".concat(n["a"].toString()," ").concat(n["h"]);if(u){if(!c.isOpenableInRecoveryMode(d))return"You're not allowed to open a Trove with less than ".concat(i," Collateral\n                Ratio during recovery mode. Please increase your Trove's Collateral Ratio.")}else{if(c.collateralRatioIsBelowMinimum(d))return"Collateral ratio must be at least ".concat(o,".");if(l)return"You're not allowed to open a Trove that would cause the Total Collateral Ratio to fall\n                      below ".concat(i,". Please increase your Trove's Collateral Ratio.")}return a.gt(s)?"The amount you're trying to deposit exceeds your balance by\n                    ".concat(a.sub(s).prettify()," BNB."):null},u=function(e,t,r){var a=e.repayLUSD,o=t.recoveryMode,c=t.wouldTriggerRecoveryMode,u=r.numberOfTroves,l=r.lusdBalance;return 1===u?"You're not allowed to close your Trove when there are no other vaults in the system.":o?"You're not allowed to close your Trove during recovery mode.":null!==a&&void 0!==a&&a.gt(l)?"You need ".concat(a.sub(l).prettify()," ").concat(n["h"]," more to close your Trove"):c?"You're not allowed to close a Trove if it would cause the Total Collateralization Ratio to\n        fall below ".concat(i,". Please wait until the Total Collateral Ratio\n        increases."):null},l=function(e,t,r){var a=e.depositCollateral,c=e.withdrawCollateral,u=e.borrowLUSD,l=e.repayLUSD,s=t.originalTrove,d=t.resultingTrove,b=t.recoveryMode,f=t.wouldTriggerRecoveryMode,p=r.price,w=r.accountBalance,y=r.lusdBalance;if(b){if(c)return"You're not allowed to withdraw collateral during recovery mode.";if(u){if(d.collateralRatioIsBelowCritical(p))return"Your collateral ratio must be at least ".concat(i," to borrow during\n                    recovery mode. Please improve your collateral ratio.");if(d.collateralRatio(p).lt(s.collateralRatio(p)))return"You're not allowed to decrease your collateral ratio during recovery mode."}}else{if(d.collateralRatioIsBelowMinimum(p))return"Collateral ratio must be at least ".concat(o,".");if(f)return"The adjustment you're trying to make would cause the Total Collateral Ratio to\n            fall below ".concat(i," . Please increase your Trove's Collateral Ratio.\n            ")}if(l){if(d.debt.lt(n["a"]))return" Debt must be at least ".concat(n["a"].toString()," ").concat(n["h"]);if(l.gt(y))return"The amount you're trying to repay exceeds your balance by ".concat(l.sub(y).prettify())}return a&&a.gt(w)?"The amount you're trying to deposit exceeds your balance by\n                ".concat(a.sub(w).prettify()," BNB"):null},s=function(e){var t=e.trove,r=e.borrowingRate,o=e.state,i=e.depositAmount,s=e.borrowAmount,d=t,b=new a["Trove"](d.collateral,d.debt);b=b.setCollateral(i),b=b.setDebt(s);var f=o.total,p=o.price,w=d.whatChanged(b,r);if(!w)return"";var y=d.apply(w,r),m=f.collateralRatioIsBelowCritical(p),v=f.subtract(d).add(y).collateralRatioIsBelowCritical(p),g={resultingTrove:y,recoveryMode:m,wouldTriggerRecoveryMode:v};if("invalidCreation"===w.type)return"Debt must be at least ".concat(n["a"].toString());var h="creation"===w.type?c(w.params,g,o):"closure"===w.type?u(w.params,g,o):l(w.params,g,o);return h||""}},"97a5":function(e,t,r){"use strict";r.d(t,"h",(function(){return f})),r.d(t,"a",(function(){return y})),r.d(t,"e",(function(){return v})),r.d(t,"f",(function(){return g})),r.d(t,"g",(function(){return h})),r.d(t,"c",(function(){return T})),r.d(t,"b",(function(){return A})),r.d(t,"d",(function(){return S}));var a=r("1da1"),n=(r("96cf"),r("d3b7"),r("25f0"),r("99af"),r("b565")),o=r("c00b"),i=r("a078"),c=r("bcab"),u=c.EthersLiquity,l=c._connectByChainId,s=(new n["Percent"](n["MINIMUM_COLLATERAL_RATIO"]).toString(0),new n["Percent"](n["CRITICAL_COLLATERAL_RATIO"]).toString(0),o["a"]),d=.005,b=i["a"].gasLimit,f="LAI",p=1.1,w=20,y=200,m=function(e){return e.borrowingRate.add(d).toString()},v=function(e){var t=e.library,r=e.account,a=e.chainID,n=l(t,r?t.getSigner(r):void 0,a,{userAddress:r,frontendTag:s,useStore:"blockPolled"}),o=u._from(n);return o},g=function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,o,i,c,u,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=t.liquity,a=t.library,n=t.account,o=t.chainID,i=t.depositAmount,c=t.borrowLUSDAmount,r=r||v({library:a,account:n,chainID:o}),e.next=4,r.populate.openTrove({depositCollateral:i,borrowLUSD:c});case 4:return u=e.sent,e.prev=5,e.next=8,a.estimateGas(u.rawPopulatedTransaction);case 8:l=e.sent,l=l.add(5e4).toString(),e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](5);case 15:return e.abrupt("return",l);case 16:case"end":return e.stop()}}),e,null,[[5,12]])})));return function(t){return e.apply(this,arguments)}}(),h=function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,o,i,c,u,l,s,d;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=t.library,a=t.account,n=t.chainID,o=t.depositAmount,i=t.borrowLUSDAmount,c=t.liquityState,u=v({library:r,account:a,chainID:n}),l=m(c),e.next=5,g({liquity:u,library:r,account:a,chainID:n,depositAmount:o,borrowLUSDAmount:i});case 5:return s=e.sent,e.next=8,u.send.openTrove({depositCollateral:o,borrowLUSD:i},l,{gasLimit:s});case 8:return d=e.sent,e.abrupt("return",{base:"Deposit: ".concat(o," BNB, Debt: ").concat(i," ").concat(f),transaction:d});case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),T=function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,o,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=t.library,a=t.account,n=t.chainID,o=v({library:r,account:a,chainID:n}),e.next=4,o.send.closeTrove({gasLimit:b});case 4:return i=e.sent,e.abrupt("return",{base:"Close Vault",transaction:i});case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),R=function(e,t,r){var a=e.whatChanged(t,r);return a&&"invalidCreation"!==a.type&&a.params.borrowLUSD?a.params.borrowLUSD.mul(r):n["Decimal"].ZERO},A=function(e,t,r){var a=e.trove,o=new n["Trove"](a.collateral,a.debt),i=e.price,c=e.borrowingRate;o=o.setCollateral(t),o=o.setDebt(r);var u=R(a,o,c).toString(),l=o.isEmpty?"":o.collateralRatio(i).toString();return{stableName:f,liquidationReserve:w,price:i,borrowingRate:c,borrowingFee:u,collateralRatio:l,liquidationRatio:p}},C={deposit:"Deposit",withdraw:"Withdraw",borrow:"Borrow",repay:"Repay"},S=function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,o,i,c,u,l,s,d,f;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:r=t.library,a=t.account,n=t.chainID,o=t.liquityState,i=t.type,c=t.coinAmount,u=t.unit,l=v({library:r,account:a,chainID:n}),s=m(o),d={},e.t0=i,e.next="deposit"===e.t0?7:"withdraw"===e.t0?9:"borrow"===e.t0?11:"repay"===e.t0?13:15;break;case 7:return d={depositCollateral:c},e.abrupt("break",15);case 9:return d={withdrawCollateral:c},e.abrupt("break",15);case 11:return d={borrowLUSD:c},e.abrupt("break",15);case 13:return d={repayLUSD:c},e.abrupt("break",15);case 15:return e.next=17,l.send.adjustTrove(d,s,{gasLimit:b});case 17:return f=e.sent,e.abrupt("return",{base:"".concat(C[i]," ").concat(c," ").concat(u),transaction:f});case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},b530:function(e,t,r){"use strict";r.d(t,"a",(function(){return i}));r("2909"),r("1da1");var a=r("5530"),n=(r("96cf"),r("d81d"),r("4de4"),r("d3b7"),r("25f0"),r("99af"),r("11d5")),o=(r("03e1"),r("1062"),r("a26d"),r("adae"),r("167d")),i=function(e){var t=Object(o["a"])(e);return n.filter((function(e){return e.state})).map((function(e){var r=!0;return Object(a["a"])(Object(a["a"])({},e),{},{isNative:t.coinName===e.token,isERC20:r})}))}}}]);
//# sourceMappingURL=chunk-4023dc45.6916251f.js.map