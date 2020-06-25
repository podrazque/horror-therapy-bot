var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const Discord = require('discord.js');
const client = new Discord.Client()

const config = require("./node.js").config;
const auth = JSON.parse(JSON.stringify(config));

const rec_cmds = ["rec", "recommend", "consider", "watch", "add"];
const del_cmds = ["del", "delete", "remove", "rem", "trash", "watched", "done"];

const emoji_map_rating = [
    {"1️⃣":1}, {"2️⃣":2}, {"3️⃣":3}, {"4️⃣":4}, {"5️⃣":5},
    {"6️⃣":6}, {"7️⃣":7}, {"8️⃣":8}, {"9️⃣":9}, {"🔟":10}
];

const emoji_map_rec =[
    {"👍":1}, {"👎":-1}
]

client.once('ready', () => {
	console.log('Ready!');
});

client.login(auth.token);

var firebaseConfig = {
    apiKey: "AIzaSyAvKeArC31LKssyz3S7NchYqVa_qK6kvnQ",
    authDomain: "horror-therapy-bot.firebaseapp.com",
    databaseURL: "https://horror-therapy-bot.firebaseio.com",
    projectId: "horror-therapy-bot",
    storageBucket: "horror-therapy-bot.appspot.com",
    messagingSenderId: "446102666446",
    appId: "1:446102666446:web:fa88b8b63a1a7c62f0e49f",
    measurementId: "G-QMQ6DHJFFH"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

db.collection('movies').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
    })
});

client.on('messageReactionAdd', (reaction, user) => {
    console.log('a reaction ' + reaction.emoji.name + ' has been added to ' + reaction.message.content);
});

client.on('messageReactionRemove', (reaction, user) => {
    console.log('a reaction ' + reaction.emoji.name + ' has been deleted from ' + reaction.message.content)
})

client.on('message', message => {

    if(message.author.bot) return;
    message_str = message.content.toLowerCase();

    if (message_str.substring(0, 1) == '!') {
        var args = message_str.substring(1).split(' ');
        var cmd = args[0];
        var recommendation = message_str.substring(cmd.length+2, message_str.length);
        
        console.log(args, cmd, recommendation);

        console.log(message.author.username);


    if(message.content === '!live'){
        message.channel.send('Im alive!');
    }
    else if(rec_cmds.includes(cmd) && recommendation != "" && recommendation != " "){
        message.channel.send('Your recommendation of "' + recommendation + '" has been saved.');
    }
    else if(del_cmds.includes(cmd) && recommendation != "" && recommendation != " "){
        message.channel.send('You have deleted "' + recommendation + '".');
    }
    else{
        message.channel.send('Idk what youre saying dude');
    }
}});
        // title: recommendation
        // recommender: user
        // rating: 

