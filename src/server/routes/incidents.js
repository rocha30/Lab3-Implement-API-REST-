const express = require('express')
const { IncidentController } = require('../../controllers/IncidentController')

const router = express.Router()
const incidentController = new IncidentController()

// ⚠️ ORDEN CRÍTICO: Rutas específicas ANTES que rutas con parámetros
router.get('/status/:status', incidentController.getIncidentsByStatus)

// CRUD endpoints
router.get('/', incidentController.getAllIncidents)
router.post('/', incidentController.createIncident)
router.get('/:id', incidentController.getIncidentById)
router.put('/:id', incidentController.updateIncident)
router.delete('/:id', incidentController.deleteIncident)

module.exports = router