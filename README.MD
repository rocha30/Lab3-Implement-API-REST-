## ⚙️ Configuración Paso a Paso

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Lab3
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. **IMPORTANTE: Configurar PostgreSQL**

#### A. Verificar que PostgreSQL esté instalado y corriendo:
```bash
# En macOS
brew services start postgresql

# En Linux
sudo systemctl start postgresql

# En Windows
# Usar pgAdmin o iniciar desde servicios
```

#### B. Crear la base de datos (¡OBLIGATORIO!):
```bash
# Reemplaza 'postgres' con tu usuario de PostgreSQL si es diferente
psql -U postgres -c "CREATE DATABASE API;"

# Si pide contraseña, úsala y luego ejecuta:
psql -U postgres -d API -c "SELECT version();"
```

#### C. Verificar conexión (opcional):
```bash
psql -U postgres -d API -c "\dt"
```

### 4. **Configurar variables de entorno**

#### A. Copiar archivo de configuración:
```bash
cp .env.example .env
```

#### B. **Editar .env con TUS credenciales:**
```bash
nano .env   # o usa tu editor favorito
```

**DEBES cambiar estos valores:**
```env
# ANTES (ejemplo):
DATABASE_URL="postgresql://TU_USUARIO:TU_CONTRASEÑA@localhost:5432/API"

# DESPUÉS (con tus datos reales):
DATABASE_URL="postgresql://postgres:micontraseña123@localhost:5432/API"
```

**Configuraciones comunes:**
- **Usuario por defecto:** `postgres`
- **Puerto por defecto:** `5432`
- **Host:** `localhost`
- **Base de datos:** `API` (¡NO cambies esto!)

### 5. **Ejecutar scripts de base de datos**
```bash
# Generar cliente de Prisma
npm run db:generate

# Crear tablas
psql -U tu_usuario -d API -f sql/schema.sql

# Insertar datos de ejemplo
psql -U tu_usuario -d API -f sql/data.sql

# Crear vista
psql -U tu_usuario -d API -f sql/views.sql
```

### 6. **¡Iniciar el servidor!**
```bash
npm run dev
```

Si todo está bien configurado, deberías ver:
```
� Servidor corriendo en puerto 3000
📋 Rutas disponibles:
   GET  http://localhost:3000/api/health
   GET  http://localhost:3000/api/incidents
   GET  http://localhost:3000/api/tags
```

## 🚨 Problemas comunes y soluciones

### Error: "ECONNREFUSED"
**Problema:** PostgreSQL no está corriendo
**Solución:** 
```bash
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Error: "database does not exist"
**Problema:** No creaste la base de datos
**Solución:**
```bash
psql -U postgres -c "CREATE DATABASE API;"
```

### Error: "authentication failed"
**Problema:** Credenciales incorrectas en .env
**Solución:** Verifica usuario y contraseña en el archivo .env

### Error: "Cannot find module"
**Problema:** No instalaste dependencias
**Solución:**
```bash
npm install
npm run db:generate
```