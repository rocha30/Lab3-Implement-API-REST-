-- Insert sample data into tag table
INSERT INTO tag (name, description) VALUES
('error', 'Defectos y errores de software'),
('caracteristica', 'Solicitudes de nueva funcionalidad'),
('seguridad', 'Problemas relacionados con seguridad'),
('rendimiento', 'Problemas de optimización de rendimiento'),
('interfaz', 'Problemas de interfaz y experiencia de usuario'),
('base_datos', 'Problemas relacionados con base de datos'),
('red', 'Problemas de conectividad de red'),
('hardware', 'Reportes de mal funcionamiento de hardware'),
('critico', 'Incidentes de prioridad crítica'),
('baja_prioridad', 'Problemas de baja prioridad');

-- Insert sample data into incidentes table (30 records)
INSERT INTO incidentes (reporter, description, status) VALUES
('juan.perez@empresa.com', 'Página de inicio de sesión no carga para algunos usuarios', 'pendiente'),
('maria.gonzalez@empresa.com', 'Tiempo de espera de conexión a base de datos en horas pico', 'en proceso'),
('carlos.rodriguez@empresa.com', 'Agregar modo oscuro a las preferencias de usuario', 'pendiente'),
('ana.martinez@empresa.com', 'Vulnerabilidad de inyección SQL encontrada en formulario de búsqueda', 'resuelto'),
('luis.garcia@empresa.com', 'La aplicación móvil se cierra al subir imágenes grandes', 'en proceso'),
('sofia.lopez@empresa.com', 'El tiempo de respuesta del servidor es muy lento', 'pendiente'),
('diego.sanchez@empresa.com', 'El usuario no puede restablecer contraseña por correo electrónico', 'resuelto'),
('elena.torres@empresa.com', 'Agregar funcionalidad de exportar a CSV', 'pendiente'),
('ricardo.flores@empresa.com', 'Fuga de memoria en servicio en segundo plano', 'en proceso'),
('patricia.ruiz@empresa.com', 'Mejorar función de autocompletado en búsqueda', 'pendiente'),
('fernando.morales@empresa.com', 'La API devuelve códigos de error incorrectos', 'resuelto'),
('claudia.herrera@empresa.com', 'Falla de disco duro en rack de servidor 3', 'resuelto'),
('alejandro.castro@empresa.com', 'Error 500 al acceder al panel de administración', 'pendiente'),
('valeria.jimenez@empresa.com', 'Los usuarios no pueden cargar archivos PDF', 'en proceso'),
('miguel.vargas@empresa.com', 'Implementar autenticación de dos factores', 'pendiente'),
('carolina.mendoza@empresa.com', 'El sistema de chat en vivo no funciona correctamente', 'en proceso'),
('gabriel.ortega@empresa.com', 'Optimizar consultas de base de datos para reportes', 'pendiente'),
('isabella.ramirez@empresa.com', 'Problema de seguridad en API de pagos', 'resuelto'),
('andres.silva@empresa.com', 'La función de búsqueda no encuentra resultados exactos', 'pendiente'),
('natalia.cruz@empresa.com', 'Error de validación en formulario de registro', 'en proceso'),
('sebastian.guerrero@empresa.com', 'Agregar notificaciones push para móvil', 'pendiente'),
('camila.rojas@empresa.com', 'El backup automático falla todas las noches', 'en proceso'),
('daniel.muñoz@empresa.com', 'Interfaz no es responsive en tablets', 'pendiente'),
('laura.cano@empresa.com', 'Configurar SSL para subdominios', 'resuelto'),
('jorge.parra@empresa.com', 'La carga de datos tarda más de 30 segundos', 'en proceso'),
('monica.vega@empresa.com', 'Crear dashboard para métricas de ventas', 'pendiente'),
('pablo.leon@empresa.com', 'Error de permisos al eliminar archivos', 'pendiente'),
('andrea.campos@empresa.com', 'El sistema de inventario no sincroniza correctamente', 'en proceso'),
('francisco.reyes@empresa.com', 'Migrar servidor de desarrollo a la nube', 'pendiente'),
('beatriz.moreno@empresa.com', 'Vulnerabilidad XSS encontrada en comentarios', 'resuelto');

-- Insert sample data into incident_tag table (many-to-many relationships)
INSERT INTO incident_tag (incident_id, tag_id) VALUES
-- Página de login (incident 1)
(1, 1), (1, 5), (1, 9),
-- Timeout BD (incident 2)
(2, 1), (2, 4), (2, 6), (2, 9),
-- Modo oscuro (incident 3)
(3, 2), (3, 5), (3, 10),
-- SQL injection (incident 4)
(4, 1), (4, 3), (4, 9),
-- App móvil crash (incident 5)
(5, 1), (5, 4), (5, 5),
-- Servidor lento (incident 6)
(6, 4), (6, 7), (6, 9),
-- Reset password (incident 7)
(7, 1), (7, 3),
-- Export CSV (incident 8)
(8, 2), (8, 10),
-- Memory leak (incident 9)
(9, 1), (9, 4), (9, 9),
-- Autocompletado (incident 10)
(10, 2), (10, 5), (10, 4),
-- API códigos error (incident 11)
(11, 1), (11, 6),
-- Disco duro (incident 12)
(12, 8), (12, 9),
-- Error 500 admin (incident 13)
(13, 1), (13, 9),
-- Carga PDF (incident 14)
(14, 1), (14, 5),
-- 2FA (incident 15)
(15, 2), (15, 3),
-- Chat live (incident 16)
(16, 1), (16, 7),
-- Optimizar BD (incident 17)
(17, 4), (17, 6),
-- Seguridad pagos (incident 18)
(18, 3), (18, 9),
-- Búsqueda exacta (incident 19)
(19, 1), (19, 4),
-- Validación registro (incident 20)
(20, 1), (20, 5),
-- Push notifications (incident 21)
(21, 2), (21, 5),
-- Backup falla (incident 22)
(22, 1), (22, 6), (22, 9),
-- Responsive tablets (incident 23)
(23, 1), (23, 5),
-- SSL subdominios (incident 24)
(24, 3), (24, 7),
-- Carga lenta datos (incident 25)
(25, 4), (25, 6),
-- Dashboard ventas (incident 26)
(26, 2), (26, 5),
-- Permisos archivos (incident 27)
(27, 1), (27, 3),
-- Sync inventario (incident 28)
(28, 1), (28, 6),
-- Migración nube (incident 29)
(29, 2), (29, 7),
-- XSS comentarios (incident 30)
(30, 3), (30, 9);