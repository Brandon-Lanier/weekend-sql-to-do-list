-- create a table in your database with these values
CREATE TABLE "tasks" (
"id" SERIAL PRIMARY KEY,
"task" VARCHAR (150) NOT NULL,
"notes" VARCHAR (250),
"priority" INTEGER, 
"completed" BOOLEAN DEFAULT FALSE,
"time" TIME
);


