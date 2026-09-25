import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { intializeDatabase } from "./config/db.js";
dotenv.config();
const app = express()
// middleware to accept req.body;
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT

import AuthRouter from "./routes/user.route.js";
import TransactionRouter from "./routes/transaction.route.js";

app.use('/api/auth', AuthRouter);         // api for authentication
app.use('/api/transaction', TransactionRouter);        // api for transactions

app.listen(PORT, () => {
    // initialize db
    intializeDatabase();
    console.log(`Server is listening to port ${PORT}`)
})
