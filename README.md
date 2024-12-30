# Blog com Painel Administrativo

Este é um projeto de um blog com painel administrativo, desenvolvido em Node.js utilizando as seguintes tecnologias:

- **Node.js**
- **Express**
- **Sequelize**
- **EJS**
- **Bootstrap**
- **TinyMCE**
- **Slugify**
- **BcryptJS**

A aplicação permite criar, editar e deletar posts, além de gerenciar usuários e categorias pelo painel administrativo.

## Pré-requisitos

Certifique-se de ter instalado em sua máquina as seguintes ferramentas:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório do projeto:
   ```bash
   git clone https://github.com/usuario/blog-com-painel-administrativo.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd blog-com-painel-administrativo
   ```

3. Instale as dependências necessárias:
   ```bash
   npm install
   ```

## Executando o projeto
1. Crie um banco de dados mysql e adicione as informações do banco de dados no arquivo database.js da pasta database 


2. Para iniciar o servidor com o `nodemon` (útil durante o desenvolvimento, pois reinicia o servidor automaticamente em caso de alterações nos arquivos):
   ```bash
   nodemon index.js
   ```

3. Acesse a aplicação no navegador:
   - Por padrão, o servidor estará rodando no endereço: [http://localhost:3000](http://localhost:3000).
