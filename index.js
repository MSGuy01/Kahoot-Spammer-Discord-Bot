const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');
const Kahoot = require("kahoot.js-updated");
const sleep = require("system-sleep");
const kahootBotNumberSeperator = ' #';

bot.login(auth.token);

bot.on('ready', () => {
    console.log('Kahoot spammer bot is online.');
});

function check(msg) {
    let numberOfBots = '';
    let kahootCode = '';
    let botPrefix = '';
    let index = 0;
    for (let i = 6; i < msg.length; i++) {
        index = i;
        if (msg[i] == ' ') {
            break;
        }
        numberOfBots += msg[i];
    }
    index++;
    for (let i = index; i < msg.length; i++) {
        index = i;
        if (msg[i] == ' ') {
            break;
        }
        kahootCode += msg[i];
    }
    index++;
    for (let i = index; i < msg.length; i++) {
        index = i;
        botPrefix += msg[i];
    }
    return [parseInt(numberOfBots), parseInt(kahootCode), botPrefix];
}

bot.on('message', message => {
    let msg = message.content;
    if (msg.substr(0,5) == '!help') {
        message.channel.send('*KAHOOT SPAMMER COMMANDS*\n!spam [# of bots] [code] [bot prefix]: spam a given Kahoot with the given number of bots.');
    }
    if (msg.substr(0,5) == '!spam') {
        let checkMSG = check(msg);
        let numberOfBots = checkMSG[0];
        let kahootCode = checkMSG[1];
        let kahootBotPrefix = checkMSG[2];
        var numCorrect = [];
        var questionIndex = -1;
        for (var i = 0; i < numberOfBots; i++) {
            if (i != numberOfBots-1) {
                let client = new Kahoot;
                client.setMaxListeners(Number.POSITIVE_INFINITY);
                client.join(kahootCode, kahootBotPrefix + kahootBotNumberSeperator + i);
                client.on("QuestionEnd", question => {
                    numCorrect.push(question.isCorrect);
                });
                client.on("QuestionStart", question => {
                    let currentAnswer = Math.floor(Math.random() * 4);
                    question.answer(currentAnswer);
                });
                sleep(250);
            }
            else {
                let client = new Kahoot;
                client.setMaxListeners(Number.POSITIVE_INFINITY);
                client.join(kahootCode, kahootBotPrefix + kahootBotNumberSeperator + i);
                client.on("QuestionEnd", question => {
                    numCorrect.push(question.isCorrect);
                    sleep(100);
                    let stats = [0,0];
                    for (let j = (questionIndex * numberOfBots); j < numCorrect.length; j++) {
                        (numCorrect[j]) ? stats[0]++ : stats[1]++;
                    }
                    console.log(questionIndex);
                    console.log(numCorrect);
                    message.channel.send(stats[0] + ' bots were correct, and ' + stats[1] + ' bots were incorrect.');
                });
                client.on("QuestionStart", question => {
                    questionIndex++;
                    let currentAnswer = Math.floor(Math.random() * 4);
                    question.answer(currentAnswer);
                });

                client.on("QuizEnd", question => {
                    message.channel.send("Quiz ended!");
                });

                client.on("QuizStart", question => {
                    message.channel.send("Quiz started!");
                });
                sleep(250);
            }
        }
        message.channel.send("Successfully joined all bots.");
    }
});