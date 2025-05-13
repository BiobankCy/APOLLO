-- MariaDB dump 10.19  Distrib 10.11.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: realdata
-- ------------------------------------------------------
-- Server version	10.11.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appsettings`
--

DROP TABLE IF EXISTS `appsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appsettings` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `COMPANY_NAME` varchar(50) NOT NULL DEFAULT '',
  `COMPANY_EMAIL` varchar(50) NOT NULL DEFAULT '',
  `COMPANY_WEBSITE_LINK` varchar(50) NOT NULL DEFAULT '',
  `SendEmailByAPP` tinyint(1) NOT NULL DEFAULT 0,
  `SendEmailForNewRequest` tinyint(1) NOT NULL DEFAULT 1,
  `SendEmailAfterRequestDecision` tinyint(1) NOT NULL DEFAULT 1,
  `SMTP_SERVER` varchar(50) NOT NULL DEFAULT '',
  `SMTP_PORT` int(11) NOT NULL DEFAULT 0,
  `SMTP_SECURESOCKETOPTIONS` enum('None','SslOnConnect','StartTls','Auto') NOT NULL DEFAULT 'Auto',
  `SMTP_USERNAME` varchar(50) NOT NULL,
  `SMTP_PASSWORD_ENCR` text NOT NULL,
  `SMTP_FROMADDRESS` varchar(50) NOT NULL,
  `SMTP_TIMEOUT` int(11) NOT NULL DEFAULT 15000,
  `USER_PASS_MINLENGTH` int(1) NOT NULL,
  `AUTOREFRESH_MAINMENU_SECS` int(4) NOT NULL,
  `WMS_RECEIVINGLOC_METHOD` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `WMS_ALLOWRECEIVINGMOREQTYTHANPO` tinyint(1) NOT NULL,
  `ORDER_EMAIL_SUBJECT` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attachment_files`
--

