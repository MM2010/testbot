const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./conf.json");
const request = require('request-promise');
const _ = require('lodash');
const $q = require('q');
//wallet paremeter actually hardcoded in walletrpc.json configuration file
const walletconf = require("./walletrpc.json");
//optional module to create formatted text in discord
//to be implemented in better way
const formatting = require("./formatting");
//bitcoin node
const bitcoin_rpc = require('node-bitcoin-rpc');
//tmp databse for test pourpose
const db={
    users:[]
}

//login bot
client.on('ready', () => {
    console.log('bot up and running');
});
//message from discord
client.on('message',  message => {
    if (_.startsWith(message.content, '$')) {
        var contents = message.content.split(" ");

        var command =   ValidateCommands(message);

        if (command.aborted){
            return;
        }

        //check rpccommand in order to send wallet request and get back a result
        if (command.rpccommand != null) {
            console.log("awating rpc command")
            ExecuteCommand(message,command,walletconf.pcn);
        } else {
            ResponseMessage(message,"Bad command provided!")
        }
    }
});




/**
 * Generic Handler Message function
 * @param {any} message Discord message instance
 * @param {any} content Text or embed object to return to user
 */
function ResponseMessage(message,content){
    message.channel.send(content);
}
/**
 * 
 * @param {any} message original discord message instance
 * @param {any} command object that expose some properties
 * @param {any} wallet config file wallet section in exaple wallet.pcn or wallet.pxn for test mode
 */
 function ExecuteCommand(message,command,wallet){
    bitcoin_rpc.init(wallet.IP, wallet.PORT, wallet.USR, wallet.PWD);
    //bitcoin_rpc.setTimeout(1000)
   bitcoin_rpc.call(command.rpccommand, command.rpcoptions, function(err, res) {
            let contentmessage="";
            if (err !== null) {
                if (res !== undefined && res !== null){
                    console.log(`I have an error :(${err}  ${res.error}`);
                   contentmessage="Something is gone wrong, we are investigating";
                }else{
                    console.log(`Cant connect: ${err}`);
                    contentmessage="Cant connect to the server.";
                }
            } else {
                console.log(res.result);
                let user=GetUserByUid(message.author.id);
                user.pubkey=res.result;
                contentmessage=res.result;
            }
            ResponseMessage(message,contentmessage);
        });

}




//section internal functions

/**
 * Check if a user is already registered into the database or not
 * if registered retur true else return false
 * @param {number} uid Unique Identifier discord from message.author.id
 */
function IsRegisteredUser(uid){
    let user = GetUserByUid(uid);
    if (user){
        return true;
    } else {
        return false;
    }
}
/**
 * Add a new user in database in order to trace new one from old one
 * @param {number} uid Unique identifier discord from message.author.id
 * @param {string} username Username used by the user associated to the uid comes from message.author.username
 */
function RegisterUserInDatabase(uid, username){
    //new user object to simulate database transaction to create new user
    let user={
        uid:uid,
        username:username,
        fullname:uid +'-'+username,
        pubkey:null,
        transations:[]
    }
    db.users.push(user);
}

/**
 * Find and return user by UID discord
 * @param {number} uid Unique discord identifier from message.author.id
 * @returns {object} User Object
 */
function GetUserByUid(uid){
    let user = _.find(db.users, {'uid': uid});
    return user;
}

/**
 * Validate correct parameters in order to interact with wallet
 * @param {any} message Discord bot message instance
 * @returns {any} Object command with few property
 */
function ValidateCommands(message) {
    let user;
    /**
     * Command object which expose different properties
     */
    var command = {
        //rpc command to execute
        rpccommand: null,
        //optional parameters
        rpcoptions: [],
        //not sure to take in place
        isvalid:false,
        //description error
        errReason:null,
        //aborted when no need to continute with rcp call
        aborted:false
    }

    //Iterate over all the command in walletconf and set command object based on result
    walletconf.commands.forEach(cmd => {
        if (message.content.toLowerCase().indexOf(cmd) > -1) {
            //check the command it self
            //to match wallet command required
            switch (cmd) {
                case "getpeerinfo":
                    command.rpccommand = "getpeerinfo"
                    break;
                //Create new address for swap for the user
                //actually work without any database support in test mode.
                //Database infrastructure to be implemented in order to user, id, guidaddres to use as account
                //need couple of check in order to avoid address duplication to same username
                case "register":
                    if(!IsRegisteredUser(message.author.id)){
                         //user not registered in database proceed to create the user and compile the command
                        RegisterUserInDatabase(message.author.id,message.author.username);
                        command.rpccommand = "getnewaddress"
                        command.rpcoptions.push(message.author.id);
                    }else{
                        //user already register abort the task and return as default message he's own pubkey
                        command.aborted=true;
                        command.errReason='User alredy registered in db';
                        let user= GetUserByUid(message.author.id);
                        ResponseMessage(message,`PCN address: ${user.pubkey}`);
                    }
                    break; 
                //Check current user balance in the provided wallet of pcn
                case "checkbalance":
                    break;
                case "":
                    break;
            }
        }
    });
    //return the object with valid information to complete the taks 
    return command;
}








//start bot
client.login(config.token);