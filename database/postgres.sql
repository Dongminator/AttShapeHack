

-- how to use postgres:
-- in terminal, navigate to AttShapeHack folder. 
-- type heroku pg:psql to connect to heroku postgres console
-- once in the postgres console, type \connect da3shana9mdpvp; to connect the database
-- type \q to quit heroku postgres console

CREATE TABLE travel (
  id integer NOT NULL,
  name varchar(40) NOT NULL,
  points text NOT NULL
) ;

insert into travel (id, name, points) values (1, 'name', '{"point":"1"}');

select * from travel where id=1;