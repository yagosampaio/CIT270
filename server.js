const express = require ("express");

const app = express();

const port = 3000;

const bodyParser = require ("body-parser");

const {v4: uuidv4} = require('uuid'); //universely unique identifier

app.use(bodyParser.json()); // This looks for incoming data

app.get("/",(req, res) => {
    res.send("Hello Yago");
});

app.post('/login', (req,res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; //Access the password data in the body
    console.log('Login username: ' +loginUser);
    if (loginUser=="yago@gmail.com" && loginPassword=="Password123!"){
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);//unauthorized
        res.send('Incorrect Password for '+loginUser);
    }   
});


app.listen(port, () => {
    console.log("listening");
});
