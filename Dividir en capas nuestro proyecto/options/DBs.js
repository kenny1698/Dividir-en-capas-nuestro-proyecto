export default {
   optionsMySQL : {
    client: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mariadb'
      }
  }, optionsSQLite : {
      client: 'sqlite3',
      connection: {
        filename: "./DB/ecommerce.sqlite"
      },
      useNullAsDefault: true
    }
}