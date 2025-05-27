const express = require('express')
const cors = require('cors')
const routes = require('./routes')

// 🔧 Solucionar problema de BigInt serialización
BigInt.prototype.toJSON = function () {
    return Number(this)
}

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Debug middleware - para ver todas las peticiones
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`)
    next()
})

// Routes
app.use('/api', routes)

// 404 handler - ACTUALIZADO con todas las rutas
app.use('*', (req, res) => {
    console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`)
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        availableRoutes: [
            'GET /api/health',
            'GET /api/incidents',
            'GET /api/incidents/:id',
            'POST /api/incidents',
            'PUT /api/incidents/:id',
            'DELETE /api/incidents/:id',
            'GET /api/incidents/status/:status',
            'GET /api/tags',
            'GET /api/tags/:id',
            'POST /api/tags',
            'PUT /api/tags/:id',
            'DELETE /api/tags/:id',
            'GET /api/tags/search'
        ]
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    console.log(`📋 Rutas disponibles:`)
    console.log(`   GET  http://localhost:${PORT}/api/health`)
    console.log(`   GET  http://localhost:${PORT}/api/incidents`)
    console.log(`   GET  http://localhost:${PORT}/api/tags`)
    console.log(`   POST http://localhost:${PORT}/api/tags`)
})

module.exports = app