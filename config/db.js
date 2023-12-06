const {Sequelize} = require('sequelize');

database = process.env.DB_NAME;
username = process.env.DB_USER;
password = process.env.DB_PASS;

const sequelize = new Sequelize({
        host: 'localhost',
        dialect: 'postgres',
        database: database,
        username: username, 
        password: password
    });

    try{
        sequelize.authenticate();
        console.log("DB Connected");
        sequelize.sync();
    }catch(e){
        console.log(e);
    }

module.exports = sequelize;