const express = require('express')
const incidentRoutes = require('./incidents')
const tagRoutes = require('./tags')
const incidentTagRoutes = require('./incidentTags')

const router = express.Router()

console.log('🔧 Cargando rutas...')
console.log('✅ Incident routes cargadas')
console.log('✅ Tag routes cargadas')
console.log('✅ IncidentTag routes cargadas')

// Rutas principales
router.use('/incidents', incidentRoutes)
router.use('/tags', tagRoutes)
router.use('/relations', incidentTagRoutes)

// Ruta de salud del API
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoints: {
            incidents: '/api/incidents',
            tags: '/api/tags',
            relations: '/api/relations'
        }
    })
})

module.exports = router