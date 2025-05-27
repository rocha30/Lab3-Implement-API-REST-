const { apiClient } = require('../apiClient')
const { IncidentStatus } = require('../../types')

async function ejemploCompleto() {
    try {
        console.log('🧪 Iniciando ejemplos del cliente API...\n')

        // 1. Verificar conexión
        console.log('🔌 Verificando conexión con la API...')
        const health = await apiClient.axios.get('/health')
        console.log('✅ API conectada:', health.data.message)

        // 2. Obtener todos los incidentes
        console.log('\n📋 Obteniendo todos los incidentes...')
        const allIncidents = await apiClient.getAllIncidents()
        console.log(`📊 Total de incidentes: ${allIncidents.data.length}`)

        // 3. Crear un nuevo incidente
        console.log('\n➕ Creando nuevo incidente...')
        const nuevoIncidente = {
            reporter: 'cliente.test@empresa.com',
            description: 'Incidente creado desde el cliente de ejemplo para probar la funcionalidad',
            status: IncidentStatus.PENDIENTE,
            tagIds: [1, 3] // error + seguridad
        }

        const incidenteCreado = await apiClient.createIncident(nuevoIncidente)
        console.log('✅ Incidente creado:', {
            id: incidenteCreado.data.id,
            reporter: incidenteCreado.data.reporter,
            status: incidenteCreado.data.status
        })

        // 4. Obtener el incidente por ID
        console.log('\n🔍 Obteniendo incidente por ID...')
        const incidentePorId = await apiClient.getIncidentById(incidenteCreado.data.id)
        console.log('📄 Incidente encontrado:', incidentePorId.data.description.substring(0, 50) + '...')

        // 5. Actualizar el incidente
        console.log('\n📝 Actualizando incidente...')
        const datosActualizacion = {
            status: IncidentStatus.EN_PROCESO,
            tagIds: [1, 2, 4] // error + caracteristica + rendimiento
        }

        const incidenteActualizado = await apiClient.updateIncident(incidenteCreado.data.id, datosActualizacion)
        console.log('✅ Incidente actualizado a status:', incidenteActualizado.data.status)

        // 6. Obtener incidentes por status
        console.log('\n📊 Obteniendo incidentes en proceso...')
        const incidentesEnProceso = await apiClient.getIncidentsByStatus(IncidentStatus.EN_PROCESO)
        console.log(`⚙️ Incidentes en proceso: ${incidentesEnProceso.data.length}`)

        // 7. Eliminar el incidente creado
        console.log('\n🗑️ Eliminando incidente de prueba...')
        await apiClient.deleteIncident(incidenteCreado.data.id)
        console.log('✅ Incidente eliminado correctamente')

        console.log('\n🎉 ¡Todos los ejemplos completados exitosamente!')

    } catch (error) {
        console.error('\n❌ Error en los ejemplos:', error.message)
        if (error.response) {
            console.error('📝 Respuesta del servidor:', error.response.data)
        }
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tip: Inicia el servidor con "npm run dev" antes de ejecutar este cliente')
        }
    }
}

// Ejecutar solo si este archivo es llamado directamente
if (require.main === module) {
    ejemploCompleto()
}

module.exports = { ejemploCompleto }