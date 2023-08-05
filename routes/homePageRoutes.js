const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/tweet", (req, res) => {
  const { user_id, tweet_content } = req.body;
  const ip_address = req.ip;
  const query = `INSERT INTO tweets (user_id, tweet_content, ip_address) VALUES (${user_id}, "${tweet_content}", '${ip_address}')`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      const hashtagRegex = /#[A-Za-z0-9_]+/g;
      const hashtags = tweet_content.match(hashtagRegex);
      if (hashtags) {
        hashtags.forEach((tag) => {
          db.query(
            `INSERT INTO hashtags (content, user_id) VALUES ("${tag}", ${user_id})`
          );
        });
      }
      res.status(200).send(result);
    }
  });
});

router.post("/like-tweet", (req, res) => {
  const { user_id, tweet_id } = req.body;
  const checkQuery = `SELECT * FROM likes WHERE user_id = ${user_id} AND tweet_id = ${tweet_id}`;
  db.query(checkQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else if (result.length > 0) {
      const unlikeQuery = `DELETE FROM likes WHERE user_id = ${user_id} AND tweet_id = ${tweet_id}`;
      db.query(unlikeQuery, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Server error");
        } else {
          res.status(200).send(result);
        }
      });
    } else {
      const likeQuery = `INSERT INTO likes (user_id, tweet_id) VALUES (${user_id}, ${tweet_id})`;
      db.query(likeQuery, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Server error");
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

router.post("/comment-tweet", (req, res) => {
  const { user_id, tweet_id, content } = req.body;
  const query = `INSERT INTO comments (user_id, tweet_id, content) VALUES (${user_id}, "${tweet_id}", '${content}')`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.status(200).send(result);
    }
  });
});

router.get("/top-tags", (req, res) => {
  const query = `SELECT content, COUNT(*) as count FROM hashtags GROUP BY content ORDER BY count DESC LIMIT 5`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.status(200).send(result);
    }
  });
});

router.get("/get-followings/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users 
  INNER JOIN (SELECT following_id FROM relationships WHERE follower_id = ${id}) AS r 
  ON users.id = r.following_id;`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      const data = result.map((user) => {
        return { name: user.name, username: user.username };
      });
      res.status(200).send(data);
    }
  });
});

router.get("/get-followings-tweets/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users INNER JOIN (SELECT * FROM tweets WHERE user_id IN (SELECT following_id FROM relationships WHERE follower_id = ${id})) AS r ON users.id = r.user_id ORDER BY r.datetime DESC`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      const data = result.map((tweet) => {
        return {
          id: tweet.id,
          tweet_content: tweet.tweet_content,
          user_id: tweet.user_id,
          username: tweet.username,
          name: tweet.name,
        };
      });
      res.status(200).send(data);
    }
  });
});

router.get("/get-tweet-likes/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT count(*) as 'likes' FROM likes WHERE tweet_id = ${id}`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.status(200).send(result);
    }
  });
});

router.get("/get-tweet-comments/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * from users INNER JOIN (SELECT * FROM comments WHERE tweet_id = ${id}) as r ON users.id = r.user_id ORDER BY r.datetime DESC`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      const data = result.map((comment) => {
        return {
          name: comment.name,
          username: comment.username,
          tweetId: comment.tweet_id,
          content: comment.content,
        };
      });
      res.status(200).send(data);
    }
  });
});

module.exports = router;
