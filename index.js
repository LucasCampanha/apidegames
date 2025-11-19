const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWTSecret = "asdfh9sdf0wqlrnqwugfaosfkdsafdsnfuguoadsfksadfkjasdfnioadsf";

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


function auth(req, res, next) {
    const authToken = req.headers["authorization"];
    //console.log(authToken);
    if (authToken != undefined) {
        const bearer = authToken.split(" ");
        //console.log(bearer);
        var token = bearer[1];
        console.log(token);

        jwt.verify(token,JWTSecret,(err, data) => {
            if (err) {
                res.status(401);
                res.json({message: "Token inválido"});
            }else{
                //console.log(data);
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }

        })
    }else{
        res.status(401);
        res.json({message:"Token inválido"});
    }
}


var DB = {
    games: [
        {
            id: 23,
            title: "Call of duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: "Sea o thieves",
            year: 2018,
            price: 40
        },
        {
            id: 2,
            title: "Minecraft",
            year: 2012,
            price: 20
        }
    ],
    users : [
        {
            id: 1,
            name: "Luke Camp",
            email: "lucascamp@guiadoprogramador.com",
            password: "nodejs<3"
        },
        {
            id: 20,
            name: "Luana",
            email: "luana@guiadoprogramador.com",
            password: "java123"
        }
    ]
}

app.get("/games", auth, (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id", auth, (req, res) => {

    if (isNaN(req.params.id)) {
        res.sendStatus(400);
        res.send("ISSO NÃO É UM NÚMERO");
        return;
    }
    
    var id = parseInt(req.params.id);

    var game = DB.games.find(G => G.id == id);

    if (game == undefined) {
        res.sendStatus(404);
        return;
    }
    res.statusCode = 200;
    res.json(game);
    return;
});

app.post("/game", auth, (req, res) => {
    
    var {title, year, price } = req.body;

    if (isNaN(price)) {
        res.sendStatus(400);
        return;
        res.send("Price is not a number");
        return;
    }

    if (isNaN(year)) {
        res.sendStatus(400);
        return;
        res.send("Year is not a number");
        return;
    }

    DB.games.push({
        id: 2323,
        title,
        price,
        year,
    });

    res.sendStatus(200);

});

app.put("/game/:id", auth, (req, res) => {

    if (isNaN(req.params.id)) {
        res.sendStatus(400);
        res.send("ISSO NÃO É UM NÚMERO");
        return;
    }
    
    var id = parseInt(req.params.id);

    var game = DB.games.find(G => G.id == id);

    if (game == undefined) {
        res.sendStatus(404);
        return;
    }

    var {title, year, price } = req.body;

    if (title != undefined) {
        game.title = title;
    }

    if (price != undefined && !isNaN(price)){
        game.price = price;
    }

    if (year != undefined && !isNaN(year)) {
        game.year = year;
    }

    res.sendStatus(200);
});

app.delete("/game/:id", auth, (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.sendStatus(400);
        res.send("ISSO NÃO É UM NÚMERO");
        return;
    }
    
    var id = parseInt(id);

    var index = DB.games.findIndex(G => G.id == id);

    if (index == -1) {
        res.sendStatus(404);
        return;
    }
    DB.games.splice(index, 1);

    res.sendStatus(200);
});

app.post("/auth", (req, res) => {
    var {email, password} = req.body;

    if (email == undefined) {
        req.status(400);
        res.json({message: "O e-mail enviado é inválido"});
        return;
    }
    var user = DB.users.find(u => u.email == email);
    if (user == undefined) {
        res.status(404);
        res.json({message: "O e-mail enviado não existe na base de dados!"});
        return;
    }

    if (user.password != password) {
        res.status(401);
        res.json({message: "Credenciais inválidas"});
        return;
    }

    jwt.sign({id: user.id, email: user.email }, JWTSecret, {expiresIn: '48h'}, (err, token) => {
        if (err) {
            res.status(400);
            res.json({message: "Falha interna"});
            return;
        }
        res.status(200);
        res.json({
            message: "Tudo certo!",
            token: token
        });
    });
});


app.listen(45678, () => {
    console.log("API RODANDO!!!");
});