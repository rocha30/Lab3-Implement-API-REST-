-- Create a view that combines incidents with their tags (sin BigInt)
CREATE OR REPLACE VIEW incidentes_con_tags AS
SELECT 
    i.id::integer AS id,
    i.reporter::text AS reporter,
    i.description::text AS description,
    i.status::text AS status,
    i.created_at AS created_at,
    COALESCE(STRING_AGG(t.name, ', ' ORDER BY t.name), '') AS tags,
    COALESCE(STRING_AGG(t.description, ' | ' ORDER BY t.name), '') AS tags_descriptions,
    COALESCE(COUNT(t.id), 0)::integer AS total_tags
FROM incidentes i
LEFT JOIN incident_tag it ON i.id = it.incident_id
LEFT JOIN tag t ON it.tag_id = t.id
GROUP BY i.id, i.reporter, i.description, i.status, i.created_at
ORDER BY i.created_at DESC;