// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  staging: {
    client: 'postgresql',
    connection: {
      database: 'HappyOS',
      user:     'postgres',
      password: 'root'
      
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      //tableName: 'knex_migrations'
      //tableName: 'users'
    }
  },

 
};
