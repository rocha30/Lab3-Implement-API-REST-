const express = require('express')
const { TagController } = require('../../controllers/TagController')

const router = express.Router()
const tagController = new TagController()

// Rutas específicas PRIMERO
router.get('/search', tagController.searchTags)

// CRUD básico
router.get('/', tagController.getAllTags)
router.post('/', tagController.createTag)
router.get('/:id', tagController.getTagById)
router.put('/:id', tagController.updateTag)
router.delete('/:id', tagController.deleteTag)

module.exports = router
