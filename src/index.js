const { PrismaClient } = require('../generated/prisma')
const { apiClient } = require('./client/apiClient')
const { IncidentStatus } = require('./types')

// Ejemplo de uso de la aplicación
async function main() {
    try {
        console.log('🚀 Iniciando aplicación...')

        // Ejemplo: Obtener todos los incidentes
        console.log('📋 Obteniendo todos los incidentes...')
        const incidents = await apiClient.getAllIncidents()
        console.log(`✅ Se encontraron ${incidents.data.length} incidentes`)

        // Ejemplo: Crear un nuevo incidente
        console.log('➕ Creando nuevo incidente...')
        const newIncident = await apiClient.createIncident({
            reporter: 'ejemplo@empresa.com',
            description: 'Incidente de prueba desde el punto de entrada principal',
            status: IncidentStatus.PENDIENTE,
            tagIds: [1, 2]
        })
        console.log('✅ Nuevo incidente creado con ID:', newIncident.data.id)

        // Ejemplo: Obtener incidentes por status
        console.log('🔍 Obteniendo incidentes pendientes...')
        const pendingIncidents = await apiClient.getIncidentsByStatus(IncidentStatus.PENDIENTE)
        console.log(`⏳ Incidentes pendientes: ${pendingIncidents.data.length}`)

    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tip: Asegúrate de que el servidor esté corriendo con "npm run dev"')
        }
    }
}

// Ejecutar solo si este archivo es llamado directamente
if (require.main === module) {
    main()
}

module.exports = { main }