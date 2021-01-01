const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = 'dinotesDB';

let db;

exports.connect = (callback) => {
  client.connect((err, client) => {
    db = client.db(dbName);
    return callback(err, client);
  });
};

exports.getDb = () => {
  return db;
};
