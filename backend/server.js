const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { getDb } = require("./database");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

// We do not wait for the DB to connect here, Vercel functions might invoke the routes directly
// getDb() will be called at the route level to ensure connection is maintained per request
getDb()
    .then(() => console.log("✅ MongoDB connected natively"))
    .catch(err => console.error("❌ Database connection error:", err));

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`⚡ Express Server running locally on port ${PORT}`);
    });
}
