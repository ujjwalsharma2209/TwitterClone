const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");
const saltRounds = 10;

router.post("/register", (req, res) => {
  const { name, email, username, mobile, password, dob, gender, city_id } =
    req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const query = "INSERT INTO users SET ?";
    const user = {
      name,
      email,
      username,
      mobile,
      dob,
      gender,
      city_id,
      password: hash,
    };
    db.query(query, user, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Server error");
      } else {
        res.status(200).send("User registered successfully");
      }
    });
  });
});

router.post("/login", (req, res) => {
  const { emailOrUsername, password } = req.body;
  const query = "SELECT * FROM users WHERE (email = ? OR username = ?)";
  db.query(query, [emailOrUsername, emailOrUsername], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Server error");
    } else {
      const user = result[0];
      if (user) {
        bcrypt.compare(password, user.password, (error, result) => {
          if (error) {
            res.status(500).send(error);
          } else if (result === true) {
            res.status(200).send({
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email
            });
          } else {
            res.status(401).send("Invalid email/username or password");
          }
        });
      } else {
        res.status(401).send("Invalid email/username or password");
      }
    }
  });
});

module.exports = router;