DROP TABLE IF EXISTS `attachment_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` longblob NOT NULL,
  `lastupdate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lastuploadbyuid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_attachment_files_users` (`lastuploadbyuid`),
  CONSTRAINT `FK_attachment_files_users` FOREIGN KEY (`lastuploadbyuid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ActionDatetime` datetime NOT NULL DEFAULT current_timestamp(),
  `ActionByUserId` int(11) NOT NULL DEFAULT 0,
  `ActionByIPaddress` varchar(50) NOT NULL DEFAULT '',
  `ActivityType` varchar(50) NOT NULL DEFAULT '',
  `TableName` varchar(50) NOT NULL DEFAULT '',
  `OldEntity` longtext NOT NULL DEFAULT '',
  `NewEntity` longtext NOT NULL DEFAULT '',
  `ModifiedPK` int(11) NOT NULL DEFAULT 0,
  `ExtraNotes` longtext NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `FK__users` (`ActionByUserId`) USING BTREE,
  KEY `ModifiedPK` (`ModifiedPK`)
) ENGINE=InnoDB AUTO_INCREMENT=88400 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contactsofsupplier`
--

DROP TABLE IF EXISTS `contactsofsupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactsofsupplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplierid` int(11) NOT NULL DEFAULT 0,
  `department` varchar(50) NOT NULL DEFAULT '',
  `role` varchar(50) NOT NULL DEFAULT '',
  `firstname` varchar(50) NOT NULL DEFAULT '',
  `lastname` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `workphone` varchar(20) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `zipcode` varchar(10) NOT NULL DEFAULT '',
  `city` varchar(50) NOT NULL DEFAULT '',
  `state` varchar(50) NOT NULL DEFAULT '',
  `country` varchar(50) NOT NULL DEFAULT '',
  `notes` text NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `cconpurchaseorder` tinyint(1) NOT NULL DEFAULT 0,
  `activestatusflag` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `contactsofsupplier_ibfk_1` (`supplierid`) USING BTREE,
  CONSTRAINT `contactsofsupplier_ibfk_1` FOREIGN KEY (`supplierid`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `customnewpurchaseorderlineview`
--

DROP TABLE IF EXISTS `customnewpurchaseorderlineview`;
/*!50001 DROP VIEW IF EXISTS `customnewpurchaseorderlineview`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `customnewpurchaseorderlineview` AS SELECT
 1 AS `orderid`,
  1 AS `statusid`,
  1 AS `orderstatus`,
  1 AS `lineid`,
  1 AS `productid`,
  1 AS `pcode`,
  1 AS `pname`,
  1 AS `activestatusflag`,
  1 AS `orderQty`,
  1 AS `pcatid`,
  1 AS `pcatname`,
  1 AS `psubcatid`,
  1 AS `psubname`,
  1 AS `pbrandid`,
  1 AS `pbrname`,
  1 AS `reqlineid`,
  1 AS `reqqty`,
  1 AS `reqdate`,
  1 AS `reqID`,
  1 AS `reqbyuid`,
  1 AS `reqfn`,
  1 AS `reqln`,
  1 AS `orderbyuid`,
  1 AS `ordfn`,
  1 AS `ordln`,
  1 AS `tenderid`,
  1 AS `tendercode`,
  1 AS `orderunitcp`,
  1 AS `ordvatindex`,
  1 AS `ordvrate`,
  1 AS `closed_flag`,
  1 AS `ordercreateddate`,
  1 AS `posentbyempid`,
  1 AS `posentdate`,
  1 AS `duedate`,
  1 AS `ponotes`,
  1 AS `supplierid`,
  1 AS `supplier_name`,
  1 AS `supplier_email`,
  1 AS `supworknumber`,
  1 AS `primers_data`,
  1 AS `LastReceivedatetime`,
  1 AS `TotalrecQty`,
  1 AS `difference`,
  1 AS `dynamicstatus`,
  1 AS `invcounter`,
  1 AS `reccounter` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `itemconditionstatuses`
--

DROP TABLE IF EXISTS `itemconditionstatuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itemconditionstatuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobroles`
--

DROP TABLE IF EXISTS `jobroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobroles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `Role` (`RoleName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locname` varchar(100) NOT NULL,
  `roomid` int(11) NOT NULL,
  `loctypeid` int(11) NOT NULL,
  `descr` varchar(150) NOT NULL DEFAULT '',
  `activestatus_flag` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `Unique_locname_roomid` (`locname`,`roomid`) USING BTREE,
  KEY `FK_locations_locrooms` (`roomid`),
  KEY `FK_locations_locationtypes` (`loctypeid`) USING BTREE,
  CONSTRAINT `FK_locations_locationtypes` FOREIGN KEY (`loctypeid`) REFERENCES `locationtypes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_locations_locrooms` FOREIGN KEY (`roomid`) REFERENCES `locrooms` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=264 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locationtypes`
--

DROP TABLE IF EXISTS `locationtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locationtypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loctype` varchar(50) NOT NULL,
  `activestatus_flag` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `loctype` (`loctype`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locbuildings`
--

DROP TABLE IF EXISTS `locbuildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locbuildings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `building` varchar(100) NOT NULL,
  `descr` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `building` (`building`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locrooms`
--

DROP TABLE IF EXISTS `locrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locrooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room` varchar(100) NOT NULL,
  `descr` varchar(100) NOT NULL DEFAULT '',
  `buildingid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `Unique_room_buildingd` (`room`,`buildingid`) USING BTREE,
  KEY `FK_locrooms_locbuildings` (`buildingid`),
  CONSTRAINT `FK_locrooms_locbuildings` FOREIGN KEY (`buildingid`) REFERENCES `locbuildings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lots`
--

DROP TABLE IF EXISTS `lots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lotnumber` varchar(50) NOT NULL,
  `expdate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lotnumber` (`lotnumber`,`expdate`) USING BTREE,
  KEY `expdate` (`expdate`)
) ENGINE=InnoDB AUTO_INCREMENT=1208 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manufacturers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  `worknumber` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(100) NOT NULL DEFAULT '',
  `country` varchar(50) NOT NULL DEFAULT '',
  `website` varchar(50) NOT NULL DEFAULT '',
  `activestatus_flag` tinyint(1) NOT NULL DEFAULT 1,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `general_notes` longtext NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE,
  UNIQUE KEY `code` (`code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `picking`
--

DROP TABLE IF EXISTS `picking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `picking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userIDpicker` int(11) NOT NULL,
  `reqLineID` int(11) NOT NULL,
  `locid` int(11) NOT NULL,
  `lotid` int(11) NOT NULL,
  `pickedQTY` int(11) NOT NULL,
  `datetimepicked` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_picking_requestlines` (`reqLineID`),
  KEY `FK_picking_locations` (`locid`),
  KEY `FK_picking_lots` (`lotid`),
  KEY `FK_picking_users` (`userIDpicker`) USING BTREE,
  CONSTRAINT `FK_picking_locations` FOREIGN KEY (`locid`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_picking_lots` FOREIGN KEY (`lotid`) REFERENCES `lots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_picking_requestlines` FOREIGN KEY (`reqLineID`) REFERENCES `requestlines` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_picking_users` FOREIGN KEY (`userIDpicker`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `porderlines`
--

DROP TABLE IF EXISTS `porderlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `porderlines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pordid` int(11) NOT NULL DEFAULT 0,
  `productid` int(11) NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 0,
  `unitpurcostprice` decimal(15,2) NOT NULL DEFAULT 0.00,
  `vatindex` int(11) NOT NULL DEFAULT 0,
  `requestlineid` int(11) DEFAULT NULL,
  `closed_flag` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_porderlines_products` (`productid`),
  KEY `FK_porderlines_vatrates` (`vatindex`),
  KEY `FK_porderlines_porders` (`pordid`),
  KEY `FK_porderlines_requestlines` (`requestlineid`),
  CONSTRAINT `FK_porderlines_porders` FOREIGN KEY (`pordid`) REFERENCES `porders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porderlines_products` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porderlines_requestlines` FOREIGN KEY (`requestlineid`) REFERENCES `requestlines` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porderlines_vatrates` FOREIGN KEY (`vatindex`) REFERENCES `vatrates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `porders`
--

DROP TABLE IF EXISTS `porders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `porders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ordercreateddate` datetime NOT NULL DEFAULT current_timestamp(),
  `podate` date NOT NULL,
  `duedate` date NOT NULL,
  `supplierid` int(11) NOT NULL,
  `createdbyempid` int(11) NOT NULL,
  `sentbyempid` int(11) DEFAULT NULL,
  `sentdate` datetime DEFAULT NULL,
  `statusid` int(11) NOT NULL,
  `notes` varchar(450) DEFAULT '',
  `tenderid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_porders_suppliers` (`supplierid`),
  KEY `FK_porders_porders_statuses` (`statusid`),
  KEY `FK_porders_users` (`createdbyempid`),
  KEY `FK_porders_users_2` (`sentbyempid`),
  KEY `FK_porders_tenders` (`tenderid`),
  CONSTRAINT `FK_porders_porders_statuses` FOREIGN KEY (`statusid`) REFERENCES `porders_statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porders_suppliers` FOREIGN KEY (`supplierid`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porders_tenders` FOREIGN KEY (`tenderid`) REFERENCES `tenders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porders_users_createdby` FOREIGN KEY (`createdbyempid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_porders_users_sentby` FOREIGN KEY (`sentbyempid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `porders_statuses`
--

DROP TABLE IF EXISTS `porders_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `porders_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sorting` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `sorting` (`sorting`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `primers`
--

DROP TABLE IF EXISTS `primers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `primers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reqlineid` int(11) NOT NULL,
  `sequenceIdentifier` varchar(200) NOT NULL,
  `nucleotideSequence` varchar(200) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_primers_requestlines` (`reqlineid`),
  CONSTRAINT `FK_primers_requestlines` FOREIGN KEY (`reqlineid`) REFERENCES `requestlines` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1682 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productbrands`
--

DROP TABLE IF EXISTS `productbrands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productbrands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `descr` varchar(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`) USING BTREE,
  UNIQUE KEY `name_UNIQUE` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=636 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productcategories`
--

DROP TABLE IF EXISTS `productcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productcategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `descr` varchar(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productdepartments`
--

DROP TABLE IF EXISTS `productdepartments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productdepartments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productdepartmentsassigned`
--

DROP TABLE IF EXISTS `productdepartmentsassigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productdepartmentsassigned` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `did` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `pid_did` (`pid`,`did`),
  KEY `FK_productdepartments_departments` (`did`),
  CONSTRAINT `FK_productdepartments_departments` FOREIGN KEY (`did`) REFERENCES `productdepartments` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_productdepartments_products` FOREIGN KEY (`pid`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `default_loc_id` int(11) NOT NULL,
  `default_supplier_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `brand_id` int(11) NOT NULL,
  `expdate_flag` tinyint(1) NOT NULL DEFAULT 0,
  `lab_made_flag` tinyint(1) NOT NULL DEFAULT 0,
  `multiple_locations_flag` tinyint(1) NOT NULL DEFAULT 0,
  `punits` varchar(50) NOT NULL DEFAULT '',
  `concentration` varchar(50) NOT NULL DEFAULT '',
  `minstockqty` int(10) NOT NULL DEFAULT 1,
  `costprice` decimal(15,2) NOT NULL DEFAULT 0.00,
  `vat_id` int(11) NOT NULL,
  `general_notes` longtext NOT NULL DEFAULT '',
  `activestatus_flag` tinyint(1) NOT NULL,
  `forsequencing_flag` tinyint(1) NOT NULL,
  `storage_condition_id` int(11) NOT NULL,
  `tender_id` int(11) DEFAULT NULL,
  `manufacturer_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  UNIQUE KEY `sku` (`barcode`) USING BTREE,
  KEY `FK_products_locations` (`default_loc_id`),
  KEY `FK_products_vatrates` (`vat_id`),
  KEY `FK_products_storage_conditions` (`storage_condition_id`),
  KEY `FK_products_suppliers` (`default_supplier_id`),
  KEY `FK_products_categories` (`category_id`) USING BTREE,
  KEY `FK_products_productbrands` (`brand_id`),
  KEY `FK_products_productsubcategories` (`subcategory_id`),
  KEY `FK_products_tenders` (`tender_id`),
  KEY `FK_products_manufacturers` (`manufacturer_id`) USING BTREE,
  CONSTRAINT `FK_products_locations` FOREIGN KEY (`default_loc_id`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_manufacturers` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_productbrands` FOREIGN KEY (`brand_id`) REFERENCES `productbrands` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_productcategories` FOREIGN KEY (`category_id`) REFERENCES `productcategories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_productsubcategories` FOREIGN KEY (`subcategory_id`) REFERENCES `productsubcategories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_storage_conditions` FOREIGN KEY (`storage_condition_id`) REFERENCES `storage_conditions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_suppliers` FOREIGN KEY (`default_supplier_id`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_tenders` FOREIGN KEY (`tender_id`) REFERENCES `tenders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_products_vatrates` FOREIGN KEY (`vat_id`) REFERENCES `vatrates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=756 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products_files`
--

DROP TABLE IF EXISTS `products_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products_files` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `photo` longblob DEFAULT NULL,
  `documents` longblob DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `pid` (`pid`),
  CONSTRAINT `FK__products` FOREIGN KEY (`pid`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productsubcategories`
--

DROP TABLE IF EXISTS `productsubcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productsubcategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `descr` varchar(150) NOT NULL DEFAULT '',
  `catid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id_UNIQUE` (`id`) USING BTREE,
  UNIQUE KEY `catid_name_unique` (`catid`,`name`) USING BTREE,
  KEY `catid` (`catid`) USING BTREE,
  CONSTRAINT `FK_productsubcategories_productcategories` FOREIGN KEY (`catid`) REFERENCES `productcategories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `general_notes` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `presystemamountspent` decimal(15,2) NOT NULL DEFAULT 0.00,
  `totalamount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `activestatusflag` tinyint(1) NOT NULL,
  `createdbyempid` int(11) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_projects_users` (`createdbyempid`),
  CONSTRAINT `FK_projects_users` FOREIGN KEY (`createdbyempid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `receiving`
--

DROP TABLE IF EXISTS `receiving`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receiving` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Receivedatetime` datetime NOT NULL DEFAULT current_timestamp(),
  `PorderID` int(11) NOT NULL,
  `ByuserID` int(11) NOT NULL,
  `InvoiceID` int(11) DEFAULT NULL,
  `Notes` varchar(450) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`) USING BTREE,
  KEY `FK_receivinghead_users` (`ByuserID`) USING BTREE,
  KEY `FK_receivinghead_porders` (`PorderID`) USING BTREE,
  KEY `FK_receiving_supplier_invoices` (`InvoiceID`),
  CONSTRAINT `FK_receiving_supplier_invoices` FOREIGN KEY (`InvoiceID`) REFERENCES `supplier_invoices` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinghead_porders` FOREIGN KEY (`PorderID`) REFERENCES `porders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinghead_users` FOREIGN KEY (`ByuserID`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `receivinglines`
--

DROP TABLE IF EXISTS `receivinglines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receivinglines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receivingID` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `lotid` int(11) NOT NULL,
  `receivinglocID` int(11) NOT NULL,
  `unitpurcostprice` decimal(15,2) NOT NULL,
  `vatindex` int(11) NOT NULL,
  `conditionstatus` int(11) NOT NULL,
  `polineID` int(11) DEFAULT NULL,
  `notesaboutconditionstatus` longtext NOT NULL DEFAULT '',
  `linediscountPerc` decimal(15,2) NOT NULL,
  `originalpurcostpricebeforedisc` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `productid` (`productid`),
  KEY `vatindex` (`vatindex`),
  KEY `FK_receivinglines_lots` (`lotid`),
  KEY `FK_receivinglines_locations` (`receivinglocID`),
  KEY `FK_receivinglines_receivingitemstatuses` (`conditionstatus`) USING BTREE,
  KEY `FK_receivinglines_receivinglines` (`receivingID`) USING BTREE,
  KEY `FK_receivinglines_porderlines` (`polineID`),
  CONSTRAINT `FK_receivinglines_conditionstatus` FOREIGN KEY (`conditionstatus`) REFERENCES `itemconditionstatuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinglines_locations` FOREIGN KEY (`receivinglocID`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinglines_lots` FOREIGN KEY (`lotid`) REFERENCES `lots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinglines_porderlines` FOREIGN KEY (`polineID`) REFERENCES `porderlines` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_receivinglines_receiving` FOREIGN KEY (`receivingID`) REFERENCES `receiving` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `receivinglines_ibfk_1` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `receivinglines_ibfk_2` FOREIGN KEY (`vatindex`) REFERENCES `vatrates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=366 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_categories`
--

DROP TABLE IF EXISTS `report_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_filters`
--

DROP TABLE IF EXISTS `report_filters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_filters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `reporting_expenditure`
--

DROP TABLE IF EXISTS `reporting_expenditure`;
/*!50001 DROP VIEW IF EXISTS `reporting_expenditure`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `reporting_expenditure` AS SELECT
 1 AS `supplierid`,
  1 AS `orderID`,
  1 AS `orderStatusID`,
  1 AS `orderStatus`,
  1 AS `ordercreateddate`,
  1 AS `closed_flag`,
  1 AS `orderLineID`,
  1 AS `supname`,
  1 AS `invid`,
  1 AS `invno`,
  1 AS `supinvdate`,
  1 AS `pcatid`,
  1 AS `pcatname`,
  1 AS `tenderid`,
  1 AS `tendercode`,
  1 AS `pbrandid`,
  1 AS `pbrandmame`,
  1 AS `userOrdID`,
  1 AS `userOrdFullname`,
  1 AS `pid`,
  1 AS `pcode`,
  1 AS `pname`,
  1 AS `qty`,
  1 AS `lineunitcp`,
  1 AS `linevatrate`,
  1 AS `linevatid`,
  1 AS `LineAmountVatExcluded`,
  1 AS `LineAmountVatIncluded`,
  1 AS `LineVatAmount`,
  1 AS `ShippingCostAmountVatExcluded`,
  1 AS `ShippingCostVatIncluded`,
  1 AS `recheadid`,
  1 AS `reclineid`,
  1 AS `userReqID`,
  1 AS `userReqFullname` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `reporting_porders`
--

DROP TABLE IF EXISTS `reporting_porders`;
/*!50001 DROP VIEW IF EXISTS `reporting_porders`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `reporting_porders` AS SELECT
 1 AS `supplierid`,
  1 AS `supname`,
  1 AS `ordercreateddate`,
  1 AS `orderID`,
  1 AS `orderStatusID`,
  1 AS `orderStatus`,
  1 AS `orderLineID`,
  1 AS `closed_flag`,
  1 AS `pid`,
  1 AS `pcode`,
  1 AS `pname`,
  1 AS `qty`,
  1 AS `lineunitcp`,
  1 AS `linevatrate`,
  1 AS `linevatid`,
  1 AS `LineAmountVatExcluded`,
  1 AS `LineAmountVatIncluded`,
  1 AS `LineVatAmount`,
  1 AS `pcatid`,
  1 AS `pcatname`,
  1 AS `tenderid`,
  1 AS `tendercode`,
  1 AS `pbrandid`,
  1 AS `pbrandmame`,
  1 AS `reqID`,
  1 AS `reqlineID`,
  1 AS `ReqQty`,
  1 AS `ReqDate`,
  1 AS `userReqID`,
  1 AS `userReqFullname`,
  1 AS `userOrdID`,
  1 AS `userOrdFullname` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `categoryid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE,
  KEY `FK_reports_report_categories` (`categoryid`),
  CONSTRAINT `FK_reports_report_categories` FOREIGN KEY (`categoryid`) REFERENCES `report_categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reports_filters_assigned`
--

DROP TABLE IF EXISTS `reports_filters_assigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports_filters_assigned` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reportID` int(11) NOT NULL,
  `filterID` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `Id` (`id`) USING BTREE,
  UNIQUE KEY `notsamefilterforreport` (`reportID`,`filterID`),
  KEY `FK_reports_usersaccess_reports` (`reportID`) USING BTREE,
  KEY `FK_reports_filters_assigned_report_filters` (`filterID`),
  CONSTRAINT `FK_reports_filters_assigned_report_filters` FOREIGN KEY (`filterID`) REFERENCES `report_filters` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_reports_filters_assigned_reports` FOREIGN KEY (`reportID`) REFERENCES `reports` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reports_usersaccess`
--

DROP TABLE IF EXISTS `reports_usersaccess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports_usersaccess` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reportID` int(11) NOT NULL,
  `accessGivenTouserID` int(11) NOT NULL,
  `accessGivenByuserID` int(11) NOT NULL,
  `accessGivenDate` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `Id` (`id`) USING BTREE,
  KEY `FK_reports_usersaccess_reports` (`reportID`) USING BTREE,
  KEY `FK_reports_usersaccess_users_2` (`accessGivenByuserID`),
  KEY `FK_reports_usersaccess_users` (`accessGivenTouserID`) USING BTREE,
  CONSTRAINT `FK_reports_usersaccess_reports` FOREIGN KEY (`reportID`) REFERENCES `reports` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_reports_usersaccess_users_2` FOREIGN KEY (`accessGivenByuserID`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `request_decisions`
--

DROP TABLE IF EXISTS `request_decisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request_decisions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Sorting` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `sorting` (`Sorting`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requestdecisionhistory`
--

DROP TABLE IF EXISTS `requestdecisionhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requestdecisionhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reqlineid` int(11) NOT NULL,
  `decisionid` int(11) NOT NULL,
  `madebyuserid` int(11) NOT NULL,
  `decisiondatetime` datetime NOT NULL DEFAULT current_timestamp(),
  `comments` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `FK__requestlines` (`reqlineid`),
  KEY `FK__request_decisions` (`decisionid`),
  KEY `FK__users` (`madebyuserid`),
  CONSTRAINT `FK__request_decisions` FOREIGN KEY (`decisionid`) REFERENCES `request_decisions` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK__requestlines` FOREIGN KEY (`reqlineid`) REFERENCES `requestlines` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK__users` FOREIGN KEY (`madebyuserid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=860 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requestlines`
--

DROP TABLE IF EXISTS `requestlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requestlines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reqID` int(11) NOT NULL DEFAULT 0,
  `productid` int(11) NOT NULL DEFAULT 0,
  `qty` int(11) NOT NULL DEFAULT 0,
  `UrgentFlag` tinyint(1) NOT NULL DEFAULT 0,
  `comment` varchar(100) NOT NULL DEFAULT '',
  `projectid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `FK_porderlines_products` (`productid`) USING BTREE,
  KEY `FK_requestlines_requests` (`reqID`),
  KEY `FK_requestlines_projects` (`projectid`),
  CONSTRAINT `FK_requestlines_projects` FOREIGN KEY (`projectid`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_requestlines_requests` FOREIGN KEY (`reqID`) REFERENCES `requests` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `requestlines_ibfk_1` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requests` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ReqDate` datetime NOT NULL DEFAULT current_timestamp(),
  `ReqByUsrID` int(11) NOT NULL,
  `Notes` text NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id` (`Id`),
  KEY `FK_requests_users` (`ReqByUsrID`),
  CONSTRAINT `FK_requests_users` FOREIGN KEY (`ReqByUsrID`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=236 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Role` (`RoleName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `locid` int(11) NOT NULL,
  `lotid` int(11) NOT NULL,
  `lastupdate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `conditionstatus` int(11) NOT NULL,
  `si` varchar(200) NOT NULL DEFAULT '',
  `ns` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_stock_products` (`productid`),
  KEY `FK_stock_locations` (`locid`),
  KEY `FK_stock_lots` (`lotid`),
  KEY `FK_stock_itemconditionstatuses` (`conditionstatus`),
  CONSTRAINT `FK_stock_itemconditionstatuses` FOREIGN KEY (`conditionstatus`) REFERENCES `itemconditionstatuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_locations` FOREIGN KEY (`locid`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_lots` FOREIGN KEY (`lotid`) REFERENCES `lots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_products` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1299 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_trans`
--

DROP TABLE IF EXISTS `stock_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_trans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_trans_type_id` int(11) NOT NULL,
  `stock_trans_reason_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `transdate` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `updatedat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `description` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_stock_trans_stock_trans_types` (`stock_trans_type_id`),
  KEY `FK_stock_trans_users` (`userid`),
  KEY `FK_stock_trans_stock_trans_statuses` (`status`),
  KEY `FK_stock_trans_stock_trans_reasons` (`stock_trans_reason_id`),
  CONSTRAINT `FK_stock_trans_stock_trans_reasons` FOREIGN KEY (`stock_trans_reason_id`) REFERENCES `stock_trans_reasons` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_stock_trans_statuses` FOREIGN KEY (`status`) REFERENCES `stock_trans_statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_stock_trans_types` FOREIGN KEY (`stock_trans_type_id`) REFERENCES `stock_trans_types` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_users` FOREIGN KEY (`userid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=532 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_trans_details`
--

DROP TABLE IF EXISTS `stock_trans_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_trans_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `locid` int(11) NOT NULL,
  `lotid` int(11) NOT NULL,
  `conditionstatus` int(11) NOT NULL,
  `unitcostRecalculationFlag` tinyint(1) NOT NULL DEFAULT 0,
  `unitcostprice` decimal(15,2) NOT NULL DEFAULT 0.00,
  `documentLineid` int(11) NOT NULL DEFAULT 0,
  `si` varchar(200) NOT NULL DEFAULT '',
  `ns` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `pid` (`pid`),
  KEY `FK__stock_trans` (`transid`),
  KEY `FK_stock_trans_details_lots` (`lotid`),
  KEY `FK_stock_trans_details_locations` (`locid`),
  KEY `FK_stock_trans_details_itemconditionstatuses` (`conditionstatus`),
  CONSTRAINT `FK__stock_trans` FOREIGN KEY (`transid`) REFERENCES `stock_trans` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_details_itemconditionstatuses` FOREIGN KEY (`conditionstatus`) REFERENCES `itemconditionstatuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_details_locations` FOREIGN KEY (`locid`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_details_lots` FOREIGN KEY (`lotid`) REFERENCES `lots` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_trans_details_products` FOREIGN KEY (`pid`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3452 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_trans_reasons`
--

DROP TABLE IF EXISTS `stock_trans_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_trans_reasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reason_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_trans_statuses`
--

DROP TABLE IF EXISTS `stock_trans_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_trans_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sorting` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE,
  UNIQUE KEY `sorting` (`sorting`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_trans_types`
--

DROP TABLE IF EXISTS `stock_trans_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_trans_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `storage_conditions`
--

DROP TABLE IF EXISTS `storage_conditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storage_conditions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `description` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier_invoices`
--

DROP TABLE IF EXISTS `supplier_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supid` int(11) NOT NULL,
  `Supinvno` varchar(50) NOT NULL DEFAULT '',
  `Supinvdate` datetime NOT NULL,
  `SupInvShippingAndHandlingCost` decimal(15,2) NOT NULL DEFAULT 0.00,
  `vat_id` int(11) DEFAULT NULL,
  `attachmentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supid_Supinvno` (`supid`,`Supinvno`),
  KEY `FK_supplier_invoices_vatrates` (`vat_id`),
  KEY `FK_supplier_invoices_attachment_files` (`attachmentid`),
  CONSTRAINT `FK_supplier_invoices_attachment_files` FOREIGN KEY (`attachmentid`) REFERENCES `attachment_files` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_supplier_invoices_suppliers` FOREIGN KEY (`supid`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_supplier_invoices_vatrates` FOREIGN KEY (`vat_id`) REFERENCES `vatrates` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=330 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supplier_items`
--

DROP TABLE IF EXISTS `supplier_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplierid` int(11) NOT NULL DEFAULT 0,
  `productid` int(11) NOT NULL DEFAULT 0,
  `unitpurcostprice` decimal(15,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `supid_itemid` (`supplierid`,`productid`) USING BTREE,
  KEY `FK_supplier_items_products` (`productid`) USING BTREE,
  CONSTRAINT `FK_supplier_items_products` FOREIGN KEY (`productid`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_supplier_items_suppliers` FOREIGN KEY (`supplierid`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL DEFAULT '',
  `worknumber` varchar(50) NOT NULL DEFAULT '',
  `address` varchar(100) NOT NULL DEFAULT '',
  `country` varchar(50) NOT NULL DEFAULT '',
  `website` varchar(50) NOT NULL DEFAULT '',
  `activestatus_flag` tinyint(1) NOT NULL DEFAULT 1,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `general_notes` longtext NOT NULL DEFAULT '',
  `excelattachmentinemailorder_flag` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tenders`
--

DROP TABLE IF EXISTS `tenders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tenders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tendercode` varchar(50) NOT NULL DEFAULT '',
  `totalamount` decimal(15,2) NOT NULL,
  `createdbyempid` int(11) NOT NULL,
  `createddate` datetime NOT NULL DEFAULT current_timestamp(),
  `general_notes` longtext NOT NULL DEFAULT '',
  `activestatusflag` tinyint(1) NOT NULL,
  `presystemamountspent` decimal(15,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_tendercode_supplierid` (`tendercode`) USING BTREE,
  KEY `FK_tenders_users` (`createdbyempid`),
  CONSTRAINT `FK_tenders_users` FOREIGN KEY (`createdbyempid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tendersuppliersassigned`
--

DROP TABLE IF EXISTS `tendersuppliersassigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tendersuppliersassigned` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `pid_did` (`tid`,`sid`) USING BTREE,
  KEY `uid` (`sid`) USING BTREE,
  CONSTRAINT `FK_tendersuppliersassigned_suppliers` FOREIGN KEY (`sid`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_tendersuppliersassigned_tenders` FOREIGN KEY (`tid`) REFERENCES `tenders` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_password`
--

DROP TABLE IF EXISTS `user_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_password` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `PasswordHash` blob NOT NULL,
  `PasswordSalt` blob NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `FK_user_password_users` FOREIGN KEY (`UserID`) REFERENCES `users` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userprojectsassigned`
--

DROP TABLE IF EXISTS `userprojectsassigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userprojectsassigned` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `pid_did` (`pid`,`uid`) USING BTREE,
  KEY `uid` (`uid`),
  CONSTRAINT `FK_userprojectsassigned_projects` FOREIGN KEY (`pid`) REFERENCES `projects` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_userprojectsassigned_users` FOREIGN KEY (`uid`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `LockoutFlag` tinyint(1) NOT NULL DEFAULT 0,
  `roleID` int(11) NOT NULL,
  `JobRoleID` int(11) NOT NULL,
  `ClaimCanMakePO` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanApproveRequest` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanMakeRequest` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanTransferStock` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanMakeInventoryAdjustment` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanReceiveItems` tinyint(1) NOT NULL DEFAULT 0,
  `ClaimCanViewReports` tinyint(1) NOT NULL DEFAULT 0,
  `CConpurchaseOrder` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedDate` datetime NOT NULL DEFAULT current_timestamp(),
  `LastUpdatedDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ApproverUID` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `email` (`Email`) USING BTREE,
  KEY `FK_users_userroles` (`roleID`),
  KEY `FK_users_jobroles` (`JobRoleID`),
  KEY `FK_users_users` (`ApproverUID`),
  CONSTRAINT `FK_users_jobroles` FOREIGN KEY (`JobRoleID`) REFERENCES `jobroles` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_users_userroles` FOREIGN KEY (`roleID`) REFERENCES `roles` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_users_users` FOREIGN KEY (`ApproverUID`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vatrates`
--

DROP TABLE IF EXISTS `vatrates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vatrates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rate` decimal(4,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `rate` (`rate`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `customnewpurchaseorderlineview`
--

/*!50001 DROP VIEW IF EXISTS `customnewpurchaseorderlineview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `customnewpurchaseorderlineview` AS select `po`.`id` AS `orderid`,`ps`.`id` AS `statusid`,`ps`.`name` AS `orderstatus`,`pl`.`id` AS `lineid`,`pl`.`productid` AS `productid`,`p`.`code` AS `pcode`,`p`.`name` AS `pname`,`p`.`activestatus_flag` AS `activestatusflag`,`pl`.`qty` AS `orderQty`,`p`.`category_id` AS `pcatid`,`pc`.`name` AS `pcatname`,`p`.`subcategory_id` AS `psubcatid`,`psc`.`name` AS `psubname`,`p`.`brand_id` AS `pbrandid`,`pb`.`name` AS `pbrname`,`rl`.`id` AS `reqlineid`,`rl`.`qty` AS `reqqty`,`rq`.`ReqDate` AS `reqdate`,`rq`.`Id` AS `reqID`,`u`.`Id` AS `reqbyuid`,`u`.`FirstName` AS `reqfn`,`u`.`LastName` AS `reqln`,`uu`.`Id` AS `orderbyuid`,`uu`.`FirstName` AS `ordfn`,`uu`.`LastName` AS `ordln`,`t`.`id` AS `tenderid`,`t`.`tendercode` AS `tendercode`,`pl`.`unitpurcostprice` AS `orderunitcp`,`pl`.`vatindex` AS `ordvatindex`,`vt`.`rate` AS `ordvrate`,`pl`.`closed_flag` AS `closed_flag`,`po`.`ordercreateddate` AS `ordercreateddate`,`po`.`sentbyempid` AS `posentbyempid`,`po`.`sentdate` AS `posentdate`,`po`.`duedate` AS `duedate`,coalesce(`po`.`notes`,'') AS `ponotes`,`po`.`supplierid` AS `supplierid`,`sup`.`name` AS `supplier_name`,`sup`.`email` AS `supplier_email`,`sup`.`worknumber` AS `supworknumber`,case when count(`pri`.`id`) > 0 then json_arrayagg(json_object('Id',`pri`.`id`,'SequenceIdentifier',`pri`.`sequenceIdentifier`,'NucleotideSequence',`pri`.`nucleotideSequence`,'Reqlineid',`pri`.`reqlineid`,'Reqline',NULL)) else NULL end AS `primers_data`,coalesce(max(`r_received`.`Receivedatetime`),'') AS `LastReceivedatetime`,coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) AS `TotalrecQty`,`pl`.`qty` - coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) AS `difference`,case when `pl`.`closed_flag` then 'Closed' when lcase(`ps`.`name`) = lcase('cancelled') then 'Cancelled' when coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) = 0 then 'Pending' when `pl`.`qty` - coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) > 0 then 'Partially Received' when `pl`.`qty` - coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) = 0 then 'Received' when `pl`.`qty` - coalesce(sum(coalesce(`recl_received`.`qty`,0)),0) < 0 then 'Received (Exceeded Quantity)' else 'Unknown Status' end AS `dynamicstatus`,count(distinct `sii`.`id`) AS `invcounter`,(select count(distinct `r_receiv2`.`Id`) AS `reccounter` from `receiving` `r_receiv2` where `r_receiv2`.`PorderID` = `po`.`id`) AS `reccounter` from (((((((((((((((((`porders` `po` left join `porderlines` `pl` on(`po`.`id` = `pl`.`pordid`)) left join `products` `p` on(`p`.`id` = `pl`.`productid`)) left join `requestlines` `rl` on(`rl`.`id` = `pl`.`requestlineid`)) left join `requests` `rq` on(`rq`.`Id` = `rl`.`reqID`)) left join `users` `u` on(`u`.`Id` = `rq`.`ReqByUsrID`)) left join `users` `uu` on(`uu`.`Id` = `po`.`createdbyempid`)) left join `tenders` `t` on(`t`.`id` = `po`.`tenderid`)) left join `porders_statuses` `ps` on(`ps`.`id` = `po`.`statusid`)) left join `vatrates` `vt` on(`vt`.`id` = `pl`.`vatindex`)) left join `suppliers` `sup` on(`sup`.`id` = `po`.`supplierid`)) left join `receivinglines` `recl_received` on(`recl_received`.`polineID` = `pl`.`id` and `recl_received`.`productid` = `pl`.`productid`)) left join `receiving` `r_received` on(`r_received`.`Id` = `recl_received`.`receivingID`)) left join `primers` `pri` on(`pri`.`reqlineid` = `rl`.`id`)) left join `supplier_invoices` `sii` on(`sii`.`id` = `r_received`.`InvoiceID`)) left join `productbrands` `pb` on(`pb`.`id` = `p`.`brand_id`)) left join `productcategories` `pc` on(`pc`.`id` = `p`.`category_id`)) left join `productsubcategories` `psc` on(`psc`.`id` = `p`.`subcategory_id`)) group by `po`.`id`,`ps`.`id`,`pl`.`id`,`pl`.`productid`,`p`.`code`,`p`.`name`,`p`.`activestatus_flag`,`p`.`category_id`,`p`.`subcategory_id`,`p`.`brand_id`,`pl`.`qty`,`rl`.`id`,`rq`.`Id`,`u`.`Id`,`u`.`FirstName`,`u`.`LastName`,`uu`.`Id`,`uu`.`FirstName`,`uu`.`LastName`,`t`.`id`,`t`.`tendercode`,`pl`.`unitpurcostprice`,`pl`.`vatindex`,`vt`.`rate`,`pl`.`closed_flag`,`po`.`ordercreateddate`,`rq`.`ReqDate`,`rl`.`qty`,`po`.`sentbyempid`,`po`.`sentdate`,`po`.`duedate`,`po`.`supplierid`,`sup`.`worknumber`,`sup`.`name`,`sup`.`email`,coalesce(`po`.`notes`,'') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `reporting_expenditure`
--

/*!50001 DROP VIEW IF EXISTS `reporting_expenditure`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `reporting_expenditure` AS select `s`.`id` AS `supplierid`,`po`.`id` AS `orderID`,`po`.`id` AS `orderStatusID`,`ps`.`name` AS `orderStatus`,`po`.`ordercreateddate` AS `ordercreateddate`,`pol`.`closed_flag` AS `closed_flag`,`pol`.`id` AS `orderLineID`,`s`.`name` AS `supname`,`si`.`id` AS `invid`,`si`.`Supinvno` AS `invno`,`si`.`Supinvdate` AS `supinvdate`,`p`.`category_id` AS `pcatid`,`cat`.`name` AS `pcatname`,`po`.`tenderid` AS `tenderid`,`t`.`tendercode` AS `tendercode`,`pb`.`id` AS `pbrandid`,`pb`.`name` AS `pbrandmame`,`userorder`.`Id` AS `userOrdID`,concat(`userorder`.`FirstName`,' ',`userorder`.`LastName`) AS `userOrdFullname`,`p`.`id` AS `pid`,`p`.`code` AS `pcode`,`p`.`name` AS `pname`,`rl`.`qty` AS `qty`,round(`rl`.`unitpurcostprice`,2) AS `lineunitcp`,`v`.`rate` AS `linevatrate`,`v`.`id` AS `linevatid`,round(`rl`.`qty` * round(`rl`.`unitpurcostprice`,2),2) AS `LineAmountVatExcluded`,round(round(`rl`.`qty` * round(`rl`.`unitpurcostprice`,2),2) * (1 + `v`.`rate` / 100.00),2) AS `LineAmountVatIncluded`,round(round(`rl`.`qty` * round(`rl`.`unitpurcostprice`,2),2) * (1 + `v`.`rate` / 100.00),2) - round(`rl`.`qty` * round(`rl`.`unitpurcostprice`,2),2) AS `LineVatAmount`,round(`si`.`SupInvShippingAndHandlingCost`,2) AS `ShippingCostAmountVatExcluded`,round(round(`si`.`SupInvShippingAndHandlingCost`,2) * (1 + coalesce(`vv`.`rate`,0) / 100),2) AS `ShippingCostVatIncluded`,`rr`.`Id` AS `recheadid`,`rl`.`id` AS `reclineid`,`req`.`ReqByUsrID` AS `userReqID`,concat(`userrequested`.`FirstName`,' ',`userrequested`.`LastName`) AS `userReqFullname` from ((((((((((((((((`receiving` `rr` left join `receivinglines` `rl` on(`rr`.`Id` = `rl`.`receivingID`)) left join `supplier_invoices` `si` on(`si`.`id` = `rr`.`InvoiceID`)) left join `products` `p` on(`p`.`id` = `rl`.`productid`)) left join `porders` `po` on(`po`.`id` = `rr`.`PorderID`)) left join `porders_statuses` `ps` on(`ps`.`id` = `po`.`statusid`)) left join `suppliers` `s` on(`po`.`supplierid` = `s`.`id`)) left join `vatrates` `v` on(`v`.`id` = `rl`.`vatindex`)) left join `vatrates` `vv` on(`vv`.`id` = `si`.`vat_id`)) left join `productcategories` `cat` on(`p`.`category_id` = `cat`.`id`)) left join `tenders` `t` on(`t`.`id` = `po`.`tenderid`)) left join `productbrands` `pb` on(`pb`.`id` = `p`.`brand_id`)) left join `users` `userorder` on(`userorder`.`Id` = `po`.`createdbyempid`)) left join `porderlines` `pol` on(`pol`.`id` = `rl`.`polineID`)) left join `requestlines` `reqlines` on(`reqlines`.`id` = `pol`.`requestlineid`)) left join `requests` `req` on(`req`.`Id` = `reqlines`.`reqID`)) left join `users` `userrequested` on(`userrequested`.`Id` = `req`.`ReqByUsrID`)) where `rr`.`InvoiceID` is not null order by `rl`.`polineID` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `reporting_porders`
--

/*!50001 DROP VIEW IF EXISTS `reporting_porders`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `reporting_porders` AS select `po`.`supplierid` AS `supplierid`,`sup`.`name` AS `supname`,`po`.`ordercreateddate` AS `ordercreateddate`,`po`.`id` AS `orderID`,`ps`.`id` AS `orderStatusID`,`ps`.`name` AS `orderStatus`,`plines`.`id` AS `orderLineID`,`plines`.`closed_flag` AS `closed_flag`,`plines`.`productid` AS `pid`,`prod`.`code` AS `pcode`,`prod`.`name` AS `pname`,`plines`.`qty` AS `qty`,round(`plines`.`unitpurcostprice`,2) AS `lineunitcp`,`v`.`rate` AS `linevatrate`,`v`.`id` AS `linevatid`,round(`plines`.`qty` * round(`plines`.`unitpurcostprice`,2),2) AS `LineAmountVatExcluded`,round(round(`plines`.`qty` * round(`plines`.`unitpurcostprice`,2),2) * (1 + `v`.`rate` / 100.00),2) AS `LineAmountVatIncluded`,round(round(`plines`.`qty` * round(`plines`.`unitpurcostprice`,2),2) * (1 + `v`.`rate` / 100.00),2) - round(`plines`.`qty` * round(`plines`.`unitpurcostprice`,2),2) AS `LineVatAmount`,`prod`.`category_id` AS `pcatid`,`cat`.`name` AS `pcatname`,`po`.`tenderid` AS `tenderid`,`t`.`tendercode` AS `tendercode`,`pb`.`id` AS `pbrandid`,`pb`.`name` AS `pbrandmame`,`reqh`.`Id` AS `reqID`,`plines`.`requestlineid` AS `reqlineID`,`reql`.`qty` AS `ReqQty`,`reqh`.`ReqDate` AS `ReqDate`,`userrequested`.`Id` AS `userReqID`,concat(`userrequested`.`FirstName`,' ',`userrequested`.`LastName`) AS `userReqFullname`,`userorder`.`Id` AS `userOrdID`,concat(`userorder`.`FirstName`,' ',`userorder`.`LastName`) AS `userOrdFullname` from ((((((((((((`porders` `po` left join `porders_statuses` `ps` on(`po`.`statusid` = `ps`.`id`)) left join `suppliers` `sup` on(`sup`.`id` = `po`.`supplierid`)) left join `porderlines` `plines` on(`po`.`id` = `plines`.`pordid`)) left join `vatrates` `v` on(`v`.`id` = `plines`.`vatindex`)) left join `products` `prod` on(`prod`.`id` = `plines`.`productid`)) left join `productcategories` `cat` on(`prod`.`category_id` = `cat`.`id`)) left join `tenders` `t` on(`t`.`id` = `po`.`tenderid`)) left join `productbrands` `pb` on(`pb`.`id` = `prod`.`brand_id`)) left join `requestlines` `reql` on(`reql`.`id` = `plines`.`requestlineid`)) left join `requests` `reqh` on(`reql`.`reqID` = `reqh`.`Id`)) left join `users` `userorder` on(`userorder`.`Id` = `po`.`createdbyempid`)) left join `users` `userrequested` on(`userrequested`.`Id` = `reqh`.`ReqByUsrID`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-08 11:52:09
