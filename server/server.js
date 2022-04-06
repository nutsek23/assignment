const dbController = require("./db");

const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "userCookies",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 3600 * 24, // store for 24 hours
    },
  })
);

app.use(express.json());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = process.env.PORT || 3001;

const db = dbController.db;

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * from accounts WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, match) => {
          if (match) {
            req.session.user = result;
            res.send(result);
          } else {
            res.send({ message: "Incorrect username or password!" });
          }
        });
      } else {
        res.send({ message: "User does not exist" });
      }
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "SELECT * from accounts WHERE username = ?;",
      username,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        if (result.length > 0) {
          res.send({ message: "Username existed" });
        } else {
          db.query(
            "INSERT INTO accounts (username, email, password) values (?,?,?)",
            [username, email, hash],
            (err, result) => {
              console.log(err);
            }
          );
        }
      }
    );
  });
});
