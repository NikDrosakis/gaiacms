-- MySQL dump 10.17  Distrib 10.3.21-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: gs_73
-- ------------------------------------------------------
-- Server version	10.3.21-MariaDB-1:10.3.21+maria~xenial

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
-- Table structure for table `globs`
--

DROP TABLE IF EXISTS `globs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `globs` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `en` text NOT NULL,
  `tag` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `permit` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `globs`
--

LOCK TABLES `globs` WRITE;
/*!40000 ALTER TABLE `globs` DISABLE KEYS */;
INSERT INTO `globs` VALUES (3,'domain-version','0.8','sys','',''),(4,'google_tag_manager','this%20is%20the%20google','google','',''),(5,'site_mail','info%40aimd5.com','mail','',''),(34,'copyright','%3Cul%20class%3D%22copyright%22%3E%20%3Cli%3E%C2%A9%20Powered%20By%20%3Ca%20href%3D%22https%3A%2F%2FAIMD5.com%22%3EAIMD5%3C%2Fa%3E.%20All%20rights%20reserved.%3C%2Fli%3E%3Cli%3EDesign%3A%20%3Ca%20href%3D%22%22%3EHTML5.UP%3C%2Fa%3E%3C%2Fli%3E%20%3C%2Ful%3E','pvar','html',''),(35,'twitter','https://twitter.com/NikosDrosakis','link','',''),(36,'facebook','https://www.facebook.com/ndrosakis','link','',''),(37,'github','https://github.com/NikDrosakis','link','',''),(38,'username','mail.aimd5.com','mail','',''),(39,'password','Nikos.','mail','',''),(40,'SMTPSecure','tls','mail','',''),(41,'addAddress','drosakis%40aimd5.com','mail','',''),(42,'addAddressName','Nikos Drosakis','mail','',''),(43,'addCC','mail.aimd5.com','mail','',''),(44,'addBCC','mail.aimd5.com','mail','',''),(45,'analytics_id','UA-48757242-1','google','',''),(46,'redisdb','1','sys','',''),(50,'dash_color_comb','4','sys','',''),(51,'title','AIMD5','pvar','text',''),(52,'pagin','10','public','',''),(53,'meta_title_en','AIMD5','meta','',''),(54,'description','Artificial%20Intelligence%20Multiple%20Daemon%205','pvar','text',''),(55,'system_level','1','sys','',''),(74,'aaa_size','1','template','',''),(75,'aaa-bg','black','template','',''),(76,'aaa','1','ui','',''),(77,'redis_status','1','sys','',''),(78,'seokeywords','cms,system,apps, bloggin,websites','seo','',''),(80,'seodescription','AIMD5%20is%20intended%20to%20be%20the%20root%20system%20for%20creating%20apps%20and%20websites%20and%20a%20creative%20lab%20where%20other%20elements%20can%20exist.%20','seo','',''),(81,'system_version','0.72','sys','',''),(82,'lang_primary','en','local','',''),(83,'template_active','myblog','template','string',''),(84,'bgimg','https://scontent.fath6-1.fna.fbcdn.net/v/t1.0-9/61155773_10218553843812959_7617648790408790016_n.jpg?_nc_cat=108&_nc_ohc=IlFiqZRgEWYAQnrNnBzz2BxWFip3QDF-PZW_3orc_bX9CvrvyRWWPBMgA&_nc_ht=scontent.fath6-1.fna&oh=9c085c6c81b211b9cebc7ae61df92b44&oe=5EA6D034','pvar','img',''),(85,'subtitle','A new system for creating apps and websites','pvar','text',''),(86,'bgimg','https://scontent.fath6-1.fna.fbcdn.net/v/t1.0-9/61155773_10218553843812959_7617648790408790016_n.jpg?_nc_cat=108&_nc_ohc=IlFiqZRgEWYAQnrNnBzz2BxWFip3QDF-PZW_3orc_bX9CvrvyRWWPBMgA&_nc_ht=scontent.fath6-1.fna&oh=9c085c6c81b211b9cebc7ae61df92b44&oe=5EA6D034','pvar','img',''),(87,'subtitle','A new system for creating apps and websites','pvar','text','');
/*!40000 ALTER TABLE `globs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menuid` int(10) unsigned NOT NULL DEFAULT 0,
  `parentid` int(10) unsigned NOT NULL DEFAULT 0,
  `title` text DEFAULT NULL,
  `uri` varchar(200) DEFAULT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `sort` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `menu_id` (`menuid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
