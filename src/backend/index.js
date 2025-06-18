//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function (req, res, next) {
    utils.query("SELECT * FROM Devices", function (error, respuesta, campos) {
        if (error == null) {
            console.log(respuesta);
            res.status(200).send(respuesta);
        } else {
            console.log(error);
            res.status(409).send({ error: "Fallo la consulta" });
        }
    })
});

app.post('/devices/', function (req, res, next) {
    var device = req.body;
    utils.query("INSERT INTO Devices (name, type, status) VALUES (?, ?, ?)", [device.name, device.type, device.status], function (error, respuesta, campos) {
        if (error == null) {
            console.log(respuesta);
            res.status(201).send({ message: "Dispositivo creado correctamente" });
        } else {
            console.log(error);
            res.status(409).send({ error: "Fallo la inserción" });
        }
    })
});

app.delete('/devices/:id', function (req, res, next) {
    var id = req.params.id;
    utils.query("DELETE FROM Devices WHERE id = ?", [id], function (error, respuesta, campos) {
        if (error == null) {
            console.log(respuesta);
            res.status(200).send({ message: "Dispositivo eliminado correctamente" });
        } else {
            console.log(error);
            res.status(409).send({ error: "Fallo la eliminación" });
        }
    })
});

app.put('/devices/:id', function (req, res, next) {
    var id = req.params.id;
    var device = req.body;
    utils.query("UPDATE Devices SET state = ? WHERE id = ?", [device.state, device.id], function (error, respuesta, campos) {
        if (error == null) {
            console.log(respuesta);
            res.status(200).send({ message: "Dispositivo actualizado correctamente" });
        } else {
            console.log(error);
            res.status(409).send({ error: "Fallo la actualización" });
        }
    })
});

app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
