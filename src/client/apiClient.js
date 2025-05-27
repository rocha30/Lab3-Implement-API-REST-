const axios = require('axios')

const API_BASE_URL = 'http://localhost:3000/api'  // ← Faltaba /api

class ApiClient {
    constructor() {
        this.axios = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    // Incidents
    async getAllIncidents() {
        const response = await this.axios.get('/incidents')
        return response.data
    }

    async getIncidentById(id) {
        const response = await this.axios.get(`/incidents/${id}`)
        return response.data
    }

    async createIncident(data) {
        const response = await this.axios.post('/incidents', data)
        return response.data
    }

    async updateIncident(id, data) {
        const response = await this.axios.put(`/incidents/${id}`, data)
        return response.data
    }

    async deleteIncident(id) {
        const response = await this.axios.delete(`/incidents/${id}`)
        return response.data
    }

    async getIncidentsByStatus(status) {
        const response = await this.axios.get(`/incidents/status/${status}`)
        return response.data
    }
}

// Instancia singleton
const apiClient = new ApiClient()

module.exports = { ApiClient, apiClient }