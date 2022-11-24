const knexConfig = require('../config');
const knex = require('knex')(knexConfig);

knex.schema.createTable('chats', table => {
    table.increments('id'),
    table.string('name').notNullable(),
    table.string('messege')
}).then(() => {
    console.info('Table created');
}).catch(err => {
    console.error(err)
}).finally(() => {
    knex.destroy();
});