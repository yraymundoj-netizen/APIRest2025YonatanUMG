const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

db.estudiante = require("./estudiante.model")(sequelize, Sequelize);
db.libro = require("./libro.model")(sequelize, Sequelize);
db.prestamo = require("./prestamo.model")(sequelize, Sequelize);

//Relaciones
db.estudiante.hasMany(db.prestamo, {
    foreignKey: "id_estudiante",
    as: "prestamos" 
});

db.prestamo.belongsTo(db.estudiante, {
    foreignKey: "id_estudiante",
    as: "estudiante" 
});

db.libro.hasMany(db.prestamo, {
    foreignKey: "id_libro",
    as: "prestamos" 
});

db.prestamo.belongsTo(db.libro, {
    foreignKey: "id_libro",
    as: "libro" 
});

module.exports = db;