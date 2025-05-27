const express = require('express')
const { IncidentTagController } = require('../../controllers/IncidentTagController')

const router = express.Router()
const incidentTagController = new IncidentTagController()
// Agregar esta línea al principio de las rutas
router.get('/available', incidentTagController.getAvailableData)

// Rutas específicas PRIMERO
router.get('/stats', incidentTagController.getStatistics)

// Relaciones por incidente
router.get('/incident/:incidentId', incidentTagController.getTagsByIncident)
router.post('/incident/:incidentId/tags', incidentTagController.addMultipleTagsToIncident)
router.put('/incident/:incidentId/tags', incidentTagController.replaceIncidentTags)

// Relaciones por tag
router.get('/tag/:tagId', incidentTagController.getIncidentsByTag)

// Relaciones individuales
router.post('/incident/:incidentId/tag/:tagId', incidentTagController.addTagToIncident)
router.delete('/incident/:incidentId/tag/:tagId', incidentTagController.removeTagFromIncident)

// Todas las relaciones
router.get('/', incidentTagController.getAllRelations)

module.exports = router