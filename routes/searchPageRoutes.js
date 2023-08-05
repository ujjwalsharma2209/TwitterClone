const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/s", function (req, res) {
  const searchString = req.query.search;
  const query = `SELECT * FROM users WHERE username COLLATE utf8mb4_general_ci LIKE '%${searchString}%' OR name COLLATE utf8mb4_general_ci LIKE '%${searchString}%'`;
  db.query(query, function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.status(200).send(results);
    }
  });
});

router.post("/check-follow", function (req, res) {
  const { follower_id, following_id } = req.body;
  const query = `SELECT * FROM relationships WHERE follower_id = ${follower_id} AND following_id = ${following_id}`;
  db.query(query, function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.status(200).send(results.length > 0 ? true : false);
    }
  });
});

router.post("/follow", function (req, res) {
  const { follower_id, following_id } = req.body;
  const query = `SELECT * FROM relationships WHERE follower_id = ${follower_id} AND following_id = ${following_id}`;
  db.query(query, function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      let finalQuery;
      if (results.length > 0) {
        finalQuery = `DELETE FROM relationships WHERE follower_id = ${follower_id} AND following_id = ${following_id}`;
      } else {
        finalQuery = `INSERT INTO relationships (follower_id, following_id) VALUES (${follower_id}, ${following_id})`;
      }
      db.query(finalQuery, function (err, results) {
        if (err) {
          console.error(err);
          res.status(500).send("Server error");
        } else {
          res.status(200).send(results);
        }
      });
    }
  });
});

module.exports = router;
