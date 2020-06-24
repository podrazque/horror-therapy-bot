var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const Discord = require('discord.js');
const client = new Discord.Client()

const config = require("./node.js").config;
const auth = JSON.parse(JSON.stringify(config));

const rec_cmds = ["rec", "recommend", "consider", "watch", "add"];
const del_cmds = ["del", "delete", "remove", "rem", "trash", "watched", "done"];

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
    else if(rec_cmds.includes(cmd)){
        message.channel.send('Your recommendation of "' + recommendation + '" has been saved.');
    }
    else if(del_cmds.includes(cmd)){
        message.channel.send('You have deleted "' + recommendation + '".');
    }
    else{
        message.channel.send('Idk what youre saying dude');
    }
}});
        // title: recommendation
        // recommender: user
        // rating: 

