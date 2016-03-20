-- Table USER
-- Dropping and (re)-creating a table (note PRIMARY KEY and NOT NULL)
DROP TABLE USER;
CREATE TABLE USER (
  USERID VARCHAR(20) PRIMARY KEY,
  EMAIL VARCHAR(30) NOT NULL,
  PASSWORD VARCHAR(20) NOT NULL
);
-- Adding rows to a table
INSERT INTO USER VALUES('steven', 'stevenha@comp.nus.edu.sg', 'hashed1');
INSERT INTO USER VALUES('student1', 'axxxxxx@comp.nus.edu.sg', 'hashed2');
INSERT INTO USER VALUES('student2', 'bxxxxxx@comp.nus.edu.sg', 'hashed3');
INSERT INTO USER VALUES('student3', 'cxxxxxx@comp.nus.edu.sg', 'hashed4');
INSERT INTO USER VALUES('student4', null, 'hashed5'); -- will not work



-- Table ACCESS
DROP TABLE ACCESS;
CREATE TABLE ACCESS (
  USERID VARCHAR(20) PRIMARY KEY,
  ROLE INTEGER
);
INSERT INTO ACCESS VALUES('steven', 1);
INSERT INTO ACCESS VALUES('student1', 2);
INSERT INTO ACCESS VALUES('student2', 3);
INSERT INTO ACCESS VALUES('student3', 3);



-- Table SCOREBOARD
DROP TABLE SCOREBOARD;
CREATE TABLE SCOREBOARD (
  USERID VARCHAR(20) PRIMARY KEY,
  SCORE INTEGER
);
INSERT INTO SCOREBOARD VALUES('student2', 90);
INSERT INTO SCOREBOARD VALUES('student3', 70);
