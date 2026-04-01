const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Set custom DNS servers (same as app.js)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

(async () => {
  try {
    console.log("Testing connection to:", process.env.MONGODB_URI);
    console.log("DNS Servers:", dns.getServers());
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
})();