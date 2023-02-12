const express = require ("express");

const app = express();

const port = 3000;

const bodyParser = require ("body-parser");

const {v4: uuidv4} = require('uuid'); //universely unique identifier

const Redis = require('redis'); // The library

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"}); //This points to redis

app.use(bodyParser.json()); // This looks for incoming data

app.use(express.static('public'));
const cookieParser = require("cookie-parser");
app.use(cookieParser);

app.get("/",(req, res) => {
    res.send("Hello Yago");
});

app.get("/validate", async (req,res)=>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet("TokenMap",loginToken);
    res.send(loginUser);
});

app.post('/login', async (req,res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; //Access the password data in the body
    console.log('Login username: ' +loginUser);
    const correctPassword = await redisClient.hGet('UserMap',loginUser); //gets correct password from redis
    if (correctPassword==loginPassword){
        const loginToken = uuidv4();
        await redisClient.hSet("TokenMap",loginToken,loginUser);
        res.cookie("stedicookie",loginToken);
        res.send(loginToken);
    } else {
        res.status(401);//unauthorized
        res.send('Incorrect Password for '+loginUser);
    }   
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});
