const Sequelize = require("sequelize");
const connection = require("../database/database");
const Article = require("../articles/ArticleModel")

const User = connection.define('users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }, email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Profile = connection.define('profile', {
    profileId: {
        type: Sequelize.INTEGER, // Tipo de dado como número inteiro
        autoIncrement: true, // Define como auto-incremento
        primaryKey: true // Define como chave primária
    },
    profile: {
        type: Sequelize.STRING, // Tipo de dado como string
        allowNull: false // Campo obrigatório
    }
});

Profile.afterSync(async () =>{
    const defaultProfiles = [
        { profile: 'Admin' },
        { profile: 'User' },
    ];
    for (const profile of defaultProfiles) {
        await Profile.findOrCreate({ where: profile }); // Evita duplicação
    }
})


User.belongsTo(Profile, {
    foreignKey: 'profileId',
})
Profile.hasMany(User, {
    foreignKey: 'profileId',
})

User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foeignKey: 'userId' });

module.exports = User;