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

/*
* state -> 0 conversation is currently closed
*          1 conversation is currently open
*/

CREATE TABLE IF NOT EXISTS users (
    id     TEXT PRIMARY KEY,
    state  TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id      INTEGER PRIMARY KEY,
    FOREIGN KEY(sender) REFERENCES users(id) ON DELETE CASCADE and ON UPDATE CASCADE,
    FOREIGN KEY(recipient) REFERENCES users(id) ON DELETE CASCADE and ON UPDATE CASCADE,
    content TEXT,
); 