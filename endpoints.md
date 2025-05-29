# 📋 API Endpoints Reference - Lab3 Incidents API

## 🏥 **Health Check**

| Método | URL                                | Descripción                |
| ------ | ---------------------------------- | -------------------------- |
| `GET`  | `http://localhost:3000/api/health` | Verificar estado de la API |

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-05-29T...",
  "endpoints": {
    "incidents": "/api/incidents",
    "tags": "/api/tags",
    "relations": "/api/relations"
  }
}
```

---

## 📋 **INCIDENTS - Gestión de Incidentes**

### **CRUD Básico**

| Método   | URL                                     | Descripción                  | Body JSON   |
| -------- | --------------------------------------- | ---------------------------- | ----------- |
| `GET`    | `http://localhost:3000/api/incidents`   | Obtener todos los incidentes | -           |
| `GET`    | `http://localhost:3000/api/incidents/1` | Obtener incidente por ID     | -           |
| `POST`   | `http://localhost:3000/api/incidents`   | Crear nuevo incidente        | ✅ Requerido |
| `PUT`    | `http://localhost:3000/api/incidents/1` | Actualizar incidente         | ✅ Requerido |
| `DELETE` | `http://localhost:3000/api/incidents/1` | Eliminar incidente           | -           |

### **Filtros Especiales**

| Método | URL                                                       | Descripción           |
| ------ | --------------------------------------------------------- | --------------------- |
| `GET`  | `http://localhost:3000/api/incidents/status/pendiente`    | Incidentes pendientes |
| `GET`  | `http://localhost:3000/api/incidents/status/en%20proceso` | Incidentes en proceso |
| `GET`  | `http://localhost:3000/api/incidents/status/resuelto`     | Incidentes resueltos  |

### **JSON Examples para Incidents:**

**Crear Incidente:**
```json
{
  "reporter": "usuario@empresa.com",
  "description": "Descripción del problema encontrado",
  "status": "pendiente",
  "tagIds": [1, 3, 9]
}
```

**Actualizar Incidente:**
```json
{
  "reporter": "usuario.actualizado@empresa.com",
  "description": "Descripción actualizada",
  "status": "en proceso",
  "tagIds": [2, 4]
}
```

---

## 🏷️ **TAGS - Gestión de Etiquetas**

### **CRUD Básico**

| Método   | URL                                | Descripción            | Body JSON   |
| -------- | ---------------------------------- | ---------------------- | ----------- |
| `GET`    | `http://localhost:3000/api/tags`   | Obtener todos los tags | -           |
| `GET`    | `http://localhost:3000/api/tags/1` | Obtener tag por ID     | -           |
| `POST`   | `http://localhost:3000/api/tags`   | Crear nuevo tag        | ✅ Requerido |
| `PUT`    | `http://localhost:3000/api/tags/1` | Actualizar tag         | ✅ Requerido |
| `DELETE` | `http://localhost:3000/api/tags/1` | Eliminar tag           | -           |

### **Búsqueda**

| Método | URL                                                     | Descripción                 |
| ------ | ------------------------------------------------------- | --------------------------- |
| `GET`  | `http://localhost:3000/api/tags/search?query=error`     | Buscar tags por nombre      |
| `GET`  | `http://localhost:3000/api/tags/search?query=seguridad` | Buscar tags por descripción |

### **JSON Examples para Tags:**

**Crear Tag:**
```json
{
  "name": "urgente",
  "description": "Problemas que requieren atención inmediata"
}
```

**Actualizar Tag:**
```json
{
  "name": "critico_actualizado",
  "description": "Descripción actualizada del tag"
}
```

---

## 🔗 **RELATIONS - Gestión de Relaciones Incident-Tag**

### **Información General**

| Método | URL                                             | Descripción                |
| ------ | ----------------------------------------------- | -------------------------- |
| `GET`  | `http://localhost:3000/api/relations`           | Todas las relaciones       |
| `GET`  | `http://localhost:3000/api/relations/available` | Ver datos disponibles      |
| `GET`  | `http://localhost:3000/api/relations/stats`     | Estadísticas de relaciones |

### **Por Incidente**