INSERT INTO `links` VALUES (2,1,0,'Login','login',1,1),(3,1,0,'Contact us','contact',1,4),(4,1,0,'About us','about',1,3),(5,1,0,'Home','home',1,0),(6,1,0,'Subscribe','subscribe',1,2),(7,10,0,'Worldnews','worldnews',1,1),(8,10,0,'Sports','sports',1,2),(9,10,0,'Tech','tech',1,0),(10,10,0,'Business','business',1,3),(14,12,0,'Αρχική','',1,0),(15,12,0,'Μικροί ήρωες','small-heros',1,2),(16,12,0,'Ποιοι είμαστε','whois',1,1),(17,12,0,'Επικαιρότητα','news',1,4),(18,12,0,'Sui generis','sui-generis',1,3),(20,0,0,'home','home',2,0);
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orient` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `title` varchar(30) DEFAULT NULL,
  `style` varchar(20) DEFAULT NULL,
  `children` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,1,'default','gaiablog',0),(12,1,'menutop',NULL,0);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obj`
--

DROP TABLE IF EXISTS `obj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `obj` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) unsigned NOT NULL DEFAULT 1,
  `objgroupid` int(10) unsigned NOT NULL DEFAULT 0,
  `title` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `filename` text DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT 2,
  `privacy` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `created` int(10) unsigned NOT NULL DEFAULT 0,
  `modified` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `objgroupid` (`objgroupid`),
  CONSTRAINT `obj_ibfk_1` FOREIGN KEY (`objgroupid`) REFERENCES `objgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obj`
--

LOCK TABLES `obj` WRITE;
/*!40000 ALTER TABLE `obj` DISABLE KEYS */;
INSERT INTO `obj` VALUES (154,0,1,NULL,NULL,'Screenshot_from_2017_01_09_02_08_33.png',2,1,1483920877,0),(156,0,4,NULL,NULL,'FootFall.png',2,1,1484075151,0),(157,0,4,NULL,NULL,'FootFall_1',2,1,1484075223,0),(158,0,4,NULL,NULL,'Dark_ivy.jpg.jpg',2,1,1484075379,0),(159,0,4,NULL,NULL,'FootFall.png.png',2,1,1484075418,0),(160,0,4,NULL,NULL,'Dark_ivy_1.jpg',2,1,1484075608,0),(161,0,4,NULL,NULL,'media_share_0_02_05_0eef70d24f66f2ed21d60a9264da222b6d2b7200f1ad94d87d00f9c888de2b57_0baf0f33_de9b_4c34_b203_bbf18c2e764e.jpg.jpg',2,1,1484075639,0),(162,0,4,NULL,NULL,'media_share_0_02_05_71ebaa525f85b1789560d176193c0344e292eb48dd8c9c462126cde336896561_24e4be1f_81b6_4359_90cc_0bf153cd5215.jpg.jpg',2,1,1484075657,0),(163,0,4,NULL,NULL,'javascript.jpg.jpg',2,1,1484075744,0),(164,0,4,NULL,NULL,'javascript.jpg',2,1,1484075803,0),(165,0,1,NULL,NULL,'programming_life4.jpg',2,1,1486019374,0),(166,0,1,NULL,NULL,'302779_2273448631327_6094042_n.jpg',2,1,1486033886,0),(167,0,1,NULL,NULL,'302779_2273448631327_6094042_n_1',2,1,1486034228,0),(168,0,1,NULL,NULL,'61506_1458771347535_2035389_n.jpg',2,1,1486034376,0),(169,0,1,NULL,NULL,'16832038_10211563985910880_796238756085486872_n.jpg',2,1,1488614424,0),(170,0,1,NULL,NULL,'16832038_10211563985910880_796238756085486872_n_1',2,1,1492760097,0),(171,0,1,NULL,NULL,'viber_image.jpg',2,1,1492760461,0),(172,0,1,NULL,NULL,'gualakias.jpg',2,1,1492760528,0),(173,1,1,NULL,NULL,'40027562_10155955799054315_3272421117096099840_n.jpg',2,1,1559645005,1559645005),(174,1,1,NULL,NULL,'52165065_10156312691309315_7112997142515417088_n.jpg',2,1,1559645025,1559645025),(175,1,1,NULL,NULL,'Chrysanthemum (1).jpg',2,1,1559665460,1559665460),(176,1,1,NULL,NULL,'mymobile_028jpg.jpg',2,1,1559719020,1559719020),(177,1,1,NULL,NULL,'model1.jpg',2,1,1559719075,1559719075),(178,1,1,NULL,NULL,'nobel_prize_einstein.jpg',2,1,1559848490,1559848490),(179,1,1,NULL,NULL,'Peace-Nobel-laureate-Malala.jpg',2,1,1559848532,1559848532),(180,1,1,NULL,NULL,'1_Anthony_Leg.jpg',2,1,1559848545,1559848545),(181,1,1,NULL,NULL,'19-22309-william-golding.jpg',2,1,1559848552,1559848552),(182,1,1,NULL,NULL,'Nelson-Mandela_1498838c.jpg',2,1,1559848557,1559848557),(183,1,1,NULL,NULL,'_92873598_drabdulsalamhighres.png',2,1,1559848703,1559848703),(184,1,1,NULL,NULL,'thorne-3.png',2,1,1559849174,1559849174),(185,1,1,NULL,NULL,'23847154_10214223072746389_5877820337674677612_o.jpg',2,1,1576259221,1576259221),(186,1,1,NULL,NULL,'23847154_10214223072746389_5877820337674677612_o.jpg',2,1,1576259353,1576259353),(187,1,1,NULL,NULL,'23916471_10214222920222576_5735661373046237239_o.jpg',2,1,1576442573,1576442573),(188,1,1,NULL,NULL,'newpaint.jpg',2,1,1577794851,1577794851),(189,1,1,NULL,NULL,'myface.jpg',2,1,1577794893,1577794893);
/*!40000 ALTER TABLE `obj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objgroup`
--

DROP TABLE IF EXISTS `objgroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objgroup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `format` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `multiple` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objgroup`
--

LOCK TABLES `objgroup` WRITE;
/*!40000 ALTER TABLE `objgroup` DISABLE KEYS */;
INSERT INTO `objgroup` VALUES (1,'user-feature',1,0),(2,'user-bg',1,0),(3,'post-feature',1,0),(4,'pagevar',1,0);
/*!40000 ALTER TABLE `objgroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'auto',
  `uid` int(10) unsigned NOT NULL COMMENT 'auto-user.name',
  `uri` varchar(100) DEFAULT NULL COMMENT 'text',
  `taxid` int(10) unsigned NOT NULL DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]',
  `img` varchar(100) DEFAULT NULL COMMENT 'img-upload',
  `title` varchar(200) DEFAULT NULL COMMENT 'text',
  `subtitle` varchar(200) DEFAULT NULL COMMENT 'text',
  `sort` int(10) unsigned NOT NULL DEFAULT 1 COMMENT 'number',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT 'select-status',
  `postgrpid` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT 'select-postgrps',
  `excerpt` text DEFAULT NULL COMMENT 'textarea-editor',
  `content` text DEFAULT NULL COMMENT 'textarea-editor',
  `seodescription` text DEFAULT NULL COMMENT 'textarea',
  `seopriority` text DEFAULT NULL COMMENT 'decimal',
  `created` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'date-read',
  `modified` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'date-read',
  `published` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'date-read',
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`),
  KEY `postgrpid` (`postgrpid`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,1,'architecture',1,'[\"system\", \"cms\", \"integrate\", \"tag5\", \"tag6\"]','40027562_10155955799054315_3272421117096099840_n.jpg','Architecture','this is the sub',0,2,1,'<p>this is the excerpt123</p>','&#60;&#112;&#62;&#71;&#97;&#105;&#97;&#39;&#115;&#32;&#112;&#117;&#114;&#112;&#111;&#115;&#101;&#32;&#116;&#111;&#32;&#98;&#101;&#32;&#116;&#104;&#101;&#32;&#114;&#111;&#111;&#116;&#32;&#115;&#121;&#115;&#116;&#101;&#109;&#32;&#102;&#111;&#114;&#32;&#99;&#114;&#101;&#97;&#116;&#105;&#110;&#103;&#32;&#97;&#112;&#112;&#115;&#32;&#97;&#110;&#100;&#32;&#119;&#101;&#98;&#115;&#105;&#116;&#101;&#115;&#32;&#97;&#110;&#100;&#32;&#97;&#32;&#99;&#114;&#101;&#97;&#116;&#105;&#118;&#101;&#32;&#108;&#97;&#98;&#32;&#119;&#104;&#101;&#114;&#101;&#32;&#111;&#116;&#104;&#101;&#114;&#32;&#101;&#108;&#101;&#109;&#101;&#110;&#116;&#115;&#32;&#99;&#97;&#110;&#32;&#101;&#120;&#105;&#115;&#116;&#32;&#97;&#110;&#100;&#32;&#111;&#116;&#104;&#101;&#114;&#32;&#115;&#121;&#115;&#116;&#101;&#109;&#115;&#32;&#99;&#111;&#117;&#108;&#100;&#32;&#99;&#111;&#45;&#101;&#120;&#105;&#115;&#116;&#46;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#98;&#62;&#71;&#97;&#105;&#97;&#115;&#121;&#115;&#60;&#47;&#98;&#62;&#32;&#119;&#97;&#110;&#116;&#115;&#32;&#116;&#111;&#32;&#105;&#110;&#115;&#112;&#105;&#114;&#101;&#32;&#115;&#105;&#109;&#112;&#108;&#101;&#32;&#117;&#115;&#101;&#114;&#115;&#32;&#97;&#110;&#100;&#32;&#116;&#101;&#99;&#104;&#45;&#115;&#112;&#101;&#99;&#105;&#108;&#105;&#122;&#101;&#100;&#32;&#112;&#114;&#111;&#103;&#114;&#97;&#109;&#109;&#101;&#114;&#115;&#32;&#97;&#116;&#32;&#116;&#104;&#101;&#32;&#112;&#97;&#115;&#115;&#105;&#111;&#110;&#32;&#111;&#102;&#32;&#99;&#114;&#101;&#97;&#116;&#105;&#118;&#105;&#116;&#121;&#46;&#32;&#73;&#116;&#32;&#119;&#97;&#110;&#116;&#32;&#117;&#115;&#101;&#114;&#115;&#32;&#116;&#111;&#32;&#117;&#116;&#105;&#108;&#105;&#122;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#121;&#115;&#116;&#101;&#109;&#32;&#116;&#111;&#32;&#99;&#114;&#101;&#97;&#116;&#101;&#32;&#115;&#111;&#109;&#101;&#116;&#104;&#105;&#110;&#103;&#32;&#104;&#105;&#103;&#104;&#101;&#114;&#46;&#32;&#83;&#111;&#32;&#101;&#120;&#99;&#101;&#112;&#116;&#32;&#102;&#114;&#111;&#109;&#32;&#103;&#105;&#118;&#105;&#110;&#103;&#32;&#116;&#104;&#101;&#32;&#109;&#97;&#120;&#105;&#109;&#117;&#109;&#32;&#112;&#111;&#115;&#115;&#105;&#98;&#108;&#101;&#32;&#99;&#117;&#115;&#116;&#111;&#109;&#105;&#122;&#97;&#116;&#105;&#111;&#110;&#32;&#97;&#98;&#105;&#108;&#105;&#116;&#121;&#44;&#32;&#105;&#116;&#32;&#97;&#118;&#111;&#105;&#100;&#115;&#32;&#103;&#105;&#118;&#105;&#110;&#103;&#32;&#105;&#110;&#116;&#101;&#114;&#102;&#97;&#99;&#101;&#32;&#108;&#105;&#98;&#114;&#97;&#114;&#105;&#101;&#115;&#44;&#32;&#98;&#117;&#116;&#32;&#116;&#104;&#101;&#32;&#116;&#111;&#111;&#108;&#115;&#32;&#116;&#111;&#32;&#99;&#114;&#101;&#97;&#116;&#101;&#32;&#111;&#110;&#101;&#32;&#102;&#111;&#114;&#32;&#101;&#97;&#99;&#104;&#32;&#111;&#119;&#110;&#46;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#112;&#62;&#60;&#112;&#62;&#60;&#98;&#62;&#84;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#60;&#47;&#98;&#62;&#32;&#105;&#115;&#32;&#97;&#32;&#99;&#111;&#110;&#115;&#116;&#114;&#117;&#99;&#116;&#105;&#111;&#110;&#32;&#111;&#102;&#32;&#60;&#98;&#62;&#112;&#97;&#103;&#101;&#115;&#60;&#47;&#98;&#62;&#38;&#110;&#98;&#115;&#112;&#59;&#97;&#110;&#100;&#32;&#112;&#97;&#103;&#101;&#115;&#32;&#97;&#114;&#101;&#32;&#99;&#111;&#110;&#115;&#116;&#114;&#117;&#99;&#116;&#105;&#111;&#110;&#115;&#32;&#111;&#102;&#32;&#60;&#98;&#62;&#109;&#111;&#100;&#117;&#108;&#101;&#115;&#60;&#47;&#98;&#62;&#38;&#110;&#98;&#115;&#112;&#59;&#111;&#114;&#32;&#60;&#98;&#62;&#99;&#117;&#115;&#116;&#111;&#109;&#32;&#104;&#116;&#109;&#108;&#32;&#60;&#47;&#98;&#62;&#116;&#104;&#114;&#111;&#117;&#103;&#104;&#32;&#97;&#32;&#119;&#121;&#115;&#105;&#119;&#121;&#103;&#32;&#101;&#100;&#105;&#116;&#111;&#114;&#46;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#112;&#62;&#60;&#112;&#62;&#67;&#111;&#112;&#121;&#105;&#110;&#103;&#32;&#109;&#111;&#100;&#117;&#108;&#101;&#115;&#32;&#98;&#101;&#116;&#119;&#101;&#101;&#110;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#115;&#44;&#32;&#97;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#119;&#105;&#122;&#97;&#114;&#100;&#32;&#97;&#110;&#100;&#32;&#101;&#120;&#105;&#115;&#116;&#97;&#110;&#116;&#32;&#104;&#116;&#109;&#108;&#53;&#32;&#105;&#110;&#116;&#101;&#103;&#114;&#97;&#116;&#105;&#111;&#110;&#32;&#116;&#111;&#32;&#71;&#97;&#105;&#97;&#115;&#121;&#115;&#32;&#109;&#97;&#107;&#101;&#115;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#99;&#114;&#101;&#97;&#116;&#105;&#111;&#110;&#32;&#102;&#97;&#115;&#116;&#101;&#114;&#46;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#112;&#62;&#60;&#112;&#62;&#65;&#118;&#97;&#105;&#108;&#97;&#98;&#108;&#101;&#32;&#102;&#101;&#97;&#116;&#117;&#114;&#101;&#115;&#32;&#97;&#116;&#32;&#116;&#104;&#101;&#32;&#99;&#117;&#115;&#116;&#111;&#109;&#32;&#118;&#101;&#114;&#115;&#105;&#111;&#110;&#32;&#97;&#114;&#101;&#58;&#60;&#98;&#114;&#62;&#60;&#47;&#112;&#62;&#60;&#117;&#108;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#98;&#62;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#119;&#105;&#122;&#97;&#114;&#100;&#32;&#97;&#110;&#100;&#32;&#115;&#116;&#121;&#108;&#101;&#114;&#32;&#60;&#47;&#98;&#62;&#116;&#111;&#32;&#115;&#116;&#97;&#114;&#116;&#32;&#97;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#46;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#98;&#62;&#109;&#111;&#100;&#117;&#108;&#105;&#122;&#101;&#100;&#32;&#99;&#111;&#110;&#116;&#101;&#110;&#116;&#32;&#97;&#110;&#100;&#32;&#115;&#116;&#121;&#108;&#101;&#115;&#104;&#101;&#101;&#116;&#115;&#60;&#47;&#98;&#62;&#32;&#119;&#105;&#116;&#104;&#32;&#60;&#98;&#62;&#112;&#97;&#103;&#101;&#115;&#32;&#60;&#47;&#98;&#62;&#97;&#110;&#100;&#32;&#60;&#98;&#62;&#109;&#111;&#100;&#117;&#108;&#101;&#115;&#44;&#32;&#102;&#111;&#114;&#32;&#103;&#114;&#101;&#97;&#116;&#101;&#32;&#118;&#97;&#114;&#105;&#101;&#116;&#121;&#32;&#97;&#110;&#100;&#32;&#99;&#117;&#115;&#116;&#111;&#109;&#32;&#117;&#115;&#101;&#114;&#32;&#100;&#101;&#115;&#105;&#103;&#110;&#46;&#60;&#47;&#98;&#62;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#115;&#112;&#97;&#110;&#32;&#108;&#97;&#110;&#103;&#61;&#34;&#101;&#110;&#45;&#85;&#83;&#34;&#62;&#60;&#98;&#62;&#117;&#116;&#105;&#108;&#105;&#122;&#101;&#115;&#32;&#53;&#32;&#100;&#97;&#116;&#97;&#98;&#97;&#115;&#101;&#115;&#32;&#97;&#110;&#100;&#32;&#107;&#101;&#121;&#45;&#115;&#116;&#111;&#114;&#101;&#115;&#60;&#47;&#98;&#62;&#44;&#32;&#119;&#105;&#116;&#104;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#115;&#112;&#97;&#110;&#62;&#77;&#89;&#83;&#81;&#76;&#32;&#111;&#110;&#32;&#116;&#104;&#101;&#32;&#109;&#105;&#100;&#100;&#108;&#101;&#32;&#111;&#102;&#32;&#116;&#104;&#101;&#32;&#115;&#121;&#115;&#116;&#101;&#109;&#46;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#115;&#112;&#97;&#110;&#32;&#108;&#97;&#110;&#103;&#61;&#34;&#101;&#110;&#45;&#85;&#83;&#34;&#62;&#60;&#98;&#62;&#99;&#97;&#99;&#104;&#101;&#32;&#115;&#121;&#115;&#116;&#101;&#109;&#32;&#102;&#111;&#114;&#32;&#99;&#114;&#101;&#97;&#116;&#101;&#114;&#32;&#112;&#101;&#114;&#102;&#111;&#114;&#109;&#97;&#110;&#99;&#101;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#98;&#62;&#119;&#105;&#116;&#104;&#32;&#50;&#32;&#107;&#101;&#121;&#45;&#115;&#116;&#111;&#114;&#101;&#115;&#32;&#40;&#82;&#101;&#100;&#105;&#115;&#44;&#32;&#77;&#101;&#109;&#99;&#97;&#99;&#104;&#101;&#100;&#41;&#46;&#60;&#47;&#115;&#112;&#97;&#110;&#62;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#115;&#112;&#97;&#110;&#32;&#108;&#97;&#110;&#103;&#61;&#34;&#101;&#110;&#45;&#85;&#83;&#34;&#62;&#60;&#98;&#62;&#101;&#97;&#115;&#121;&#32;&#100;&#97;&#115;&#104;&#98;&#111;&#97;&#114;&#100;&#32;&#60;&#47;&#98;&#62;&#102;&#111;&#114;&#32;&#116;&#104;&#101;&#32;&#103;&#114;&#101;&#97;&#116;&#101;&#115;&#116;&#32;&#117;&#115;&#101;&#114;&#32;&#99;&#111;&#110;&#116;&#114;&#111;&#108;&#32;&#97;&#110;&#100;&#32;&#119;&#105;&#116;&#104;&#32;&#117;&#115;&#101;&#114;&#32;&#112;&#101;&#114;&#109;&#105;&#115;&#115;&#105;&#111;&#110;&#115;&#46;&#60;&#47;&#115;&#112;&#97;&#110;&#62;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#98;&#62;&#99;&#117;&#115;&#116;&#111;&#109;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#97;&#110;&#100;&#32;&#109;&#111;&#100;&#117;&#108;&#101;&#32;&#60;&#47;&#98;&#62;&#99;&#114;&#101;&#97;&#116;&#105;&#111;&#110;&#46;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#60;&#98;&#62;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#105;&#110;&#116;&#101;&#103;&#114;&#97;&#116;&#105;&#111;&#110;&#32;&#60;&#47;&#98;&#62;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#105;&#110;&#103;&#32;&#97;&#110;&#32;&#101;&#120;&#105;&#115;&#116;&#97;&#110;&#116;&#32;&#104;&#116;&#109;&#108;&#53;&#38;&#110;&#98;&#115;&#112;&#59;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#32;&#116;&#111;&#32;&#112;&#104;&#112;&#45;&#106;&#115;&#32;&#71;&#97;&#105;&#97;&#115;&#121;&#115;&#32;&#116;&#101;&#109;&#112;&#108;&#97;&#116;&#101;&#38;&#110;&#98;&#115;&#112;&#59;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#99;&#117;&#115;&#116;&#111;&#109;&#32;&#116;&#97;&#120;&#111;&#110;&#111;&#109;&#121;&#32;&#103;&#114;&#111;&#117;&#112;&#115;&#44;&#32;&#38;&#110;&#98;&#115;&#112;&#59;&#112;&#111;&#115;&#116;&#32;&#116;&#121;&#112;&#101;&#115;&#44;&#32;&#117;&#115;&#101;&#114;&#32;&#114;&#111;&#108;&#101;&#115;&#32;&#102;&#111;&#114;&#32;&#60;&#98;&#62;&#103;&#114;&#101;&#97;&#116;&#101;&#114;&#32;&#99;&#111;&#110;&#116;&#101;&#110;&#116;&#32;&#97;&#98;&#115;&#116;&#114;&#97;&#99;&#116;&#105;&#111;&#110;&#60;&#47;&#98;&#62;&#46;&#60;&#47;&#108;&#105;&#62;&#60;&#108;&#105;&#32;&#115;&#116;&#121;&#108;&#101;&#61;&#34;&#109;&#97;&#114;&#103;&#105;&#110;&#45;&#98;&#111;&#116;&#116;&#111;&#109;&#58;&#32;&#48;&#46;&#49;&#49;&#105;&#110;&#59;&#32;&#100;&#105;&#114;&#101;&#99;&#116;&#105;&#111;&#110;&#58;&#32;&#108;&#116;&#114;&#59;&#32;&#108;&#105;&#110;&#101;&#45;&#104;&#101;&#105;&#103;&#104;&#116;&#58;&#32;&#49;&#53;&#46;&#49;&#50;&#112;&#120;&#59;&#34;&#62;&#111;&#112;&#116;&#105;&#109;&#105;&#122;&#101;&#100;&#60;&#98;&#62;&#32;&#112;&#104;&#112;&#32;&#97;&#110;&#100;&#32;&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#32;&#108;&#105;&#98;&#114;&#97;&#114;&#105;&#101;&#115;&#60;&#47;&#98;&#62;&#32;&#116;&#111;&#32;&#116;&#97;&#107;&#101;&#32;&#97;&#100;&#118;&#97;&#110;&#116;&#97;&#103;&#101;&#32;&#111;&#102;&#46;&#60;&#47;&#108;&#105;&#62;&#60;&#47;&#117;&#108;&#62;','description of architecture','1.0',1483457005,1559645005,1483457005);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postgrp`
