const { PrismaClient } = require('../../generated/prisma')
const { TagService } = require('../services/TagService')

const prisma = new PrismaClient()

class TagController {
    constructor() {
        this.tagService = new TagService(prisma)
    }

    getAllTags = async (req, res) => {
        try {
            const tags = await this.tagService.getAllTags()
            res.json({ success: true, data: tags })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }

    getTagById = async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ID debe ser un número entero positivo'
                })
            }

            const tag = await this.tagService.getTagById(id)
            res.json({ success: true, data: tag })
        } catch (error) {
            res.status(404).json({ success: false, error: error.message })
        }
    }

    createTag = async (req, res) => {
        try {
            const tag = await this.tagService.createTag(req.body)
            res.status(201).json({ success: true, data: tag })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    updateTag = async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ID debe ser un número entero positivo'
                })
            }

            const tag = await this.tagService.updateTag(id, req.body)
            res.json({ success: true, data: tag })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    deleteTag = async (req, res) => {
        try {
            const id = parseInt(req.params.id)

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'ID debe ser un número entero positivo'
                })
            }

            await this.tagService.deleteTag(id)
            res.json({ success: true, message: 'Tag deleted successfully' })
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    }

    searchTags = async (req, res) => {
        try {
            const { query } = req.query
            if (!query) {
                return res.status(400).json({
                    success: false,
                    error: 'Parámetro query es requerido'
                })
            }

            const tags = await this.tagService.searchTags(query)
            res.json({ success: true, data: tags })
        } catch (error) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
}

module.exports = { TagController }