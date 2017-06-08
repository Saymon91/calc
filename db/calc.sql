CREATE DATABASE  IF NOT EXISTS `calc` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `calc`;
-- MySQL dump 10.13  Distrib 5.7.12, for linux-glibc2.5 (x86_64)
--
-- Host: 127.0.0.1    Database: calc
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
-- Table structure for table `calc`
--

DROP TABLE IF EXISTS `calc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `unit` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `amount_formula` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `price_formula` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `currency` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `categories` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `required` int(11) NOT NULL,
  `elements` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calc`
--

LOCK TABLES `calc` WRITE;
/*!40000 ALTER TABLE `calc` DISABLE KEYS */;
/*!40000 ALTER TABLE `calc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `unit` varchar(10) DEFAULT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'р',
  `categories` enum('пол','стены','потолок','floor','wall','roof') NOT NULL DEFAULT 'стены',
  `required` int(1) NOT NULL,
  `elements` enum('крыша','roof','этажи','floor','floors','чердачное перекрытие','attic','дополнительно','additionally') NOT NULL DEFAULT 'этажи',
  `price_formula` varchar(100) DEFAULT NULL,
  `amount_formula` varchar(100) DEFAULT NULL,
  `price_dry` float DEFAULT '0',
  `price_wet` float DEFAULT '0',
  PRIMARY KEY (`name`,`categories`,`elements`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  FULLTEXT KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,'Лаги первого этажа 200х50х6000 мм.',NULL,'р','floor',1,'floors',':price * :count',':length * 0.39',9800,7500),(20,'Обрешётка 50х25х3000',NULL,'р','roof',0,'floors',NULL,NULL,0,0),(3,'Обрешётка верхняя 100*25*6000 мм.',NULL,'р','floor',1,'floors',':price * :count','(:length * 0.39) / 2',9800,7500),(2,'Обрешётка нижняя 100*25*6000 мм.',NULL,'р','floor',1,'floors',':price * :count','(:length / 0.39) / 2',9800,7500),(10,'Обрешётка с внешней стороны 50х25х3000',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(11,'Обрешётка с внутренней стороны  50х25х3000',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(21,'Обшивка',NULL,'р','wall',0,'floors',NULL,NULL,0,0),(17,'Обшивка внешних стен',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(18,'Обшивка внутренних стен',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(19,'Отделка фасада',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(4,'Плёнка гидроизоляции',NULL,'р','floor',1,'floors',':price * :count',':area * 1.15',21,21),(15,'Плёнка гидроизоляции',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(5,'Плёнка пароизояции',NULL,'р','floor',1,'floors',':price * :count',':area * 1.15',21,21),(16,'Плёнка пароизояции',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(8,'Стойки каркаса внешних и внутренних несущих стен 150х50х6000 мм.',NULL,'р','wall',1,'floors',':price * :count',NULL,0,0),(9,'Стойки каркаса перегородок 100х50х6000',NULL,'р','wall',1,'floors',':price * :count',NULL,0,0),(13,'Утепление внешних несущих стен четвртым слоем',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(12,'Утепление несущих стен',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(14,'Утепление перегородок',NULL,'р','wall',1,'floors',NULL,NULL,0,0),(7,'Утепление пола',NULL,'р','floor',1,'floors',':price * :count',':length * :width * 0.2',60,60),(6,'Черновое покрытие пола',NULL,'р','floor',1,'floors',':price * :count',':length * :width + :length * :width * 0.1',340,340);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-08 21:51:00
