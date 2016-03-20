-- Make sure that you have executed 'source populate.sql' before continuing with these examples

SELECT * FROM ACCESS;
SELECT * FROM ACCESS WHERE ROLE < 3;
SELECT USERID FROM ACCESS WHERE ROLE < 3;
SELECT * FROM ACCESS ORDER BY ROLE DESC;
SELECT * FROM USER, ACCESS;
SELECT U.EMAIL, A.ROLE FROM USER U, ACCESS A WHERE U.USERID=A.USERID;

UPDATE USER SET email='stevenhalim@gmail.com' WHERE USERID='steven';
SELECT * FROM USER; -- see that steven's email has been updated

DELETE FROM ACCESS WHERE USERID = 'student3';
SELECT * FROM ACCESS; -- see that 'student3' is no longer listed

DROP TABLE ACCESS;
SELECT * FROM ACCESS; -- error, that table no longer exist
