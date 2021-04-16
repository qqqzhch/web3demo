export default function getChainCoinInfo(chianID){
    let  info;
    switch(chianID){
        case 1:
        case 4:
        case 3:info={
            coinName:'ETH',
            tokenID:'ethereum'

        } ;break;
        case 128:
        case 256:info={
            coinName:'HT',
            tokenID:'huobi-token'

        } ;break;
        case 56:
        case 97:info={
            coinName:'BNB',
            tokenID:'binancecoin'

        } ;break;
        default: info={
            coinName:'ETH',
            tokenID:'ethereum'

        };


    }
    return info;


}
