#!/bin/bash
# filepath: /Users/mariorocha/Documents/Programacion/Base_datos/Lab3/setup.sh

echo "🚀 Configurando Lab3 Incidents API..."

echo "📦 Instalando dependencias..."
npm install

echo "📋 Verificando archivo .env..."
if [ ! -f .env ]; then
    echo "⚠️  Copiando .env.example a .env..."
    cp .env.example .env
    echo "❗ IMPORTANTE: Edita el archivo .env con tus credenciales de PostgreSQL"
    echo "❗ Luego ejecuta: npm run db:generate && npm run dev"
else
    echo "✅ Archivo .env ya existe"
    
    echo "🔧 Generando cliente de Prisma..."
    npm run db:generate
    
    echo "✅ ¡Setup completado!"
    echo "🚀 Ejecuta 'npm run dev' para iniciar el servidor"
fi
