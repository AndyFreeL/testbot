const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions} = require('./options')

const token = '5925944918:AAEWQjRW5gaHGr7IX0n_rPv8I6J19tCd5FE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, `0-9?`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await  bot.sendMessage(chatId, `you say...`, gameOptions)
}

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Hello'},
        {command: '/info', description: 'Info'},
        {command: '/game', description: 'Game'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/again'){
            return startGame(chatId)
        }

        if (text === '/start') {
            return bot.sendMessage(chatId, `Welcome!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name ${msg.from.first_name}`)
        }
        if (text === '/game') {
           return startGame(chatId)
        }
        return bot.sendMessage(chatId, `i don't know`)
    })

    bot.on('callback_query', async msg=>{
        const data= msg.data;
        const chatId = msg.message.chat.id;
        if(data==='/again'){
            return startGame(chatId)
        }
        if (data===chats[chatId].toString()){
            return await bot.sendMessage(chatId, `You win! is ${chats[chatId]}`, againOptions)
        }else {
            return await bot.sendMessage(chatId, `Wrong! is ${chats[chatId]}`, againOptions)
        }
    })
}

start()
