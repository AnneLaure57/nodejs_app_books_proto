// import le module express
const express = require("express");
//import le module ejs
const ejs = require("ejs");
//Solution 2
const path = require("path");

// to get result of post Request
// useless since Express 4.X
var bodyParser=require('body-parser');

// get db.js
var db = require('./db/db');
const pg = require("pg");

//créer une instance du serveur express
const app = express();

//Solution 1
app.set("view engine","ejs");
// double _
//app.set("views", __dirname + "/views");

//Solution 2
app.set("views", path.join(__dirname,"views"));

// Solution 1 CSS
//Get the file bootstrap.min.css in public
//app.use(express.static(path.join(__dirname,"public")));

// Solution 2 CSS
//Get the file bootstrap.min.css directly in nodejs
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

const config = {
  user: "postgres",
  host: "localhost",
  database: "rh_test",
  password: "anne1011",
  port: 5432
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the database');
});

const sql_create = `CREATE TABLE IF NOT EXISTS Livres2 (
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

//démarre le Serveur
//attend les requêtes arrivant sur le port 3000
//La fonction callback sert à afficher un message
app.listen(3000, () => {
  console.log("Serveur démarré http://localhost:3000");
});

//répondre aux requêtes avec la méthode GET
// req qui contient l'objet Request
// res qui contient un objet Response

//Accueil
app.get("/",(req,res) => {
  //res.send("Bonjour tout le monde ...");
  res.render("index");
});

//About
app.get("/about",(req,res) => {
  //pour répondre à une requête vers "/about" et renvoyer la vue "about.ejs"
  res.render("about");
});

//data
app.get("/data",(req,res) => {
  const test= {
    titre : "Test",
    items: ["un", "deux", "trois"]
  };
  res.render("data", {model: test});
});

//Livres
app.get("/livres", (req,res) => {
  const sql = "SELECT * FROM Livres2 ORDER BY Titre";
  pool.query(sql, [], (err,result) =>{
    if (err) {
      return console.error(err.message);
    }
    // result.rows -> return number of rows for a request
      res.render("livres", { model: result.rows });
      console.log(result.rows);
  });
});

//edit
app.get("/edit/:id", (req, res) => {
  //list params
  const id = req.params.id;
  const sql = "SELECT * FROM Livres2 WHERE Livre_ID = $1";
  console.log(sql);
  console.log(id);
  pool.query(sql, [id], (err,result) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
    console.log("EDIT GET OK !");
    res.render("edit", {model : result.rows[0]});
  });
});

//save
app.post("/edit/:id", (req, res) => {
  //list params
  const id = req.params.id;
  // Problems resolve, express route works but use Titre and not titre
  const book = [req.body.Titre,req.body.Auteur, req.body.Commentaires, id];
  const sql = "UPDATE Livres2 SET Titre = $1, Auteur = $2, Commentaires = $3 WHERE (Livre_ID = $4)";
  console.log(req.body);
  console.log(req.body.Titre);
  //res.send(req.body.Titre);
  //res.json();
  pool.query(sql,book,(err,result) => {
    if (err) {
      console.log(err);
      return console.error(err.message);
    }
    console.log("EDIT POST OK !");
    res.redirect("/livres");
  });
});

//CREATE
app.get("/create", (rep,res) => {
  res.render("create", { model: {} });
});

//CREATE save
app.post("/create", (req, res) => {
  //list params
  // Check this before
  //SELECT SETVAL('Livres_Livre_ID_Seq', MAX(Livre_ID)) FROM Livres;
  const sql = "INSERT into Livres2 (Titre,Auteur,commentaires) VALUES ($1,$2,$3)";
  const book = [req.body.Titre,req.body.Auteur, req.body.Commentaires];
  console.log(req.body);
  console.log(req.body.Titre);
  //res.send(req.body.Titre);
  pool.query(sql,book,(err,result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

//Delete
app.get("/delete/:id", (req, res) => {
  //list params
  const id = req.params.id;
  const sql = "SELECT * FROM Livres2 WHERE Livre_ID = $1";
    console.log(req.params.id);
  pool.query(sql,[id], (err,result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", {model : result.rows[0]});
    console.log(result.rows[0]);
  });
});

app.post("/delete/:id", (req, res) => {
  //list params
  const id = req.params.id;
  const sql = "DELETE FROM Livres2 WHERE Livre_ID = $1";
  pool.query(sql,[id],(err,result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Delete OK !");
    res.redirect("/livres");
  });
});

//Livres
/*app.get("/livres", function (req,res) {
  var sql = "SELECT * FROM Livres ORDER BY Titre";
  db.query(sql, [], function (err,result) {
    if (err) {
      return console.error(err.message);
    }
    // result.rows -> return number of rows for a request
      res.render("livres", { model: result.rows });
      console.log(result.rows);
  });
});*/
