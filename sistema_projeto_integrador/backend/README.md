# Instale as dependências na pasta do backend:
yarn install
yarn add express
yarn add cors
yarn add express-session
yarn add passport
yarn add passport-local
yarn add bcrypt
yarn add jsonwebtoken
yarn add passport-jwt
yarn add dotenv

# Configure o banco de dados:
Instale o PostgreSQL em sua máquina.
Crie um banco de dados (ex:planomei) e crie as tabelas do criacao-de-tabelas

# Configure as variáveis de ambiente:
yarn add dotenv
Crie um arquivo .env
Edite o arquivo .env com as configurações do seu banco de dados, ex:
DB_USER=padrao
DB_PASSWORD=conexaosistema123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=planomei

# Inicie o servidor, se não der nenhum erro deu certo:
node server.js

# Pra inserir 2 tipos de usuários já no banco:
node scripts/insertUsers.js

### Se der erro no node server.js dizendo "Erro ao conectar ao banco de dados: nenhuma entrada em pg_hba.conf para o hospedeiro "<seu ip v4>", usuário "<usuario que tu colocou no .env>", banco de dados "<nome do banco do .env>", sem encriptação":
 vai na pasta do postgres->data e abre o arquivo pg_hba.conf com bloco de notas ou editor de texto, coloca isso no final do arquivo (sem os '>' e '<'): 
host    all             all             <seu ip v4>/32          md5
Salva e reinicia o serviço do postgres e dá o comando de rodar o servidor de novo

### Erros de inserção, relacionados a permissão do usuário:
o usuário precisa ter permissão de update, insert e delete pra todas as tabelas e também permissões de atulização de serial key, comandos:
GRANT INSERT, UPDATE, DELETE, SELECT ON ALL TABLES IN SCHEMA public TO nome_do_usuario;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO nome_do_usuario;



