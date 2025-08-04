module.exports = app => {
    const estudiante = require("../controllers/estudiante.controller");
    const prestamo = require("../controllers/prestamo.controller"); // Importamos el controlador de préstamos
    var router = require("express").Router();
    
    // CRUD de estudiantes
    router.post("/create", estudiante.create);
    router.get("/findAll/", estudiante.findAll);
    router.get("/get/:id", estudiante.findOne);
    router.delete("/delete/:id", estudiante.delete);
    router.put("/update/:id", estudiante.update);
    
    router.get("/:id/prestamos", prestamo.obtenerPrestamosEstudiante);
    
    app.use("/api/estudiante", router); 
};