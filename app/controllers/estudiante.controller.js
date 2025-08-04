const db = require("../models");
const Estudiante = db.estudiante;
const op = db.Sequelize.Op;

exports.create  = (req, res) => {
    if (!req.body.nombre){
        res.status(400).send({
            message: "Parametro no Puede estar Vacio"
        });
        return;
    }

    const estudiante = {
        nombre: req.body.nombre,
        carnet: req.body.carnet,
        correo: req.body.correo
    }

    Estudiante.create(estudiante)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Client."
            });
        });
};
exports.update = (req, res) => {
    const id = req.params.id;
    Estudiante.update(req.body, {
        where: {id : id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Estudiante Acualizado"
                });
            } else {
                res.send({
                    message: "Error"
                });
            }
        })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    Estudiante.destroy({
        where: {id : id}
    })
        .then(num => {
            if (num == 1){
                res.send({
                    message: "Estudiante Eliminado"
            });
            } else {
                res.send({
                    message: "Error"
            });
            
        }
    })
}
exports.findOne = (req, res) => {
    const id = req.params.id;
    Estudiante.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error en id=" + id
            });
        });
};
exports.findAll = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    Estudiante.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving clients."
            });
        });
};