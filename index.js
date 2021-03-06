const Discord = require('discord.js');
const { MongoClient } = require("mongodb");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config()
const prefix = process.env.prefix;
const token = process.env.token;
function between(min, max) {return Math.floor(Math.random() * (max - min) + min)}
function newStatus() {
if (between(0,10) > 4) {
client.user.setActivity(`${client.users.cache.size} users | ${prefix}ticket`, { type: 'LISTENING' });
} else {client.user.setActivity(`${client.guilds.cache.size} servers | ${prefix}ticket`, { type: 'WATCHING' });}}
client.once('ready', () => {
console.log(`Logged in as ${client.user.tag}`);
newStatus();
setInterval(function(){newStatus();},10000);
});

client.on('messageReactionAdd', async (reaction, user) => {
if (user.bot===false) {
if (reaction.partial) {
try {await reaction.fetch();}
catch (error) {console.log('Something went wrong when fetching the message: ', error);return;}}
if (reaction.message.content.startsWith("^ticket")===true) {
const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
try {for (const reaction of userReactions.values()) {await reaction.users.remove(user.id);}} catch (error) {console.error("Failed to remove reactions");}
var server = reaction.message.guild;
server.channels.create("ticket-"+user.username);
}}});
client.on('message', async message => {
if (message.author.bot===false&&message.content.startsWith(prefix)===true) {
const args = message.content.split(" ");
const command = message.content.substring(prefix.length,message.content.length);
if (command.startsWith("ticket")===true){
var string = command.substring(7,message.content.length);
if (string=="") {var string = "Create your ticket by reacting."}
message.channel.bulkDelete(1);
const embed = new Discord.MessageEmbed()
.setColor("#0099ff")
.setTitle(":tickets: | Ticket")
.setDescription("React to this message to create a ticket")
.addField(string,"\u200B")
.setFooter("Ticket bot");
message.channel.send("^ticket",[embed])
.then(function(message) {
message.react("🎟");
}).catch(function(){});
}
if (command.startsWith("invite")===true){
    const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(":envelope: | Invite")
    .setDescription("Here's an invite link for the bot: [Invite link](https://discord.com/api/oauth2/authorize?client_id=744555370789339156&permissions=8&scope=bot)")
    .setFooter("Ticket bot");
    message.channel.send(embed);
    }
}});

client.login(token);