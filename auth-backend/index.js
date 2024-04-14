import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import connectToMongoDB from "./db/connectToMongoDB.js"

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send("Welcome to HHLD Chat App!");
});

app.listen(PORT, (req, res) => {
    connectToMongoDB();
    console.log(`Server is running at ${PORT}`);
})