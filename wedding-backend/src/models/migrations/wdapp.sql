CREATE TABLE IF NOT EXISTS news (
    id            INTEGER  PRIMARY KEY, 
    title         CHAR(50), 
    content       TEXT, 
    date          TEXT
);

CREATE TABLE IF NOT EXISTS admins (
    id      INTEGER PRIMARY KEY,
    username    TEXT,
    password    TEXT
)

/*CREATE TABLE IF NOT EXISTS messages (

);

CREATE TABLE IF NOT EXISTS rooms (

);*/