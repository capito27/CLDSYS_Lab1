const MongoClient = require('mongodb').MongoClient;

class Connection {
    static connectToMongo() {
        if (this.db) return Promise.resolve(this.db);
        return MongoClient.connect(this.url, this.options)
            .then(client => this.db = client.db(this.dbname));
    }
}

Connection.db = null;
Connection.url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
Connection.dbname = 'mailbox';
Connection.options = {
    bufferMaxEntries: 0,
    reconnectTries: 5000,
    reconnectInterval: 500,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
};

module.exports = {Connection};