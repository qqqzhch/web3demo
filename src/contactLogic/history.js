
import {swapHistory,pledgeHistory,buildrHistory} from "@/constants/apiconfig.js";
import _ from 'underscore';
import tokens from "@/constants/token.json";

import LPtoken from "@/constants/minertoken.json";

export  async function readSwapHistory(chainID,account,pageNum,showNum){
    const data = await swapHistory(account,pageNum,showNum);
    //['swapExactTokensForTokens','removeLiquidityWithPermit','addLiquidity']

    data.data.forEach((item)=>{
        if(item.method_name == 'removeLiquidityWithPermit'){
            item.show = removeLiquidityWithPermitformat(item.txs,chainID);
        }else if( item.method_name == 'swapExactTokensForTokens'){
            item.show = swapExactTokensForTokensformat(item.txs,chainID);
        }else if(item.method_name == 'addLiquidity'){
            item.show = addLiquidityformat(item.txs,chainID);

        }


    });



    console.log(data);
    return data;

}

export  async function readPledgeHistory(chainID,account,pageNum,showNum){
    const data = await pledgeHistory(account,pageNum,showNum);
    //['stake','exit','getReward']

    data.data.forEach((item)=>{
        if(item.method_name == 'stake'){
            item.show = stakeformat(item.txs,chainID);
        }else if( item.method_name == 'exit'){
            item.show = exitformat(item.txs,chainID);
        }else if(item.method_name == 'getReward'){
            item.show = getRewardformat(item.txs,chainID);

        }


    });



    console.log(data);
    return data;

}

export  async function readbuildrHistory(chainID,account,pageNum,showNum){
    const data = await buildrHistory(account,pageNum,showNum);
    //['stake','exit','getReward']

    data.data.forEach((item)=>{
        item.show = proxyformat(item.txs,chainID);

        // if(item.method_name == 'proxyMinted'){
        //     item.show = proxyformat(item.txs,chainID);
        // }else if( item.method_name == 'proxyBurned'){
        //     // item.show = exitformat(item.txs,chainID);
        // }else if(item.method_name == 'proxyJoined'){
        //     // item.show = getRewardformat(item.txs,chainID);

        // }else if(item.method_name == 'proxyExited'){
        //     // item.show = getRewardformat(item.txs,chainID);

        // }else if(item.method_name == 'approval'){
        //     // item.show = getRewardformat(item.txs,chainID);

        // }


    });

    return data;

}

function tokenNameByaddress(address,chainID){
    const coinA= _.find(tokens.tokens,(item)=>{
        if(item.chainId==chainID&&item.address.toLowerCase()==address.toLowerCase()){
            return item;
        }
        // {chainId:chainID,address:address}
    });
    if(coinA==undefined){
        return '';
    }
    return coinA.symbol;

}

function tokenNameByaddressStack(address,chainID){
    const coinA= _.find(LPtoken.tokens,(item)=>{
        if(item.chainId==chainID&&item.address.toLowerCase()==address.toLowerCase()){
            return item;
        }
        // {chainId:chainID,address:address}
    });
    if(coinA==undefined){
        return '';
    }
    return coinA.symbol;

}

function removeLiquidityWithPermitformat(item,chainID){
    const lpamount = item[0].amount;
    const  tokenADDRESSA = item[2].amount_token_address ;
    const  tokenADDRESSB = item[3].amount_token_address ;
    const amountA = item[2].amount;
    const amountB = item[3].amount;

    return {
        inamount:lpamount,
        outamount:[amountA,amountB],
        tokenA:tokenNameByaddress(tokenADDRESSA,chainID),
        tokenB:tokenNameByaddress(tokenADDRESSB,chainID)
    };


}

export  function swapExactTokensForTokensformat(item,chainID){
    const inamount = item[0].amount;
    const outamount = item[1].amount;

    const  tokenADDRESSA = item[0].amount_token_address ;
    const  tokenADDRESSB = item[1].amount_token_address ;

    return {
        inamount:inamount,
        outamount:outamount,
        tokenA:tokenNameByaddress(tokenADDRESSA,chainID),
        tokenB:tokenNameByaddress(tokenADDRESSB,chainID)
    };

}

function addLiquidityformat(item,chainID){
    const inamount = item[0].amount;
    const outamount = item[1].amount;

    const  tokenADDRESSA = item[0].amount_token_address ;
    const  tokenADDRESSB = item[1].amount_token_address ;

    const amountLP = item[2].amount;


    return {
        inamount:[inamount,outamount],
        outamount:amountLP,
        tokenA:tokenNameByaddress(tokenADDRESSA,chainID),
        tokenB:tokenNameByaddress(tokenADDRESSB,chainID)
    };

}


function stakeformat(item,chainID){
    const inamount = item[0].amount;


    const  tokenADDRESSA = item[0].amount_token_address ;
    const  poolADDRESS = item[0].to ;

    return {
        inamount:inamount,
        poolADDRESS,
        tokenA:tokenNameByaddressStack(tokenADDRESSA,chainID),

    };

}

function exitformat(item,chainID){
    const outamountA = item[0].amount;
    const outamountB = item[1].amount;


    const  tokenADDRESSA = item[0].amount_token_address ;
    const  tokenADDRESSB = item[1].amount_token_address ;

    const  poolADDRESS = item[1].from ;

    return {
        outamountA,
        outamountB,
        poolADDRESS,
        tokenA:tokenNameByaddressStack(tokenADDRESSA,chainID),
        tokenB:tokenNameByaddress(tokenADDRESSB,chainID)

    };

}

function getRewardformat(item,chainID){
    const inamount = item[0].amount;


    const  tokenADDRESSA = item[0].amount_token_address ;
    const  poolADDRESS = item[0].from ;

    return {
        outamount:inamount,
        poolADDRESS,
        tokenA:tokenNameByaddress(tokenADDRESSA,chainID),

    };

}


function proxyBurnedformat(item,chainID){
    const inamount = item[0].amount;

    const  tokenADDRESSA = item[0].amount_token_address ;

    return {
        amount:inamount,
        tokenA:tokenNameByaddressStack(tokenADDRESSA,chainID),

    };
}

function proxyformat(item,chainID){
    const inamount = item[0].amount;

    const  tokenADDRESSA = item[0].amount_token_address ;

    return {
        amount:inamount,
        tokenA:tokenNameByaddress(tokenADDRESSA,chainID),

    };
}

