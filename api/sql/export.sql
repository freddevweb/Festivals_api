-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: festival
-- ------------------------------------------------------
-- Server version	5.7.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `festival`
--

DROP TABLE IF EXISTS `festival`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `festival` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `dateDebut` date NOT NULL,
  `dateFin` date NOT NULL,
  `urlLogo` varchar(255) NOT NULL,
  `lat` decimal(16,14) NOT NULL,
  `lng` decimal(16,14) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `festival`
--

LOCK TABLES `festival` WRITE;
/*!40000 ALTER TABLE `festival` DISABLE KEYS */;
INSERT INTO `festival` VALUES (1,'Les deferlantes','2018-07-14','2018-07-28','https://www.festival-lesdeferlantes.com/sites/festival-lesdeferlantes.com/themes/lesdeferlantes/logo.png',42.53106200000000,3.02992200000000),(2,'Les vieilles charrues','2018-07-13','2018-07-16','https://www.vieillescharrues.asso.fr/2017/wp-content/themes/lesvieillescharrues/images/logo-vieilles-charrues-2017.png',48.27109600000000,-3.55059300000000),(3,'Electrobeach','2018-07-14','2018-07-16','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvDhHAKLBVt1Eg7RWeyLYKMHHaKtejJ7i41weMMhqkIYNYm4KXeQ',42.68243539838623,2.85644531250000),(4,'Love techno','2018-12-16','2018-12-16','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxaOFpg0joTKUnjzJfJwJnhmbN_dgKk1BBDt95T2ucWc11kg5',43.57279400000000,3.95038000000000);
/*!40000 ALTER TABLE `festival` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `festivalmusique`
--

DROP TABLE IF EXISTS `festivalmusique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `festivalmusique` (
  `festivalId` int(11) NOT NULL,
  `musiqueId` int(11) NOT NULL,
  PRIMARY KEY (`festivalId`,`musiqueId`),
  KEY `FK_festivalMusique_musiques` (`musiqueId`),
  CONSTRAINT `FK_festivalMusique_festival` FOREIGN KEY (`festivalId`) REFERENCES `festival` (`id`),
  CONSTRAINT `FK_festivalMusique_musiques` FOREIGN KEY (`musiqueId`) REFERENCES `musique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `festivalmusique`
--

LOCK TABLES `festivalmusique` WRITE;
/*!40000 ALTER TABLE `festivalmusique` DISABLE KEYS */;
INSERT INTO `festivalmusique` VALUES (1,1),(2,1),(1,2),(2,2),(1,3),(2,3),(1,5),(3,5),(4,5),(3,6),(4,6);
/*!40000 ALTER TABLE `festivalmusique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `musique`
--

DROP TABLE IF EXISTS `musique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musique` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `musique`
--

LOCK TABLES `musique` WRITE;
/*!40000 ALTER TABLE `musique` DISABLE KEYS */;
INSERT INTO `musique` VALUES (1,'Variete'),(2,'Pop'),(3,'Rock'),(4,'Punk'),(5,'Electro'),(6,'House');
/*!40000 ALTER TABLE `musique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participate`
--

DROP TABLE IF EXISTS `participate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `participate` (
  `userId` int(11) NOT NULL,
  `festivalId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`festivalId`),
  KEY `FK_participate_festival` (`festivalId`),
  CONSTRAINT `FK_participate_festival` FOREIGN KEY (`festivalId`) REFERENCES `festival` (`id`),
  CONSTRAINT `FK_participate_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participate`
--

LOCK TABLES `participate` WRITE;
/*!40000 ALTER TABLE `participate` DISABLE KEYS */;
INSERT INTO `participate` VALUES (2,1),(2,3);
/*!40000 ALTER TABLE `participate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `definition` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'client','Consulte le site'),(2,'admin','insere des festivals');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roleuser`
--

DROP TABLE IF EXISTS `roleuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roleuser` (
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `FK_roleUser_user` (`userId`),
  CONSTRAINT `FK_roleUser_role` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  CONSTRAINT `FK_roleUser_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roleuser`
--

LOCK TABLES `roleuser` WRITE;
/*!40000 ALTER TABLE `roleuser` DISABLE KEYS */;
INSERT INTO `roleuser` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `roleuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `tockenAccess` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'fred','fred@mail.com','8bc602bffd3386269b2a794375da8087132bcc15','cc6826a6e9bbe4f2e11ea5647efadeb9954c75c1'),(2,'pierre','pierre@mail.com','5fa9db2e335ef69a4eeb9fe7974d61f4','21ecd5a75038e2c1c70af2e05bfbb671b9f497cb');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-05  8:57:54
