CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE quiz_category (
    id         uuid DEFAULT uuid_generate_v4 (),
    name       varchar(1024) NOT NULL,
	PRIMARY KEY (id)
);