--

DROP TABLE IF EXISTS `postgrp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postgrp` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postgrp`
--

LOCK TABLES `postgrp` WRITE;
/*!40000 ALTER TABLE `postgrp` DISABLE KEYS */;
INSERT INTO `postgrp` VALUES (1,'article',1),(2,'presentation',1);
/*!40000 ALTER TABLE `postgrp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tax`
--

DROP TABLE IF EXISTS `tax`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tax` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent` int(10) unsigned NOT NULL DEFAULT 0,
  `name` varchar(50) NOT NULL,
  `taxgrpid` tinyint(3) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `type` (`taxgrpid`),
  KEY `group` (`taxgrpid`),
  CONSTRAINT `tax_ibfk_1` FOREIGN KEY (`taxgrpid`) REFERENCES `taxgrp` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tax`
--

LOCK TABLES `tax` WRITE;
/*!40000 ALTER TABLE `tax` DISABLE KEYS */;
INSERT INTO `tax` VALUES (1,0,'doc',1),(34,0,'glossary',1),(37,0,'projects',1),(42,37,'version',1);
/*!40000 ALTER TABLE `tax` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taxgrp`
--

DROP TABLE IF EXISTS `taxgrp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taxgrp` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `parenting` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `multiple` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxgrp`
--

LOCK TABLES `taxgrp` WRITE;
/*!40000 ALTER TABLE `taxgrp` DISABLE KEYS */;
INSERT INTO `taxgrp` VALUES (1,'categories',1,1,0);
/*!40000 ALTER TABLE `taxgrp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'auto',
  `grp` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT 'select-usergrps',
  `img` varchar(100) DEFAULT NULL COMMENT 'img-upload',
  `name` varchar(100) DEFAULT NULL COMMENT 'text',
  `pass` varchar(100) DEFAULT NULL COMMENT 'hidden-password',
  `firstname` varchar(100) DEFAULT NULL COMMENT 'text',
  `lastname` varchar(100) DEFAULT NULL COMMENT 'text',
  `title` varchar(300) DEFAULT NULL COMMENT 'text',
  `url` varchar(100) DEFAULT 'NULL' COMMENT 'text',
  `mail` varchar(100) DEFAULT 'NULL' COMMENT 'text',
  `city` mediumint(8) unsigned NOT NULL DEFAULT 0 COMMENT 'text',
  `tel` text DEFAULT 'NULL' COMMENT 'text',
  `status` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT 'select-status',
  `phase` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT 'select-phase',
  `content` text DEFAULT NULL COMMENT 'textarea-editor',
  `lang` char(2) NOT NULL DEFAULT 'en' COMMENT 'select-global',
  `auth` varchar(50) DEFAULT NULL COMMENT 'text',
  `sp` varchar(100) DEFAULT NULL COMMENT 'hidden',
  `privacy` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT 'select-privacy',
  `seodescription` text DEFAULT NULL COMMENT 'textarea',
  `seopriority` text DEFAULT NULL COMMENT 'decimal',
  `last_login` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'hidden',
  `registered` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'hidden',
  `modified` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'hidden',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `usergroup` (`grp`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`grp`) REFERENCES `usergrp` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,7,'nobel_prize_einstein.jpg','nikos','130177','nikos','drosakis','Dr Einstein','11drosakis.com','nikosdrosakis@gmail.com111',0,'1116945031693',2,2,'<p>Hello I am Albert!</p>','el','1','05237e9a60822f9d344f360ee5fbef50907394c9c74cc155ff653ce524b859b9',1,'albert','1.0',1577660118,1462778828,1559848490);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergrp`
--

DROP TABLE IF EXISTS `usergrp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergrp` (
  `id` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `name` varchar(30) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergrp`
--

LOCK TABLES `usergrp` WRITE;
/*!40000 ALTER TABLE `usergrp` DISABLE KEYS */;
INSERT INTO `usergrp` VALUES (1,'subscriber','[]'),(2,'user','[\"page\",\"post\",\"taxonomy\",\"media\"]'),(3,'writer','[\"page\",\"post\",\"taxonomy\",\"media\"]'),(4,'editor','[\"page\",\"post\",\"taxonomy\",\"media\"]'),(5,'admin','[\"setup\",\"templates\",\"page\",\"widget\",\"menu\",\"post\",\"taxonomy\",\"user\",\"seo\",\"media\"]'),(6,'manager','[\"setup\",\"templates\",\"page\",\"widget\",\"menu\",\"post\",\"taxonomy\",\"media\",\"user\",\"seo\"]'),(7,'developer','[\"setup\",\"templates\",\"page\",\"widget\",\"menu\",\"post\",\"taxonomy\",\"seo\",\"media\",\"user\"]'),(8,'CEO','[\"setup\",\"media\",\"user\",\"apps\",\"templates\",\"widget\",\"page\",\"post\",\"taxonomy\",\"seo\"]');
/*!40000 ALTER TABLE `usergrp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-11 13:13:33
