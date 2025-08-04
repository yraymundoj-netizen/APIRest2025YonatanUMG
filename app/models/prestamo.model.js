module.exports = (sequelize, Sequelize) => {
    const Prestamo = sequelize.define ("prestamo", {
        id_libro: {
            type: Sequelize.INTEGER,
        },
        id_estudiante: {
            type: Sequelize.INTEGER,
        },
        fecha_prestamo: {
            type: Sequelize.DATEONLY
        },
        fecha_devolucion: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
    },
        {
            underscored: true,
        }
);
    return Prestamo;
};