module.exports = app => {
    const libro = require("../controllers/libro.controller");
    var router = require("express").Router();
    router.get("/findAll/", libro.findAll);
    router.post("/create", libro.create);
    router.get("/get/:id", libro.findOne);
    router.delete("/delete/:id", libro.delete);
    router.put("/update/:id", libro.update);
    app.use("/api/libro", router); 
};