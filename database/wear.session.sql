CREATE TABLE users(
    id SERIAL primary key,
    email VARCHAR(255) not null,
    password VARCHAR(255) not null,
    display_name VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
-- CREATE TABLE dms(
--     id SERIAL primary key,
--     from_id INTEGER,
--     FOREIGN KEY (from_id) REFERENCES users(id),
--     to_id INTEGER,
--     FOREIGN KEY (to_id) REFERENCES users(id),
--     content text,
--     type VARCHAR(255),
--     created_at TIMESTAMP,
--     updated_at TIMESTAMP
-- );
TRUNCATE TABLE users RESTART IDENTITY CASCADE;