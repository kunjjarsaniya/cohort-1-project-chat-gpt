require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);

// Await DB connection before starting server
connectDb()
    .then(() => {
        initSocketServer(httpServer);
        httpServer.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });