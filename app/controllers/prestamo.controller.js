const db = require("../models");
const Prestamo = db.prestamo;
const Libro = db.libro;
const Estudiante = db.estudiante;

exports.asignarLibro = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id_libro, id_estudiante } = req.body;

        if (!id_libro || !id_estudiante) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Se requieren id_libro e id_estudiante"
            });
        }

        const libro = await Libro.findByPk(id_libro, { transaction });
        if (!libro) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Libro no encontrado"
            });
        }

        if (!libro.disponible) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "El libro no está disponible para préstamo"
            });
        }

        const estudiante = await Estudiante.findByPk(id_estudiante, { transaction });
        if (!estudiante) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        const prestamo = await Prestamo.create({
            id_libro,
            id_estudiante,
            fecha_prestamo: new Date()
        }, { transaction });

        await libro.update({ disponible: false }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Libro asignado exitosamente",
            data: {
                prestamo_id: prestamo.id,
                libro_id: libro.id,
                estudiante_id: estudiante.id,
                fecha_prestamo: prestamo.fecha_prestamo
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error al asignar libro:", error);
        return res.status(500).json({
            success: false,
            message: "Error al asignar el libro",
            error: error.message
        });
    }
};

exports.obtenerPrestamosEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await db.estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        const prestamos = await db.prestamo.findAll({
            where: { id_estudiante: id },
            include: [{
                model: db.libro,
                as: 'libro',
                attributes: ['id', 'titulo', 'autor', 'genero']
            }],
            order: [['fecha_prestamo', 'DESC']],
            raw: false
        });

        const response = {
            success: true,
            estudiante: {
                id: estudiante.id,
                nombre: estudiante.nombre,
                carnet: estudiante.carnet
            },
            count: prestamos.length,
            prestamos: prestamos.map(p => ({
                id: p.id,
                fecha_prestamo: p.fecha_prestamo,
                fecha_devolucion: p.fecha_devolucion,
                libro: {
                    id: p.libro.id,
                    titulo: p.libro.titulo,
                    autor: p.libro.autor,
                    genero: p.libro.genero
                }
            }))
        };

        res.json(response);

    } catch (error) {
        console.error("Error detallado:", {
            message: error.message,
            stack: error.stack,
            sql: error.sql
        });
        
        res.status(500).json({
            success: false,
            message: "Error al obtener los préstamos del estudiante",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

exports.marcarDevuelto = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;

        const prestamo = await Prestamo.findByPk(id, { transaction });
        if (!prestamo) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Préstamo no encontrado"
            });
        }

        if (prestamo.fecha_devolucion) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Este libro ya fue devuelto"
            });
        }

        await prestamo.update({
            fecha_devolucion: new Date()
        }, { transaction });

        const libro = await Libro.findByPk(prestamo.id_libro, { transaction });
        await libro.update({ disponible: true }, { transaction });

        await transaction.commit();

        return res.json({
            success: true,
            message: "Libro marcado como devuelto",
            data: {
                prestamo_id: prestamo.id,
                libro_id: libro.id,
                fecha_prestamo: prestamo.fecha_prestamo,
                fecha_devolucion: prestamo.fecha_devolucion
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error al marcar libro como devuelto:", error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar la devolución",
            error: error.message
        });
    }
};