const db = require("../models");
const Libro = db.libro;
const op = db.Sequelize.Op;

exports.create  = (req, res) => {
    if (!req.body.titulo){
        res.status(400).send({
            message: "Parametro no Puede estar Vacio"
        });
        return;
    }

    const libro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        anio_publicacion: req.body.anio_publicacion,
        genero: req.body.genero,
        disponible: req.body.disponible
    }

    Libro.create(libro)
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
    Libro.update(req.body, {
        where: {id : id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Libro Acualizado"
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
    Libro.destroy({
        where: {id : id}
    })
        .then(num => {
            if (num == 1){
                res.send({
                    message: "Libro Eliminado"
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
    Libro.findByPk(id)
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
    const titulo = req.query.titulo;
    var condition = titulo ? { titulo: { [Op.iLike]: `%${titulo}%` } } : null;

    Libro.findAll({ where: condition })
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