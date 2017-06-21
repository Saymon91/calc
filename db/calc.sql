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
-- Table structure for table `elements`
--

DROP TABLE IF EXISTS `elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `elements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `label` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `options` json DEFAULT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elements`
--

LOCK TABLES `elements` WRITE;
/*!40000 ALTER TABLE `elements` DISABLE KEYS */;
INSERT INTO `elements` VALUES (1,'floor1','1 этаж','{\"required\": [\"1\", \"2\", \"3\", \"4\", \"5\", \"7\", \"8\", \"9\", \"10\", \"11\", \"12\", \"13\", \"14\", \"15\", \"16\", \"17\", \"20\"], \"additional\": []}'),(2,'floor2','2 этаж','{\"required\": [], \"additional\": []}'),(3,'attic','Чердачное перекрытие','{\"required\": [\"22\", \"23\", \"24\", \"26\"], \"additional\": []}'),(4,'roof','Крыша','{\"required\": [\"27\", \"28\", \"29\", \"30\", \"31\", \"32\", \"33\", \"34\"], \"additional\": []}');
/*!40000 ALTER TABLE `elements` ENABLE KEYS */;
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
  `price_formula` varchar(100) DEFAULT NULL,
  `amount_formula` varchar(100) DEFAULT NULL,
  `price_dry` float DEFAULT '0',
  `price_wet` float DEFAULT '0',
  PRIMARY KEY (`id`,`name`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  FULLTEXT KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,'Лаги первого этажа 200х50х6000 мм.',NULL,'р',':price * :count',':length * 0.39',9800,7500),(2,'Обрешётка нижняя 100*25*6000 мм. (этаж)',NULL,'р',':price * :count',':length mul 0.39 div 2',9800,7500),(3,'Обрешётка верхняя 100*25*6000 мм. (этаж)',NULL,'р',':price * :count',':length mul 0.39 div 2',9800,7500),(4,'Плёнка гидроизоляции (этаж)',NULL,'р',':price * :count',':area * 1.15',21,21),(5,'Плёнка пароизояции (этаж)',NULL,'р',':price * :count',':area * 1.15',21,21),(6,'Черновое покрытие пола',NULL,'р',':price * :count',':area mul 1.1',340,340),(7,'Утепление пола',NULL,'р',':price * :count',':area mul 0.2',60,60),(8,'Стойки каркаса внешних и внутренних несущих стен 150х50х6000 мм.','куб.м','р',':price * :count','(:externalR add :internalR div 2) / 0.55 mul 0.045',9800,7500),(9,'Стойки каркаса перегородок 100х50х6000','куб.м','р',':price * :count',':wetR div 0.4 mul 0.3',9800,7500),(10,'Обрешётка с внешней стороны 50х25х3000','куб.м','р',':price mul :count',':externalR div 4 mul 6 * 0.02',9800,7500),(11,'Обрешётка с внутренней стороны  50х25х3000','куб.м','р',':price mul :count','(:externalR add :internalR) div 4 mul 6 * 0.01',9800,7500),(12,'Утепление несущих стен','куб.м','р',':price mul :count',':externalR mul 2.95 * 0.2',1450,1450),(13,'Утепление внешних несущих стен четвртым слоем','куб.м','р',':price mul :count',':externalR mul 2.95 * 0.05',1450,1450),(14,'Утепление перегородок','куб.м','р',':price mul :count',':internalR div 2 mul 0.1 * 2.95',1450,1450),(15,'Плёнка гидроизоляции (чердачное помещение)','шт','р',':price mul :count',':externalR mul 3.2',21,21),(16,'Плёнка пароизояции (чердачное помещение)','шт','р',':price mul :count','(:externalR add :internalR add :wetR) mul 2.95',21,21),(17,'Обшивка внешних стен','кв.м','р',':price mul :count',':externalR mul 3.1',390,390),(18,'Обшивка внутренних стен','кв.м','р',':price mul :count','(:externalR add :internalR add :wetR) mul 2.95',280,280),(19,'Отделка фасада',NULL,'р',':price mul :count',':externalR mul 3.1',390,390),(20,'Обрешётка 50х25х4000 (этаж)','куб.м','р',':price mul :count',':width div 0.35 mul 3 * 0.01',9800,7500),(21,'Обшивка','кв.м','р',':price mul :count',':area mul 0.92',250,250),(22,'Лаги перекрытия 200х50х6000','куб.м','р',':count * :length',':length div 0.5 mul 2.6 mul 0.06',9800,7500),(23,'Обрешётка 50х25х4000 (чердачное помещение)','куб.м','р',':count * :length',':length div 0.5 mul 2.6 mul 0.06 div 2',9800,9800),(24,'Плёнка пароизояции с двух сторон','шт','р',':count * :length',':area',21,21),(25,'Обрешётка 50х25х4000 мм. (крыша)','кв.м','р',':count * :length',':width div 0.35 mul 0.04',250,250),(26,'Утепление чердачного перекрытия','куб.м','р',':count * :length',':area mul 0.2',1450,1450),(27,'Обшивка (крыша)','кв.м','р',':count * :length',':area mul 1.2',250,250),(28,'Стропильная система 200х50х6000 мм.','куб.м','р',':count * :length','(:length add 1.6) div 0.66 mul 4 mul 0.06',9800,7500),(29,'Металлочерепица','кв.м','р',':count * :length','(:length add 1.6) mul (:width add 1.6) mul 1.15',400,400),(30,'Контробрешётка 50х25х4000 мм. (крыша)','куб.м','р',':count * :length','(:length add 1.6) div 0.35 mul 2 mul 0.02',9800,7500),(31,'Обрешётка 100х25х6000 мм. (крыша)','куб.м','р',':count * :length','(:width mul 2 add 1.6) div 0.35 mul 2.02',9800,7500),(32,'Плёнка гидроизоляции (крыша)','шт','р',':count * :length','(:length add 1.6) mul (:width add 1.6) mul 1.15',21,21),(33,'Плёнка пароизояции (крыша)','шт','р',':count * :length','(:length add 1.6) mul (:width add 1.6) mul 1.15',43,43),(34,'Утепление крыши','куб.м','р',':count * :length','(:length add 1.6) mul (:width add 1.6) mul 1.15 mul 0.2',1450,1450);
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

-- Dump completed on 2017-06-21 20:58:08