| Método | URL                                                   | Descripción               | Body JSON   |
| ------ | ----------------------------------------------------- | ------------------------- | ----------- |
| `GET`  | `http://localhost:3000/api/relations/incident/1`      | Tags del incidente 1      | -           |
| `POST` | `http://localhost:3000/api/relations/incident/1/tags` | Agregar múltiples tags    | ✅ Requerido |
| `PUT`  | `http://localhost:3000/api/relations/incident/1/tags` | Reemplazar todos los tags | ✅ Requerido |

### **Por Tag**

| Método | URL                                         | Descripción          |
| ------ | ------------------------------------------- | -------------------- |
| `GET`  | `http://localhost:3000/api/relations/tag/3` | Incidentes del tag 3 |

### **Relaciones Individuales**

| Método   | URL                                                    | Descripción                  | Body JSON |
| -------- | ------------------------------------------------------ | ---------------------------- | --------- |
| `POST`   | `http://localhost:3000/api/relations/incident/1/tag/3` | Asociar tag 3 al incidente 1 | -         |
| `DELETE` | `http://localhost:3000/api/relations/incident/1/tag/3` | Quitar tag 3 del incidente 1 | -         |

### **JSON Examples para Relations:**

**Agregar múltiples tags a incidente:**
```json
{
  "tagIds": [1, 3, 9]
}
```

**Reemplazar todos los tags de un incidente:**
```json
{
  "tagIds": [2, 4, 5]
}
```

**Quitar todos los tags (array vacío):**
```json
{
  "tagIds": []
}
```

---

## 📊 **VALORES VÁLIDOS**

### **Status de Incidentes:**
- `"pendiente"`
- `"en proceso"`
- `"resuelto"`

### **IDs de Tags Disponibles (según data.sql):**

| ID  | Nombre         | Descripción                                    |
| --- | -------------- | ---------------------------------------------- |
| 1   | error          | Defectos y errores de software                 |
| 2   | caracteristica | Solicitudes de nueva funcionalidad             |
| 3   | seguridad      | Problemas relacionados con seguridad           |
| 4   | rendimiento    | Problemas de optimización de rendimiento       |
| 5   | interfaz       | Problemas de interfaz y experiencia de usuario |
| 6   | base_datos     | Problemas relacionados con base de datos       |
| 7   | red            | Problemas de conectividad de red               |
| 8   | hardware       | Reportes de mal funcionamiento de hardware     |
| 9   | critico        | Incidentes de prioridad crítica                |
| 10  | baja_prioridad | Problemas de baja prioridad                    |

---

## 🧪 **FLUJO DE PRUEBA RECOMENDADO**

### **1. Verificar conectividad:**
```
GET http://localhost:3000/api/health
```

### **2. Ver datos existentes:**
```
GET http://localhost:3000/api/incidents
GET http://localhost:3000/api/tags
GET http://localhost:3000/api/relations/available
```

### **3. Crear datos:**
```
POST http://localhost:3000/api/incidents
POST http://localhost:3000/api/tags
```

### **4. Crear relaciones:**
```
POST http://localhost:3000/api/relations/incident/1/tag/3
```

### **5. Ver resultados:**
```
GET http://localhost:3000/api/relations
GET http://localhost:3000/api/relations/stats
```

---

## ⚙️ **CONFIGURACIÓN EN POSTMAN**

### **Headers necesarios para POST/PUT:**
```
Content-Type: application/json
```

### **Variables de entorno sugeridas:**
- `base_url`: `http://localhost:3000/api`
- `incident_id`: `1` (para pruebas)
- `tag_id`: `3` (para pruebas)

### **Colección sugerida:**
1. **Health** → `{{base_url}}/health`
2. **Get Incidents** → `{{base_url}}/incidents`
3. **Create Incident** → `{{base_url}}/incidents`
4. **Get Tags** → `{{base_url}}/tags`
5. **Create Tag** → `{{base_url}}/tags`
6. **Get Relations** → `{{base_url}}/relations`
7. **Add Relation** → `{{base_url}}/relations/incident/{{incident_id}}/tag/{{tag_id}}`

---

## 🚨 **CÓDIGOS DE RESPUESTA**

| Código | Significado  | Cuándo ocurre               |
| ------ | ------------ | --------------------------- |
| `200`  | OK           | Operación exitosa           |
| `201`  | Created      | Recurso creado exitosamente |
| `400`  | Bad Request  | Datos inválidos o faltantes |
| `404`  | Not Found    | Recurso no encontrado       |
| `500`  | Server Error | Error interno del servidor  |

---

**🚀 ¡Todos los endpoints están listos para usar en Postman!**