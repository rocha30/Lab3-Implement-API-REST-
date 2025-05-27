class IncidentTagService {
    constructor(prisma) {
        this.prisma = prisma
    }

    // Validaciones para relaciones incident-tag
    validateRelation(data) {
        const errors = []

        if (!data.incident_id || data.incident_id <= 0) {
            errors.push('incident_id debe ser un número entero positivo')
        }

        if (!data.tag_id || data.tag_id <= 0) {
            errors.push('tag_id debe ser un número entero positivo')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    // CREATE - Asociar tag a incidente
    async addTagToIncident(incidentId, tagId) {
        const validation = this.validateRelation({ incident_id: incidentId, tag_id: tagId })
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }

        try {
            // Verificar que el incidente existe
            await this.prisma.incidentes.findUniqueOrThrow({
                where: { id: incidentId }
            })

            // Verificar que el tag existe
            await this.prisma.tag.findUniqueOrThrow({
                where: { id: tagId }
            })

            // Crear la relación
            const relation = await this.prisma.incident_tag.create({
                data: {
                    incident_id: incidentId,
                    tag_id: tagId
                },
                include: {
                    incidentes: {
                        select: {
                            id: true,
                            reporter: true,
                            description: true,
                            status: true
                        }
                    },
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                }
            })

            console.log(`✅ Tag ${tagId} asociado al incidente ${incidentId}`)
            return relation
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Esta relación ya existe')
            }
            console.error('❌ Error creando relación incident-tag:', error)
            throw error
        }
    }

    // Agregar múltiples tags a incidente (MEJORADO)
    async addMultipleTagsToIncident(incidentId, tagIds) {
        try {
            console.log(`🔍 Verificando incidente ${incidentId}...`)

            // Verificar que el incidente existe
            const incident = await this.prisma.incidentes.findUnique({
                where: { id: incidentId }
            })

            if (!incident) {
                throw new Error(`Incidente con ID ${incidentId} no existe`)
            }

            console.log(`✅ Incidente ${incidentId} encontrado`)
            console.log(`🔍 Verificando tags [${tagIds.join(', ')}]...`)

            // Verificar que todos los tags existen
            const existingTags = await this.prisma.tag.findMany({
                where: { id: { in: tagIds } }
            })

            const foundTagIds = existingTags.map(tag => tag.id)
            const missingTagIds = tagIds.filter(id => !foundTagIds.includes(id))

            if (missingTagIds.length > 0) {
                throw new Error(`Tags no encontrados: ${missingTagIds.join(', ')}`)
            }

            console.log(`✅ Todos los tags existen`)

            // Crear las relaciones
            const relations = await this.prisma.incident_tag.createMany({
                data: tagIds.map(tagId => ({
                    incident_id: incidentId,
                    tag_id: tagId
                })),
                skipDuplicates: true
            })

            console.log(`✅ ${relations.count} relaciones creadas para incidente ${incidentId}`)
            return relations
        } catch (error) {
            console.error('❌ Error creando múltiples relaciones:', error.message)
            throw error
        }
    }

    // READ - Obtener todas las relaciones
    async getAllRelations() {
        try {
            const relations = await this.prisma.incident_tag.findMany({
                include: {
                    incidentes: {
                        select: {
                            id: true,
                            reporter: true,
                            description: true,
                            status: true,
                            created_at: true
                        }
                    },
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                },
                orderBy: [
                    { incident_id: 'desc' },
                    { tag_id: 'asc' }
                ]
            })

            return relations
        } catch (error) {
            console.error('❌ Error obteniendo relaciones:', error)
            throw error
        }
    }

    // READ - Obtener tags de un incidente específico
    async getTagsByIncident(incidentId) {
        try {
            const relations = await this.prisma.incident_tag.findMany({
                where: { incident_id: incidentId },
                include: {
                    tag: true,
                    incidentes: {
                        select: {
                            id: true,
                            description: true,
                            status: true
                        }
                    }
                },
                orderBy: {
                    tag: { name: 'asc' }
                }
            })

            return relations.map(relation => ({
                incident_id: relation.incident_id,
                tag: relation.tag,
                incident: relation.incidentes
            }))
        } catch (error) {
            console.error(`❌ Error obteniendo tags del incidente ${incidentId}:`, error)
            throw error
        }
    }

    // READ - Obtener incidentes de un tag específico
    async getIncidentsByTag(tagId) {
        try {
            const relations = await this.prisma.incident_tag.findMany({
                where: { tag_id: tagId },
                include: {
                    incidentes: true,
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                },
                orderBy: {
                    incidentes: { created_at: 'desc' }
                }
            })

            return relations.map(relation => ({
                tag_id: relation.tag_id,
                incident: relation.incidentes,
                tag: relation.tag
            }))
        } catch (error) {
            console.error(`❌ Error obteniendo incidentes del tag ${tagId}:`, error)
            throw error
        }
    }

    // DELETE - Remover tag de incidente
    async removeTagFromIncident(incidentId, tagId) {
        try {
            const relation = await this.prisma.incident_tag.delete({
                where: {
                    incident_id_tag_id: {
                        incident_id: incidentId,
                        tag_id: tagId
                    }
                }
            })

            console.log(`✅ Tag ${tagId} removido del incidente ${incidentId}`)
            return relation
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('La relación no existe')
            }
            console.error('❌ Error removiendo relación:', error)
            throw error
        }
    }

    // DELETE - Remover todos los tags de un incidente
    async removeAllTagsFromIncident(incidentId) {
        try {
            const result = await this.prisma.incident_tag.deleteMany({
                where: { incident_id: incidentId }
            })

            console.log(`✅ ${result.count} tags removidos del incidente ${incidentId}`)
            return result
        } catch (error) {
            console.error(`❌ Error removiendo tags del incidente ${incidentId}:`, error)
            throw error
        }
    }

    // UPDATE - Reemplazar todos los tags de un incidente
    async replaceIncidentTags(incidentId, newTagIds) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                // 1. Remover todas las relaciones existentes
                await prisma.incident_tag.deleteMany({
                    where: { incident_id: incidentId }
                })

                // 2. Crear las nuevas relaciones
                if (newTagIds.length > 0) {
                    await prisma.incident_tag.createMany({
                        data: newTagIds.map(tagId => ({
                            incident_id: incidentId,
                            tag_id: tagId
                        }))
                    })
                }

                // 3. Retornar el incidente actualizado con sus tags
                const updatedIncident = await prisma.incidentes.findUnique({
                    where: { id: incidentId },
                    include: {
                        incident_tag: {
                            include: {
                                tag: true
                            }
                        }
                    }
                })

                return updatedIncident
            })
        } catch (error) {
            console.error('❌ Error reemplazando tags:', error)
            throw error
        }
    }

    // ESTADÍSTICAS - Obtener estadísticas de relaciones
    async getRelationStatistics() {
        try {
            const [
                totalRelations,
                incidentsWithTags,
                tagsInUse,
                avgTagsPerIncident
            ] = await Promise.all([
                this.prisma.incident_tag.count(),
                this.prisma.incidentes.count({
                    where: {
                        incident_tag: {
                            some: {}
                        }
                    }
                }),
                this.prisma.tag.count({
                    where: {
                        incident_tag: {
                            some: {}
                        }
                    }
                }),
                this.prisma.incident_tag.groupBy({
                    by: ['incident_id'],
                    _count: {
                        tag_id: true
                    }
                })
            ])

            const avgTags = avgTagsPerIncident.length > 0
                ? avgTagsPerIncident.reduce((sum, item) => sum + item._count.tag_id, 0) / avgTagsPerIncident.length
                : 0

            return {
                totalRelations,
                incidentsWithTags,
                tagsInUse,
                averageTagsPerIncident: Math.round(avgTags * 100) / 100
            }
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error)
            throw error
        }
    }
}

module.exports = { IncidentTagService }
