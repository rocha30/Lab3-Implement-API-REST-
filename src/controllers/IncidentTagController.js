const { PrismaClient } = require('../../generated/prisma')
const { IncidentTagService } = require('../services/IncidentTagService')

const prisma = new PrismaClient()

class IncidentTagController {
    constructor() {
        this.incidentTagService = new IncidentTagService(prisma)
    }

    // GET - Obtener todas las relaciones
    getAllRelations = async (req, res) => {
        try {
            const relations = await this.incidentTagService.getAllRelations()
            res.json({ success: true, data: relations })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // GET - Obtener tags de un incidente
    getTagsByIncident = async (req, res) => {
        try {
            const incidentId = parseInt(req.params.incidentId)

            if (isNaN(incidentId) || incidentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'incident_id debe ser un número entero positivo'
                })
            }

            const tags = await this.incidentTagService.getTagsByIncident(incidentId)
            res.json({ success: true, data: tags })
        } catch (error) {
            res.status(404).json({ success: false, error: error.message })
        }
    }

    // GET - Obtener incidentes de un tag
    getIncidentsByTag = async (req, res) => {
        try {
            const tagId = parseInt(req.params.tagId)

            if (isNaN(tagId) || tagId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'tag_id debe ser un número entero positivo'
                })
            }

            const incidents = await this.incidentTagService.getIncidentsByTag(tagId)
            res.json({ success: true, data: incidents })
        } catch (error) {
            res.status(404).json({ success: false, error: error.message })
        }
    }

    // POST - Asociar tag a incidente
    addTagToIncident = async (req, res) => {
        try {
            const incidentId = parseInt(req.params.incidentId)
            const tagId = parseInt(req.params.tagId)

            if (isNaN(incidentId) || incidentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'incident_id debe ser un número entero positivo'
                })
            }

            if (isNaN(tagId) || tagId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'tag_id debe ser un número entero positivo'
                })
            }

            const relation = await this.incidentTagService.addTagToIncident(incidentId, tagId)
            res.status(201).json({ success: true, data: relation })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    // POST - Asociar múltiples tags a incidente
    addMultipleTagsToIncident = async (req, res) => {
        try {
            const incidentId = parseInt(req.params.incidentId)
            const { tagIds } = req.body

            if (isNaN(incidentId) || incidentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'incident_id debe ser un número entero positivo'
                })
            }

            if (!Array.isArray(tagIds) || tagIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'tagIds debe ser un array no vacío'
                })
            }

            const relations = await this.incidentTagService.addMultipleTagsToIncident(incidentId, tagIds)
            res.status(201).json({ success: true, data: relations })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    // DELETE - Remover tag de incidente
    removeTagFromIncident = async (req, res) => {
        try {
            const incidentId = parseInt(req.params.incidentId)
            const tagId = parseInt(req.params.tagId)

            if (isNaN(incidentId) || incidentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'incident_id debe ser un número entero positivo'
                })
            }

            if (isNaN(tagId) || tagId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'tag_id debe ser un número entero positivo'
                })
            }

            await this.incidentTagService.removeTagFromIncident(incidentId, tagId)
            res.json({ success: true, message: 'Relation removed successfully' })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    // PUT - Reemplazar todos los tags de un incidente
    replaceIncidentTags = async (req, res) => {
        try {
            const incidentId = parseInt(req.params.incidentId)
            const { tagIds } = req.body

            if (isNaN(incidentId) || incidentId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'incident_id debe ser un número entero positivo'
                })
            }

            if (!Array.isArray(tagIds)) {
                return res.status(400).json({
                    success: false,
                    error: 'tagIds debe ser un array'
                })
            }

            const incident = await this.incidentTagService.replaceIncidentTags(incidentId, tagIds)
            res.json({ success: true, data: incident })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    // GET - Estadísticas de relaciones
    getStatistics = async (req, res) => {
        try {
            const stats = await this.incidentTagService.getRelationStatistics()
            res.json({ success: true, data: stats })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    // GET - Obtener datos disponibles para crear relaciones
    getAvailableData = async (req, res) => {
        try {
            const [incidents, tags] = await Promise.all([
                this.incidentTagService.prisma.incidentes.findMany({
                    select: { id: true, description: true, status: true },
                    orderBy: { id: 'asc' }
                }),
                this.incidentTagService.prisma.tag.findMany({
                    select: { id: true, name: true, description: true },
                    orderBy: { id: 'asc' }
                })
            ])

            res.json({
                success: true,
                data: {
                    incidents,
                    tags,
                    usage: {
                        "Para asociar tag 3 al incidente 1": "POST /api/relations/incident/1/tag/3",
                        "Para asociar múltiples tags": "POST /api/relations/incident/1/tags con body {\"tagIds\": [1,2,3]}"
                    }
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}

module.exports = { IncidentTagController }
