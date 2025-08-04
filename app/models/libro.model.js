module.exports = (sequelize, Sequelize) => {
    const Libro = sequelize.define ("libro", {
        titulo: {
            type: Sequelize.STRING
        },
        autor: {
            type: Sequelize.STRING
        },
        anio_publicacion: {
            type: Sequelize.INTEGER
        },
        genero: {
            type: Sequelize.STRING
        },
        disponible: {
            type: Sequelize.BOOLEAN
        },
    },
        {
            underscored: true,
        }
    );
    
    return Libro;
};