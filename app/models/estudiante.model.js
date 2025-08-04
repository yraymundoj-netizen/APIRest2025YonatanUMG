const { FOREIGNKEYS } = require("sequelize/lib/query-types");
const { underscoredIf } = require("sequelize/lib/utils");

module.exports = (sequelize, Sequelize) => {
    const Estudiante = sequelize.define("estudiante", {
        nombre: {
            type: Sequelize.STRING
        },
        carnet: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        }
    },
        {
            underscored: true,
        }    
);
    return Estudiante;
};