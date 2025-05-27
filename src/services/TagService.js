class TagService {
    constructor(prisma) {
        this.prisma = prisma
    }

    // Validaciones para tags
    validateTag(data) {
        const errors = []

        if (data.name) {
            if (data.name.trim().length === 0) {
                errors.push('Name no puede estar vacío')
            }
            if (data.name.length > 100) {
                errors.push('Name no puede exceder 100 caracteres')
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    // CREATE - Crear tag
    async createTag(data) {
        const validation = this.validateTag(data)
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }

        try {
            const tag = await this.prisma.tag.create({
                data: {
                    name: data.name.trim(),
                    description: data.description || null
                },
                include: {
                    incident_tag: {
                        include: {
                            incidentes: true
                        }
                    }
                }
            })

            console.log('✅ Tag creado:', tag.id)
            return tag
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Ya existe un tag con ese nombre')
            }
            console.error('❌ Error creando tag:', error)
            throw error
        }
    }

    // READ - Obtener todos los tags
    async getAllTags() {
        try {
            const tags = await this.prisma.tag.findMany({
                include: {
                    incident_tag: {
                        include: {
                            incidentes: {
                                select: {
                                    id: true,
                                    description: true,
                                    status: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            })

            // Agregar conteo de incidentes por tag
            const tagsWithCount = tags.map(tag => ({
                ...tag,
                incidents_count: tag.incident_tag.length
            }))

            return tagsWithCount
        } catch (error) {
            console.error('❌ Error obteniendo tags:', error)
            throw error
        }
    }

    // READ - Obtener tag por ID
    async getTagById(id) {
        try {
            const tag = await this.prisma.tag.findUniqueOrThrow({
                where: { id },
                include: {
                    incident_tag: {
                        include: {
                            incidentes: {
                                select: {
                                    id: true,
                                    reporter: true,
                                    description: true,
                                    status: true,
                                    created_at: true
                                }
                            }
                        }
                    }
                }
            })

            return {
                ...tag,
                incidents_count: tag.incident_tag.length
            }
        } catch (error) {
            console.error(`❌ Error obteniendo tag ${id}:`, error)
            throw error
        }
    }

    // UPDATE - Actualizar tag
    async updateTag(id, data) {
        const validation = this.validateTag(data)
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
        }

        try {
            const updateData = {}
            if (data.name) updateData.name = data.name.trim()
            if (data.description !== undefined) updateData.description = data.description

            const tag = await this.prisma.tag.update({
                where: { id },
                data: updateData,
                include: {
                    incident_tag: {
                        include: {
                            incidentes: true
                        }
                    }
                }
            })

            console.log('✅ Tag actualizado:', id)
            return tag
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Ya existe un tag con ese nombre')
            }
            console.error(`❌ Error actualizando tag ${id}:`, error)
            throw error
        }
    }

    // DELETE - Eliminar tag
    async deleteTag(id) {
        try {
            const tag = await this.prisma.tag.delete({
                where: { id }
            })
            console.log('✅ Tag eliminado:', id)
            return tag
        } catch (error) {
            console.error(`❌ Error eliminando tag ${id}:`, error)
            throw error
        }
    }

    // Buscar tags por nombre
    async searchTags(query) {
        try {
            const tags = await this.prisma.tag.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: {
                    incident_tag: {
                        include: {
                            incidentes: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            })

            return tags.map(tag => ({
                ...tag,
                incidents_count: tag.incident_tag.length
            }))
        } catch (error) {
            console.error('❌ Error buscando tags:', error)
            throw error
        }
    }
}

module.exports = { TagService }