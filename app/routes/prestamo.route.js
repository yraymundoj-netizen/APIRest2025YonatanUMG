module.exports = app => {
    const prestamo = require("../controllers/prestamo.controller");
    var router = require("express").Router();
    router.post("/", prestamo.asignarLibro);
    
    router.put("/:id", prestamo.marcarDevuelto);
    
    app.use("/api/prestamo", router);
};