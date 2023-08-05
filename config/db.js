const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "twitter_clone"
});

db.connect((err) => {
  if (err) throw err;
  db.query("CREATE DATABASE IF NOT EXISTS twitter_clone");

  db.query(`USE twitter_clone`);

  db.query(`
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  mobile BIGINT UNSIGNED,
  password VARCHAR(100) NOT NULL,
  dob DATE,
  dor TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  gender ENUM('MALE', 'FEMALE', 'OTHER'),
  city_id INT,
  verified ENUM('TRUE', 'FALSE') DEFAULT 'TRUE',
  soft_delete TINYINT(1) DEFAULT 0
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS messages (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  subject VARCHAR(100),
  message TEXT,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS tweets (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tweet_content VARCHAR(300),
  user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(100),
  soft_delete TINYINT(1) DEFAULT 0
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS tweet_categories (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS user_tweet_categories (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES tweet_categories(id) 
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS tweet_pic_video (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tweet_id INT NOT NULL,
  filename VARCHAR(300),
  type VARCHAR(100),
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tweet_id) REFERENCES tweets(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tweet_id INT NOT NULL,
  content VARCHAR(300),
  user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (tweet_id) REFERENCES tweets(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS likes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tweet_id INT NOT NULL,
  user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (tweet_id) REFERENCES tweets(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS hashtags (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(100),
  user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tweet_id INT NOT NULL,
  user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (tweet_id) REFERENCES tweets(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS relationships (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id)
);
`);

  db.query(`
CREATE TABLE IF NOT EXISTS blocked_users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  blocked_user_id INT NOT NULL,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  soft_delete TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (blocked_user_id) REFERENCES users(id)
);
`);

});
module.exports = db;
