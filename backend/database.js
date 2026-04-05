const { MongoClient } = require("mongodb");

let dbInstance = null;

async function getDb() {
    if (dbInstance) {
        return dbInstance;
    }

    // We URL-encode the '@' in your password to '%40' so MongoDB parses it correctly!
    const uri = process.env.MONGO_URI || "mongodb+srv://Phishing_Web:Pavan%401436@cluster0.2d17lem.mongodb.net/?appName=Cluster0";
    
    if (!uri) {
        console.error("⚠️ MONGO_URI is missing from environment variables!");
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    const client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db("phishing_db");

    // Schema Initialization (Indexes)
    await dbInstance.collection("admins").createIndex({ email: 1 }, { unique: true });
    await dbInstance.collection("login_attempts").createIndex({ createdAt: -1 });
    await dbInstance.collection("login_attempts").createIndex({ status: 1 });

    return dbInstance;
}

module.exports = { getDb };
