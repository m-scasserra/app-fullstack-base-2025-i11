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
    /*
    id: number;
    name: string;
    description: string;
    state: boolean;
    location: number;
    type: number;
    */
    var device = req.body;
    if (!device.name || typeof device.name !== 'string' ||
        !device.description || typeof device.description !== 'string' ||
        typeof device.location !== 'number' ||
        typeof device.type !== 'number') {
        return res.status(400).send({ error: "Datos del dispositivo inválidos" });
    }
    utils.query("INSERT INTO Devices (name, description, state, location, type) VALUES (?, ?, ?, ?, ?)", [device.name, device.description, 0, device.location, device.type], function (error, respuesta, campos) {
        if (error == null) {
            console.log(respuesta);
            res.status(201).send({ message: "Dispositivo creado correctamente" });
        } else {
            console.log(error);
            res.status(409).send({ error: "Fallo la inserción" });
        }
    })
});

app.delete('/devices/', function (req, res, next) {
    var device = req.body;
    utils.query("DELETE FROM Devices WHERE id = ?", [device.id], function (error, respuesta, campos) {
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

    const fields = [];
    const values = [];

    // Add fields to update if they exist in the body
    if (device.name !== undefined) {
        fields.push("name = ?");
        values.push(device.name);
    }
    if (device.description !== undefined) {
        fields.push("description = ?");
        values.push(device.description);
    }
    if (device.location !== undefined) {
        fields.push("location = ?");
        values.push(device.location);
    }
    if (device.type !== undefined) {
        fields.push("type = ?");
        values.push(device.type);
    }
    if (device.state !== undefined) {
        fields.push("state = ?");
        values.push(device.state);
    }

    if (fields.length === 0) {
        return res.status(400).send({ error: "No fields to update provided" });
    }

    const query = `UPDATE Devices SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    utils.query(query, values, function (error, respuesta, campos) {
        if (error == null) {
            res.status(200).send({ message: "Dispositivo actualizado correctamente" });
        } else {
            console.error(error);
            res.status(409).send({ error: "Fallo la actualización" });
        }
    });
});


app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
