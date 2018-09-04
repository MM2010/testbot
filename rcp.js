const bitcoin_rpc = require('node-bitcoin-rpc');
let pippo;
/**
 * 
 * @param {*} params 
 * @param {*} IP 
 * @param {*} PORT 
 * @param {*} USR 
 * @param {*} PWD 
 */
 module.exports.ExecuteCommand =   function(params,IP,PORT,USR,PWD) {
    bitcoin_rpc.init(IP, PORT, USR, PWD);
    //bitcoin_rpc.setTimeout(1000)
    let result;
    
     bitcoin_rpc.call(params[0], params[1], function(err, res) {
            if (err !== null) {
                if (res !== undefined && res !== null){
                    console.log('I have an error :( ' + err + ' ' + res.error);
                }else{
                    console.log('Cant connect: ' + err);
                }
            } else {
                console.log(res.result);
                return  res;
            }
        });
};

