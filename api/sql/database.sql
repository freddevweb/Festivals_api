UNLOCK TABLES ;

DROP DATABASE if exists festival;
CREATE DATABASE festival;
use festival;

SET CHARSET 'utf8';

SET NAMES 'utf8';

-- ################################################ CREATE
CREATE TABLE user (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) CHARACTER SET utf8 NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	pass VARCHAR(255) NOT NULL,
    tockenAccess varchar(255) 

)engine=innodb DEFAULT CHARSET=latin1 ;

CREATE TABLE festival (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(255) CHARACTER SET utf8 NOT NULL,
	dateDebut DATE  NOT NULL,
	dateFin DATE NOT NULL,
	urlLogo VARCHAR(255) NOT NULL,
	lat DECIMAL(16,14) NOT NULL,
	lng DECIMAL(16,14) NOT NULL
	
)engine=innodb;

CREATE TABLE musique (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL

)engine=innodb;

CREATE TABLE role (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nom VARCHAR(255) NOT NULL,
	definition TEXT NOT NULL

)engine=innodb;

CREATE TABLE roleUser (
	roleId INT NOT NULL,
	userId INT NOT NULL
)engine=innodb;

CREATE TABLE festivalMusique (
	festivalId INT NOT NULL,
	musiqueId INT NOT NULL

)engine=innodb;

CREATE TABLE  participate (
	userId INT NOT NULL,
	festivalId INT NOT NULL
)engine=innodb;

-- ################################################ PRIMARY KEY
ALTER TABLE roleUser 
ADD CONSTRAINT PK_role_user
	PRIMARY KEY ( roleId, userId );

ALTER TABLE festivalMusique
ADD CONSTRAINT PK_festival_musique 
	PRIMARY KEY ( festivalId, musiqueId );

ALTER TABLE participate 
ADD CONSTRAINT PK_participate 
	PRIMARY KEY ( userId, festivalId );

-- ################################################ FOREIN KEY
alter TABLE roleUser
ADD CONSTRAINT FK_roleUser_role 
	FOREIGN KEY ( roleId )
    REFERENCES role ( id );

alter TABLE roleUser
ADD CONSTRAINT FK_roleUser_user 
	FOREIGN KEY ( userId )
    REFERENCES user ( id );

alter TABLE festivalMusique
ADD CONSTRAINT FK_festivalMusique_festival
	FOREIGN KEY ( festivalId )
    REFERENCES festival ( id );

alter TABLE festivalMusique
ADD CONSTRAINT FK_festivalMusique_musiques
	FOREIGN KEY ( musiqueId )
    REFERENCES musique ( id );

alter TABLE participate
ADD CONSTRAINT  FK_participate_user
	FOREIGN KEY ( userId )
    REFERENCES user ( id );

alter TABLE participate
ADD CONSTRAINT  FK_participate_festival
	FOREIGN KEY ( festivalId )
    REFERENCES festival ( id );

-- ################################################ INSERT
LOCK TABLE user WRITE ;
INSERT INTO user VALUES
( 1, "fred", "fred@mail.com", "8bc602bffd3386269b2a794375da8087132bcc15", "cc6826a6e9bbe4f2e11ea5647efadeb9954c75c1" ),
( 2, "pierre", "pierre@mail.com", "5fa9db2e335ef69a4eeb9fe7974d61f4", "21ecd5a75038e2c1c70af2e05bfbb671b9f497cb" );
UNLOCK TABLES ;


LOCK TABLE festival WRITE ;
INSERT INTO festival VALUES
( 1, 
"Les deferlantes",
"2018-07-14", 
"2018-07-28", "https://www.festival-lesdeferlantes.com/sites/festival-lesdeferlantes.com/themes/lesdeferlantes/logo.png", 
42.531062, 3.029922 )
,
( 2,
"Les vieilles charrues",
"2018-07-13", 
"2018-07-16", "https://www.vieillescharrues.asso.fr/2017/wp-content/themes/lesvieillescharrues/images/logo-vieilles-charrues-2017.png", 
48.271096, -3.550593 )
,
( 3,
"Electrobeach",
"2018-07-14", 
"2018-07-16", 
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvDhHAKLBVt1Eg7RWeyLYKMHHaKtejJ7i41weMMhqkIYNYm4KXeQ", 
42.68243539838623, 2.8564453125 )
,
( 4,
"Love techno",
"2018-12-16", 
"2018-12-16", 
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxaOFpg0joTKUnjzJfJwJnhmbN_dgKk1BBDt95T2ucWc11kg5", 
43.572794, 3.950380 )
;
UNLOCK TABLES ;

LOCK TABLE musique WRITE ;
INSERT INTO musique VALUES
( 1, "Variete" ),
( 2, "Pop" ),
( 3, "Rock" ),
( 4, "Punk" ),
( 5, "Electro" ),
( 6, "House" );
UNLOCK TABLES ;

LOCK TABLE role WRITE ;
INSERT INTO role VALUES
( 1, "client", "Consulte le site" ),
( 2, "admin", "insere des festivals" )
;
UNLOCK TABLES ;

LOCK TABLE roleUser WRITE ;
INSERT INTO roleUser VALUES
( 1, 1 ),
( 2, 2 )
;
UNLOCK TABLES ;

LOCK TABLE festivalMusique WRITE ;
INSERT INTO festivalMusique VALUES
( 1, 1 ),
( 1, 2 ),
( 1, 3 ),
( 1, 5 ),
( 2, 1 ),
( 2, 2 ),
( 2, 3 ),
( 3, 5 ),
( 3, 6 ),
( 4, 5 ),
( 4, 6 )
;
UNLOCK TABLES ;

LOCK TABLE participate WRITE ;
INSERT INTO participate VALUES
( 2, 1 ),
( 2, 3 )
;
UNLOCK TABLES ;