const Sequelize = require('sequelize');
const connection = new Sequelize('blog', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});
    
//Recria todas as tabelas relacionadas ao modelo

//   connection.sync({ force: true }) 
//       .then(() => {
//           console.log("Tabelas recriadas com sucesso!");
//       })
//       .catch(err => {
//           console.error("Erro ao recriar tabelas:", err);
//       });

module.exports = connection