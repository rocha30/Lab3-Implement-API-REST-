-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS incident_tag CASCADE;
DROP TABLE IF EXISTS incidentes CASCADE;
DROP TABLE IF EXISTS tag CASCADE;

-- Create tag table
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Create incidentes table with check constraints
CREATE TABLE incidentes (
    id SERIAL PRIMARY KEY,
    reporter CHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20),
    created_at TIMESTAMP(6) DEFAULT NOW(),
    
    -- Check constraints (these are what Prisma was warning about)
    CONSTRAINT incidentes_description_check CHECK (LENGTH(description) > 0),
    CONSTRAINT incidentes_status_check CHECK (status IN ('pendiente', 'en proceso', 'resuelto'))
);

-- Create incident_tag junction table
CREATE TABLE incident_tag (
    incident_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (incident_id, tag_id),
    
    CONSTRAINT fk_incident_tag_incident 
        FOREIGN KEY (incident_id) 
        REFERENCES incidentes(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION,
        
    CONSTRAINT fk_incident_tag_tag 
        FOREIGN KEY (tag_id) 
        REFERENCES tag(id) 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION
);

-- Create indexes for better performance
CREATE INDEX idx_incidentes_status ON incidentes(status);
CREATE INDEX idx_incidentes_created_at ON incidentes(created_at);
CREATE INDEX idx_tag_name ON tag(name);