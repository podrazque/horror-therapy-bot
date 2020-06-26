var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const Discord = require('discord.js');
const { emoji } = require("node-emoji");
const client = new Discord.Client()

const config = require("./node.js").config;
const auth = JSON.parse(JSON.stringify(config));

const rec_cmds = ["rec", "recommend", "consider", "watch", "add"];
const del_cmds = ["del", "delete", "remove", "rem", "trash", "watched", "done"];

const emoji_map_rating = new Map().set("1️⃣", 1).set("2️⃣", 2).set("3️⃣", 3).set("4️⃣", 4).set("5️⃣", 5)
                                  .set("6️⃣", 6).set("7️⃣", 7).set("8️⃣", 8).set("9️⃣", 9).set("🔟",10);
const keys_nums = [...emoji_map_rating.keys()];

const emoji_map_rec = new Map().set("👍", 1).set("👎", -1);
const keys_thumbs =[...emoji_map_rec.keys()];

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

// TODO Create a map for each user that votes with their id mapped to their vote
// TODO When a user changes their vote update the value in the map, recalculate the rating and
// TODO remove their vote emoji from the client side.

client.on('messageReactionAdd', async (reaction, user) => {

    var flag;

    if(keys_nums.includes(reaction.emoji.name)) {
        flag = 0;
    } else if (keys_thumbs.includes(reaction.emoji.name)){
        flag = 1;
    } else {
        reaction.message.channel.send("That emoji doesn't correspond to anything. To rate the movie use 1️⃣ - 🔟 or to recommend the movie use 👍 or 👎 (default skin tone).");
    }

    message_str = reaction.message.content.toLowerCase();

    if (message_str.substring(0, 1) == '!') {
        var args = message_str.substring(1).split(' ');
        var cmd = args[0];
        var recommendation = message_str.substring(cmd.length+2, message_str.length);

    const doc = db.collection('movies').doc(recommendation);
    const movie = await doc.get();

    // ? const movie = await db.collection('movies').doc(reaction.message.content).get();
    if(!movie.exists){
        console.log("No such document.");
    }

    if(flag == 0) {
        var rating = movie.data().rating;
        var total = movie.data().total;

        rating = rating + (( emoji_map_rating.get(reaction.emoji.name) - rating ) / (total + 1))

        const res = await db.collection('movies').doc(recommendation).update({
            rating: rating,
            total: total + 1
        });
    } else {
        var votes = movie.data().votes;
        votes += emoji_map_rec.get(reaction.emoji.name);
        const res = await db.collection('movies').doc(recommendation).update({votes});
    }

    console.log('a reaction ' + reaction.emoji.name + ' has been added to ' + recommendation);
}});

client.on('messageReactionRemove', (reaction, user) => {
    console.log('a reaction ' + reaction.emoji.name + ' has been deleted from ' + reaction.message.content);
});

client.on('message', async message => {

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
    else if(message.content === '!pingdb'){

        db.collection('movies').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.data());
            })
        });
    }
    else if(rec_cmds.includes(cmd) && recommendation != "" && recommendation != " "){

        const data = {
            title: recommendation,
            rating: 0,
            total: 0,
            recommender: message.author.username,
            votes: 0
        };

        const res = await db.collection('movies').doc(recommendation).set(data);

        message.channel.send('Your recommendation of "' + recommendation + '" has been saved.');
    }
    else if(del_cmds.includes(cmd) && recommendation != "" && recommendation != " "){

        const res = await db.collection('movies').doc(recommendation).delete();

        message.channel.send('You have deleted "' + recommendation + '".');
    }
    else{
        message.channel.send('Idk what youre saying dude');
    }
}});
