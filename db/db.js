const pg = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  database: "rh_test",
  password: "anne1011",
  port: 5432,
  queueLimit : 0,
  connectionLimit: 0,
  multipleStatements : true
};

/*pool.on('connect', () => {
  console.log('connected to the database');
});

const sql_create = `CREATE TABLE IF NOT EXISTS Livres (
  Livre_ID SERIAL PRIMARY KEY,
  Titre VARCHAR(100) NOT NULL,
  Auteur VARCHAR(100) NOT NULL,
  Commentaires TEXT
);`;

pool.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
});

var pool = new pg.Pool(config);
*/

var pool = new pg.Pool(config);

pool.connect(function(err) {
  if (err)
    throw err;
});

console.log(pool);
module_exports = pool;
