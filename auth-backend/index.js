import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import connectToMongoDB from "./db/connectToMongoDB.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.route.js"
import groupRouter from "./routes/groups.route.js"

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    credentials: true,
    origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`, `${process.env.BE_HOST}:8080`, `${process.env.BE_HOST}:8082` ]
}));
   
app.use(cookieParser());

app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', usersRouter);

app.use('/groups', groupRouter)

app.get('/', (req, res) => {
    res.send("Welcome to HHLD Chat App!");
});

app.listen(PORT, (req, res) => {
    connectToMongoDB();
    console.log(`Server auth is running at ${PORT}`);
})