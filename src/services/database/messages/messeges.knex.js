const knexConfig = require('../config');
const knexDb = require('knex');
const { v4: uuidv4 } = require('uuid');

class Chat{
    constructor(){
        this.knexConfig = knexConfig;
    }

    async createChat(chat){
        const knex = knexDb(this.knexConfig);
        Object.assign(chat, {
            code: uuidv4()
        })
        return new Promise((resolve, reject) => {
            knex('chats').insert(chat).then(() => {
                resolve({
                    success: true,
                    data: chat
                });
            }).catch(err => {
                reject(err)
            }).finally(() =>{
                knex.destroy();
            });
        })
    }

    async getChat(chatCode){
        const knex = knexDb(this.knexConfig);
        try{
            const data = await knex('chats').where('code', '=', chatCode).select('*');
            if(data.length == 0){
                return {
                    success: true,
                    message: 'chat not found'
                }
            }
            const chatFormatted = JSON.parse(JSON.stringify(data[0]));
            knex.destroy();
            return {
                success: true,
                data: chatFormatted
            }
        }catch(err){
            console.error(err);
            knex.destroy();
            return {
                success: false,
                message: err.message
            }
        }
    }

}

module.exports = Chat;