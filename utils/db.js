// utils/db.js
const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'files_manager';

class DBClient {
  constructor() {
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(dbName);
    }).catch((err) => console.error('DB client error:', err));
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
