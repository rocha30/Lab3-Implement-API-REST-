const { PrismaClient } = require('../../generated/prisma')
const { IncidentService } = require('../services/IncidentService')

const prisma = new PrismaClient()

class IncidentController {
    constructor() {
        this.incidentService = new IncidentService(prisma)
    }

    getAllIncidents = async (req, res) => {
        try {
            const incidents = await this.incidentService.getAllIncidentsWithTags()
            res.json({ success: true, data: incidents })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    getIncidentById = async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            // Validar que el ID sea un número válido
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ID debe ser un número entero positivo'
                })
            }

            const incident = await this.incidentService.getIncidentById(id)
            res.json({ success: true, data: incident })
        } catch (error) {
            res.status(404).json({ success: false, error: error.message })
        }
    }

    createIncident = async (req, res) => {
        try {
            const incident = await this.incidentService.createIncident(req.body)
            res.status(201).json({ success: true, data: incident })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    updateIncident = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const incident = await this.incidentService.updateIncident(id, req.body)
            res.json({ success: true, data: incident })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    deleteIncident = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            await this.incidentService.deleteIncident(id)
            res.json({ success: true, message: 'Incident deleted successfully' })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    getIncidentsByStatus = async (req, res) => {
        try {
            const status = req.params.status
            const incidents = await this.incidentService.getIncidentsByStatus(status)
            res.json({ success: true, data: incidents })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }
}

module.exports = { IncidentController }