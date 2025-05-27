const { IncidentStatus } = require('../types')

class IncidentService {
    constructor(prisma) {
        this.prisma = prisma
    }

    // Función helper para procesar BigInt
    _processBigIntResults(results) {
        return results.map(row => {
            const processed = { ...row }
            // Convertir todos los campos BigInt a Number
            Object.keys(processed).forEach(key => {
                if (typeof processed[key] === 'bigint') {
                    processed[key] = Number(processed[key])
                }
            })
            return processed
        })
    }

    // Validaciones a nivel de aplicación
    validateIncident(data) {
        const errors = []

        if (data.reporter) {
            if (data.reporter.length > 100) {
                errors.push('Reporter no puede exceder 100 caracteres')
            }
            if (!data.reporter.includes('@')) {
                errors.push('Reporter debe ser un email válido')
            }
        }

        if (data.description) {
            if (data.description.trim().length === 0) {
                errors.push('Description no puede estar vacía')
            }
        }

        if (data.status) {
            if (!Object.values(IncidentStatus).includes(data.status)) {
                errors.push('Status debe ser: pendiente, en proceso, o resuelto')
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    // CREATE - Crear incidente con tags
    async createIncident(data) {
        const validation = this.validateIncident(data)
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }

        try {
            const incident = await this.prisma.incidentes.create({
                data: {
                    reporter: data.reporter,
                    description: data.description,
                    status: data.status || IncidentStatus.PENDIENTE,
                    incident_tag: {
                        create: data.tagIds.map(tagId => ({
                            tag_id: tagId
                        }))
                    }
                },
                include: {
                    incident_tag: {
                        include: {
                            tag: true
                        }
                    }
                }
            })

            console.log('✅ Incidente creado:', incident.id)
            return incident
        } catch (error) {
            console.error('❌ Error creando incidente:', error)
            throw error
        }
    }

    // READ - Obtener todos los incidentes usando la vista
    async getAllIncidentsWithTags() {
        try {
            console.log('🔍 Iniciando consulta a la vista...')

            const result = await this.prisma.$queryRaw`
                SELECT * FROM incidentes_con_tags
            `

            // 🔧 Procesar BigInt
            const processedResult = this._processBigIntResults(result)

            console.log('✅ Consulta exitosa, registros encontrados:', processedResult.length)
            return processedResult
        } catch (error) {
            console.error('❌ Error en getAllIncidentsWithTags:', error)
            throw error
        }
    }

    // READ - Obtener incidente por ID
    async getIncidentById(id) {
        try {
            const incident = await this.prisma.incidentes.findUniqueOrThrow({
                where: { id },
                include: {
                    incident_tag: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
            return incident
        } catch (error) {
            console.error(`❌ Error obteniendo incidente ${id}:`, error)
            throw error
        }
    }

    // UPDATE - Actualizar incidente
    async updateIncident(id, data) {
        const validation = this.validateIncident(data)
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }

        try {
            // Si se proporcionan tagIds, actualizar las relaciones
            if (data.tagIds) {
                // Eliminar relaciones existentes
                await this.prisma.incident_tag.deleteMany({
                    where: { incident_id: id }
                })

                // Crear nuevas relaciones
                await this.prisma.incident_tag.createMany({
                    data: data.tagIds.map(tagId => ({
                        incident_id: id,
                        tag_id: tagId
                    }))
                })
            }

            // Actualizar el incidente
            const updateData = {}
            if (data.reporter) updateData.reporter = data.reporter
            if (data.description) updateData.description = data.description
            if (data.status) updateData.status = data.status

            const incident = await this.prisma.incidentes.update({
                where: { id },
                data: updateData,
                include: {
                    incident_tag: {
                        include: {
                            tag: true
                        }
                    }
                }
            })

            console.log('✅ Incidente actualizado:', id)
            return incident
        } catch (error) {
            console.error(`❌ Error actualizando incidente ${id}:`, error)
            throw error
        }
    }

    // DELETE - Eliminar incidente
    async deleteIncident(id) {
        try {
            const incident = await this.prisma.incidentes.delete({
                where: { id }
            })
            console.log('✅ Incidente eliminado:', id)
            return incident
        } catch (error) {
            console.error(`❌ Error eliminando incidente ${id}:`, error)
            throw error
        }
    }

    // Filtrar por status - CON PROCESAMIENTO DE BIGINT
    async getIncidentsByStatus(status) {
        try {
            console.log(`🔍 Obteniendo incidentes con status: ${status}`)

            const result = await this.prisma.$queryRaw`
                SELECT * FROM incidentes_con_tags 
                WHERE status = ${status}
            `

            // 🔧 Procesar BigInt
            const processedResult = this._processBigIntResults(result)

            console.log(`✅ Incidentes con status ${status}:`, processedResult.length)
            return processedResult
        } catch (error) {
            console.error(`❌ Error obteniendo incidentes con status ${status}:`, error)
            throw error
        }
    }
}

module.exports = { IncidentService }