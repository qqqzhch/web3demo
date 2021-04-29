export default function getChainCoinInfo(chianID){
    let  info;
    switch(chianID){
        case 1:
        case 4:
        case 3:info={
            coinName:'ETH',
            tokenID:'ethereum',
            LAI:'LUSD',
            BABEL:'LQTY'

        } ;break;
        case 128:
        case 256:info={
            coinName:'HT',
            tokenID:'huobi-token'

        } ;break;
        case 56:
        case 97:info={
            coinName:'BNB',
            tokenID:'binancecoin',
            LAI:'LAI',
            BABEL:'BABEL'

        } ;break;
        default: info={
            coinName:'ETH',
            tokenID:'ethereum',
            LAI:'LAI',
            BABEL:'BABEL'

        };


    }
    return info;


}
