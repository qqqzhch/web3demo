
import {swapHistory} from "@/constants/apiconfig.js";
import _ from 'underscore';
import tokens from "@/constants/token.json";

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

function swapExactTokensForTokensformat(item,chainID){
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