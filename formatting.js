
/**
 * Return a field object that need to be added to Fields collection in order to cretae a good markup
 * for a better readability for the user
 * @param {string} title Field name that appears as title
 * @param {*} text Field text content
 */
module.exports.FormattingGetField=function(title,text){
    var field= {
        name: title,
        value: text
    }
    return field;
}
   /**
    * return an Author object alredy formatted as per discord guideline.
    * @param {string} user Username that send the message from  client.user.username
    * @param {*} avatar User avatar from client.user.avatarURL
    */
module.exports.FormattingGetAuthor=function(user,avatar){
    var field= {
        name: user,
        icon_url: avatar
    }
    return field;
}
/**
 * Return a formatted footer based on discord guideline and example.
 * @param {string} user Username that send the message from  client.user.username
 * @param {*} avatar User avatar from client.user.avatarURL
 */
module.exports.FormattingGetFooter=function(textfooter,avatar){
    var field= {
        icon_url: avatar,
        text: textfooter
      }
    return field;
}

module.exports.GetFormattedMessage=function(){
//     var embed={
//         title:"",
//         description:"",
//         author:{},
//         fields:[
//         ],
//         footer:{}
//     };

// embed.author=formatting.FormattingGetAuthor(message.client.username, client.user.avatarURL);
// embed.title="Test Bot Discord Javascript";
// embed.description="Those address are strictly reserver to you. Save data in a **SAFE PLACE**."
// embed.fields.push(formatting.FormattingGetField("PCN ADDRESS",result.result));
// embed.fields.push(formatting.FormattingGetField("PXN ADDRESS","PWJGGNp85ofqi64BCduqYrR3CTeBjRfo9x"));
}

// {embed: {
//     color: 3447003,
//     author: {
//       name: client.user.username,
//       icon_url: client.user.avatarURL
//     },
//     title: "This is an embed",
//     url: "http://google.com",
//     description: "This is a test embed to showcase what they look like and what they can do.",
//     fields: [{
//         name: "Fields",
//         value: "They can have different fields with small headlines."
//       },
//       {
//         name: "Masked links",
//         value: "You can put [masked links](http://google.com) inside of rich embeds."
//       },
//       {
//         name: "Markdown",
//         value: "You can put all the *usual* **__Markdown__** inside of them."
//       }
//     ],
//     timestamp: new Date(),
//     footer: {
//       icon_url: client.user.avatarURL,
//       text: "© Example"
//     }
//   }
// }
// }