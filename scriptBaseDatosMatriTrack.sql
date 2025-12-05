CREATE DATABASE  IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: shortline.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `analisis`
--

DROP TABLE IF EXISTS `analisis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analisis` (
  `id_analisis` char(6) NOT NULL,
  `nombre_analisis` varchar(55) NOT NULL,
  `descripcion_analisis` varchar(155) DEFAULT NULL,
  `estado` enum('A','I','F') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`id_analisis`),
  UNIQUE KEY `IDX_2a0f368ddbe1471a55a3a52e20` (`nombre_analisis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analisis`
--

LOCK TABLES `analisis` WRITE;
/*!40000 ALTER TABLE `analisis` DISABLE KEYS */;
INSERT INTO `analisis` VALUES ('AN0001','Hemograma Completo','Recuento de glóbulos rojos, blancos y plaquetas.','A'),('AN0002','Grupo Sanguíneo y Factor Rh','Determina el tipo de sangre (A, B, AB, O) y el factor Rh (+ o -).','A'),('AN0003','Prueba de Glucosa (Test O\'Sullivan)','Prueba de tolerancia a la glucosa para descartar diabetes gestacional.','A'),('AN0004','VDRL / RPR','Detección de sífilis.','A'),('AN0005','VIH (Test de ELISA)','Detección del Virus de Inmunodeficiencia Humana.','A'),('AN0006','Hepatitis B (HBsAg)','Detección de antígeno de superficie de Hepatitis B.','A'),('AN0007','Toxoplasmosis (IgG, IgM)','Detección de anticuerpos contra Toxoplasma gondii.','A'),('AN0008','Rubéola (IgG)','Verificación de inmunidad contra la Rubéola.','A'),('AN0009','Examen Completo de Orina','Análisis físico-químico y sedimento de la orina.','A'),('AN0010','Urocultivo y Antibiograma','Cultivo de orina para detectar infecciones urinarias.','A'),('AN0011','Perfil de Coagulación','Mide el tiempo de protrombina (TP) y tromboplastina (TTPa).','A'),('AN0012','Prueba de Coombs Indirecta','Detección de anticuerpos irregulares en el suero materno.','A');
/*!40000 ALTER TABLE `analisis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_diagnostico`
--

DROP TABLE IF EXISTS `control_diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `control_diagnostico` (
  `id_control_diagnostico` char(7) NOT NULL,
  `id_programadiagnostico` char(7) NOT NULL,
  `id_usuario` char(6) NOT NULL,
  `fecha_controldiagnostico` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fecha_modificacion` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `semana_gestacion` int NOT NULL,
  `peso` decimal(6,2) NOT NULL,
  `talla` decimal(4,2) NOT NULL,
  `presion_arterial` varchar(10) NOT NULL,
  `altura_uterina` decimal(4,1) DEFAULT NULL,
  `fcf` int DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `recomendacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_control_diagnostico`),
  KEY `FK_937fddd77ac0dbe0f7f6d49f783` (`id_programadiagnostico`),
  KEY `FK_7da0eabe4be376c7c0d38a4ca20` (`id_usuario`),
  CONSTRAINT `FK_7da0eabe4be376c7c0d38a4ca20` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FK_937fddd77ac0dbe0f7f6d49f783` FOREIGN KEY (`id_programadiagnostico`) REFERENCES `programa_diagnostico` (`id_programadiagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_diagnostico`
--

LOCK TABLES `control_diagnostico` WRITE;
/*!40000 ALTER TABLE `control_diagnostico` DISABLE KEYS */;
INSERT INTO `control_diagnostico` VALUES ('CD00001','PD00003','OB0001','2025-11-05 21:12:29.674638','2025-11-05 21:12:29.674638',3,67.50,1.64,'110/26',8.0,140,'nn','nn'),('CD00002','PD00003','OB0001','2025-11-05 21:13:27.051371','2025-11-05 22:03:19.000000',27,65.00,1.67,'110/23',5.0,140,'nnnn','nn'),('CD00003','PD00003','OB0001','2025-11-05 22:11:31.214981','2025-11-05 22:11:31.214981',30,64.50,1.65,'120/80',29.0,130,'Sobrepeso','nuevo control en 2 semanas'),('CD00004','PD00003','OB0001','2025-11-05 22:14:31.218292','2025-11-05 22:14:31.218292',29,67.80,1.65,'125/80',29.0,140,'nn','nn'),('CD00005','PD00003','OB0001','2025-11-06 06:48:54.388757','2025-11-06 06:48:54.388757',20,65.00,1.60,'112/70',27.0,120,'',''),('CD00006','PD00003','OB0001','2025-11-07 14:08:54.674928','2025-11-07 14:08:54.674928',24,65.40,1.65,'110/50',25.0,130,'',''),('CD00007','PD00003','OB0001','2025-11-07 14:17:33.862721','2025-11-07 14:17:33.862721',27,65.40,1.75,'110/70',29.0,160,'PACIENTE SUFRE DE SOBREPESO','ESTIRAMIENTO CADA MAÑANA'),('CD00008','PD00007','OB0001','2025-11-07 20:00:46.332889','2025-11-07 20:00:46.332889',1,65.00,1.65,'110/70',25.0,140,'',''),('CD00009','PD00003','OB0001','2025-11-08 07:52:25.666535','2025-11-08 07:52:25.666535',23,75.30,1.74,'120/80',28.0,168,'ww','ww'),('CD00010','PD00003','OB0001','2025-11-08 07:58:33.975498','2025-11-08 07:58:33.975498',32,65.00,2.30,'112/23',21.0,123,'ww','ww'),('CD00011','PD00003','OB0001','2025-11-08 07:59:02.431529','2025-11-08 07:59:02.431529',21,55.30,1.53,'110/32',21.0,123,'ww','ww'),('CD00012','PD00003','OB0001','2025-11-08 07:59:25.870939','2025-11-08 07:59:25.870939',25,64.00,1.65,'123/21',32.0,145,'ww','ww'),('CD00013','PD00003','OB0001','2025-11-08 07:59:58.753189','2025-11-08 07:59:58.753189',27,64.20,1.64,'110/21',23.0,140,'ww','ww'),('CD00014','PD00007','OB0001','2025-11-09 06:45:45.020222','2025-11-09 06:45:45.020222',24,53.30,1.54,'112/23',23.0,132,'ss','ss'),('CD00015','PD00007','OB0001','2025-11-28 17:49:51.078801','2025-11-28 21:33:25.000000',25,72.00,1.65,'110/70',30.0,145,'Paciente presenta algunas contracciones',NULL);
/*!40000 ALTER TABLE `control_diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `control_puerperio`
--

DROP TABLE IF EXISTS `control_puerperio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `control_puerperio` (
  `id_control_puerperio` char(7) NOT NULL,
  `id_programapuerperio` char(7) NOT NULL,
  `usuario_id_usuario` char(6) NOT NULL,
  `peso` decimal(6,2) NOT NULL,
  `talla` decimal(4,2) NOT NULL,
  `presion_arterial` varchar(10) NOT NULL,
  `involucion_uterina` varchar(100) DEFAULT NULL,
  `cicatrizacion` varchar(100) DEFAULT NULL,
  `estado_mamas_lactancia` varchar(100) DEFAULT NULL,
  `estado_emocional` varchar(100) DEFAULT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `recomendacion` varchar(500) DEFAULT NULL,
  `fecha_controlpuerperio` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fecha_modificacion` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id_usuario` char(6) DEFAULT NULL,
  PRIMARY KEY (`id_control_puerperio`),
  KEY `FK_4063e1a7f8e2af4c09fce9d6387` (`id_programapuerperio`),
  KEY `FK_e2f5874f27e36f1ab10176e59b5` (`id_usuario`),
  CONSTRAINT `FK_4063e1a7f8e2af4c09fce9d6387` FOREIGN KEY (`id_programapuerperio`) REFERENCES `programa_puerperio` (`id_programapuerperio`),
  CONSTRAINT `FK_e2f5874f27e36f1ab10176e59b5` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_puerperio`
--

LOCK TABLES `control_puerperio` WRITE;
/*!40000 ALTER TABLE `control_puerperio` DISABLE KEYS */;
INSERT INTO `control_puerperio` VALUES ('CP00001','PP00001','OB0003',656.00,1.50,'120/80','20cm','limpio','exito','feli','nn','nn','2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00002','PP00001','OB0003',65.60,1.79,'120/80','dfkjldg',NULL,NULL,'Felizzz','ojooooooooo',NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00003','PP00001','OB0003',70.00,1.61,'120/80','Utero contraido','Limpia',NULL,'Tranquila',NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00004','PP00001','OB0003',65.00,1.59,'120/80','todo bien',NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00005','PP00001','OB0003',70.00,1.60,'120/80',NULL,NULL,NULL,'normallle',NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 18:18:12.000000',NULL),('CP00006','PP00001','OB0003',70.00,1.61,'120/89',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00007','PP00001','OB0003',70.00,1.61,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00008','PP00001','OB0003',70.00,1.70,'120/68',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00009','PP00001','OB0003',70.00,1.70,'120/79',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00010','PP00001','OB0003',70.00,1.70,'110/50',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00011','PP00001','OB0003',70.00,1.20,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00012','PP00001','OB0003',70.00,1.20,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00013','PP00001','OB0003',70.00,1.20,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00014','PP00001','OB0003',65.00,1.59,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00015','PP00001','OB0003',70.00,1.59,'120/79',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00016','PP00001','OB0003',70.00,1.70,'110/50',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00017','PP00001','OB0003',66.00,1.58,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00018','PP00001','OB0003',60.00,1.57,'110/50',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00019','PP00001','OB0003',70.00,1.20,'120/20',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00020','PP00001','OB0003',60.50,1.60,'120/70',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00021','PP00001','OB0003',60.00,1.20,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00022','PP00001','OB0003',60.00,1.59,'120/69',NULL,NULL,NULL,'okkk',NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00023','PP00001','OB0003',60.00,1.67,'120/71',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00024','PP00001','OB0003',69.00,1.61,'120/70',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00025','PP00001','OB0003',67.00,1.61,'120/79',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00026','PP00001','OB0003',66.00,1.60,'120/79',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00027','PP00001','OB0003',60.00,1.60,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00028','PP00001','OB0003',60.00,1.60,'120/70',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00029','PP00001','OB0003',60.00,1.20,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00030','PP00001','OB0003',60.00,1.60,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:38.334613','2025-11-06 16:37:40.249197',NULL),('CP00031','PP00001','OB0003',60.00,1.60,'120/79',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:37:56.769540','2025-11-06 16:37:56.769540',NULL),('CP00032','PP00001','OB0003',60.00,1.60,'120/59',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 16:42:08.238508','2025-11-06 16:42:08.238508',NULL),('CP00033','PP00001','OB0003',66.00,1.62,'120/80',NULL,NULL,NULL,'Tranquila',NULL,NULL,'2025-11-06 17:00:13.210426','2025-11-06 19:30:57.000000',NULL),('CP00034','PP00001','OB0003',70.00,1.68,'120/70',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 20:05:37.134143','2025-11-06 20:05:37.134143',NULL),('CP00035','PP00001','OB0003',70.00,1.71,'120/80',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 20:09:09.664129','2025-11-06 20:09:09.664129',NULL),('CP00036','PP00001','OB0003',60.00,1.60,'120/70',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-06 20:12:55.257821','2025-11-06 20:12:55.257821',NULL),('CP00037','PP00001','OB0003',65.45,1.60,'120/80',NULL,'Limpia',NULL,'Buen ánimo',NULL,'Beber agua regularmente','2025-11-06 20:13:18.178613','2025-11-07 16:51:28.000000',NULL),('CP00038','PP00001','OB0003',40.00,1.30,'120/80','242','242','242','24','2422424','424242','2025-11-07 04:55:21.281266','2025-11-07 04:55:21.281266',NULL),('CP00039','PP00001','OB0003',70.00,1.64,'112/20',NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-12 04:56:13.001416','2025-11-12 04:56:13.001416',NULL),('CP00040','PP00002','OB0003',67.90,1.62,'120/80','Útero contraído','Herida limpia','Lactancia difucultuosa','Depresión por parto','Estado de ánimo : triste','Tomas vitaminas dopamina y serotonina después de cada almuerzo','2025-11-28 18:01:13.793794','2025-11-28 18:01:13.793794',NULL);
/*!40000 ALTER TABLE `control_puerperio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_medico`
--

DROP TABLE IF EXISTS `historial_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medico` (
  `id_historialmedico` char(6) NOT NULL,
  `id_paciente` char(6) NOT NULL,
  `fecha_iniciohistorial` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `antecedente_medico` varchar(500) DEFAULT NULL,
  `alergia` varchar(500) DEFAULT NULL,
  `tipo_sangre` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  PRIMARY KEY (`id_historialmedico`),
  UNIQUE KEY `IDX_6634e22b547d294284a1ae3243` (`id_paciente`),
  UNIQUE KEY `REL_6634e22b547d294284a1ae3243` (`id_paciente`),
  CONSTRAINT `FK_6634e22b547d294284a1ae32437` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medico`
--

LOCK TABLES `historial_medico` WRITE;
/*!40000 ALTER TABLE `historial_medico` DISABLE KEYS */;
INSERT INTO `historial_medico` VALUES ('HM0001','PA0001','2025-11-05 03:38:45.120167','Diabetes','Polen','B+'),('HM0002','PA0002','2025-11-05 07:32:20.569919',NULL,NULL,'B-'),('HM0003','PA0003','2025-11-05 21:09:44.633512',NULL,NULL,'O+'),('HM0004','PA0004','2025-11-06 21:44:02.890252','Hipertensión','Mariscos','O+'),('HM0005','PA0005','2025-11-06 22:07:35.522169',NULL,'Lactosa','O-'),('HM0006','PA0006','2025-11-12 01:15:11.552296','Asma en la niñez','Pescado y mariscos','O+');
/*!40000 ALTER TABLE `historial_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `id_paciente` char(6) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` char(8) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo_electronico` varchar(254) NOT NULL,
  `estado` enum('A','I','F') NOT NULL DEFAULT 'A',
  `fecha_inhabilitacion` date DEFAULT NULL,
  PRIMARY KEY (`id_paciente`),
  UNIQUE KEY `IDX_2d35986235fcf4668f525528a9` (`dni`),
  UNIQUE KEY `IDX_b34f007c1eabde6a954a3d8b64` (`correo_electronico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES ('PA0001','Martina','Sanchez','73654217','2004-02-03','calle no se 456','F','735278493','juani@gmail.com','A',NULL),('PA0002','Alejandra','Goicochea','45678941','2000-11-10','Av Peru 123','F','456741963','alejandrag@gmail.com','A',NULL),('PA0003','Fernanda','Salgado','72297332','1997-02-13','Urb. San Fernando Guevara Ochoa','F','943 721 822','FernandaS22@gmail.com','A',NULL),('PA0004','Fiorella','Gomez Flores','45674196','1995-12-11','Av Fatima 123','F','456741852','fiorellagomez12@gmail.com','A',NULL),('PA0005','Margarita','De La Flor Jardines','45678921','1997-09-20','Av los Colibries 123','F','456741852','margaritadelaflor@gmail.com','A',NULL),('PA0006','Priscila Fiorella','Sánchez Díaz','96385241','1995-02-02','Av Fátima #1234','F','456789142','priscilasanchez05@gmail.com','A',NULL);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programa_diagnostico`
--

DROP TABLE IF EXISTS `programa_diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa_diagnostico` (
  `id_programadiagnostico` char(7) NOT NULL,
  `id_historialmedico` char(6) NOT NULL,
  `numero_gestacion` int NOT NULL,
  `fecha_probableparto` date DEFAULT NULL,
  `factor_riesgo` varchar(500) DEFAULT NULL,
  `observacion` varchar(1000) DEFAULT NULL,
  `estado` enum('A','I','F') NOT NULL DEFAULT 'A',
  `fecha_finalizacion` date DEFAULT NULL,
  `motivo_finalizacion` enum('PARTO','VOLUNTAD_PACIENTE','OTROS') DEFAULT NULL,
  `motivo_otros` varchar(100) DEFAULT NULL,
  `fecha_inicio` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id_programadiagnostico`),
  KEY `FK_78f022686d5a15b68d075215cca` (`id_historialmedico`),
  CONSTRAINT `FK_78f022686d5a15b68d075215cca` FOREIGN KEY (`id_historialmedico`) REFERENCES `historial_medico` (`id_historialmedico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programa_diagnostico`
--

LOCK TABLES `programa_diagnostico` WRITE;
/*!40000 ALTER TABLE `programa_diagnostico` DISABLE KEYS */;
INSERT INTO `programa_diagnostico` VALUES ('PD00001','HM0001',1,'2025-11-11','Diabetes','ninguna','F','2025-11-04','PARTO',NULL,'2025-11-07 14:06:36.697530'),('PD00002','HM0002',1,NULL,NULL,NULL,'F','2025-11-28','PARTO',NULL,'2025-11-07 14:06:36.697530'),('PD00003','HM0003',2,'2025-11-20','nn','nn','A',NULL,NULL,NULL,'2025-11-07 14:06:36.697530'),('PD00004','HM0002',1,NULL,NULL,NULL,'F','2025-11-06','VOLUNTAD_PACIENTE',NULL,'2025-11-07 14:06:36.697530'),('PD00005','HM0002',1,NULL,NULL,NULL,'F','2025-11-06','VOLUNTAD_PACIENTE',NULL,'2025-11-07 14:06:36.697530'),('PD00006','HM0002',1,NULL,NULL,NULL,'F','2025-11-11','PARTO',NULL,'2025-11-07 14:06:36.697530'),('PD00007','HM0005',1,'2025-12-11',NULL,NULL,'A',NULL,NULL,NULL,'2025-11-07 19:59:29.672000'),('PD00008','HM0006',2,'2026-03-12','Diabetes 3',NULL,'F','2025-11-28','PARTO',NULL,'2025-11-12 02:42:34.919000');
/*!40000 ALTER TABLE `programa_diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programa_puerperio`
--

DROP TABLE IF EXISTS `programa_puerperio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa_puerperio` (
  `id_programapuerperio` char(7) NOT NULL,
  `id_historialmedico` char(6) NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `tipo_parto` enum('NATURAL','CESAREA') NOT NULL,
  `observacion` varchar(1000) DEFAULT NULL,
  `complicacion` varchar(500) DEFAULT NULL,
  `estado` enum('A','I','F') NOT NULL DEFAULT 'A',
  `fecha_finalizacion` date DEFAULT NULL,
  `motivo_otros` varchar(100) DEFAULT NULL,
  `motivo_finalizacion` enum('ALTA_MEDICA','VOLUNTAD_PACIENTE','OTROS') DEFAULT NULL,
  PRIMARY KEY (`id_programapuerperio`),
  KEY `FK_e5c172da2325441cd203d3f9a90` (`id_historialmedico`),
  CONSTRAINT `FK_e5c172da2325441cd203d3f9a90` FOREIGN KEY (`id_historialmedico`) REFERENCES `historial_medico` (`id_historialmedico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programa_puerperio`
--

LOCK TABLES `programa_puerperio` WRITE;
/*!40000 ALTER TABLE `programa_puerperio` DISABLE KEYS */;
INSERT INTO `programa_puerperio` VALUES ('PP00001','HM0001','2025-11-05 03:55:26.692247','NATURAL','Nada','postparto','A',NULL,NULL,NULL),('PP00002','HM0002','2025-11-12 04:58:09.095359','CESAREA','Parto con bebé de 6 meses','Hemorragia postparto','A',NULL,NULL,NULL),('PP00003','HM0006','2025-11-28 21:36:43.037404','NATURAL',NULL,NULL,'A',NULL,NULL,NULL);
/*!40000 ALTER TABLE `programa_puerperio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado_analisis`
--

DROP TABLE IF EXISTS `resultado_analisis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado_analisis` (
  `id_resultado_analisis` char(7) NOT NULL,
  `id_control_diagnostico` char(7) DEFAULT NULL,
  `id_control_puerperio` char(7) DEFAULT NULL,
  `id_analisis` char(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fecha_realizacion` date NOT NULL,
  `laboratorio` varchar(150) NOT NULL,
  `resultado` varchar(1000) NOT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `ruta_pdf` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_resultado_analisis`),
  KEY `FK_2ed0829abe6d25eaee5e1f7bd4b` (`id_control_diagnostico`),
  KEY `FK_249996fadc4b01051db04d61cd2` (`id_control_puerperio`),
  KEY `FK_8d7bea633278af46d9bcae852d2` (`id_analisis`),
  CONSTRAINT `FK_249996fadc4b01051db04d61cd2` FOREIGN KEY (`id_control_puerperio`) REFERENCES `control_puerperio` (`id_control_puerperio`),
  CONSTRAINT `FK_2ed0829abe6d25eaee5e1f7bd4b` FOREIGN KEY (`id_control_diagnostico`) REFERENCES `control_diagnostico` (`id_control_diagnostico`),
  CONSTRAINT `FK_8d7bea633278af46d9bcae852d2` FOREIGN KEY (`id_analisis`) REFERENCES `analisis` (`id_analisis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado_analisis`
--

LOCK TABLES `resultado_analisis` WRITE;
/*!40000 ALTER TABLE `resultado_analisis` DISABLE KEYS */;
INSERT INTO `resultado_analisis` VALUES ('DTA0001','CD00001',NULL,'AN0001','2025-11-09 16:03:07.359648','2025-11-09','Laboratorio Clínico XYZ','Glucosa: 99 mg/dL. (Valor actualizado)','Paciente reporta estar en ayunas. Se actualiza valor.',NULL),('DTA0002',NULL,'CP00038','AN0002','2025-11-10 18:14:51.056586','2025-11-05','Laboratorios Sant','dfdfd','fdfdfdfd','DTA0002-1762798599723-314079667.pdf'),('DTA0003',NULL,'CP00038','AN0007','2025-11-10 18:15:25.656975','2025-11-09','Laboratorios Sant','si','xdee','DTA0003-1762798527226-191440799.pdf'),('DTA0004','CD00014',NULL,'AN0007','2025-11-10 20:52:31.735443','2025-11-09','Laboratorios Sant','Todo correcto','Ninguna',NULL),('DTA0005','CD00014',NULL,'AN0005','2025-11-10 20:52:54.290047','2025-11-09','Laboratorios Sant','Negativo',NULL,NULL),('DTA0006','CD00014',NULL,'AN0003','2025-11-10 20:53:28.381151','2025-11-09','Laboratorios Sant','100 mg/dL',NULL,NULL),('DTA0007','CD00014',NULL,'AN0008','2025-11-10 20:55:23.804718','2025-11-09','Laboratorios Sant','Los resultados indican presencia de anticuerpos IgG contra el virus de la rubéola, lo que sugiere inmunidad previa (por vacunación o infección pasada).\nLa ausencia de anticuerpos IgM indica que no hay evidencia de infección reciente o activa.','Se recomienda correlacionar los resultados con la historia clínica y el estado de vacunación del paciente.',NULL),('DTA0008','CD00014',NULL,'AN0006','2025-11-10 20:55:54.128583','2025-11-09','Laboratorios Sant','Todo correcto',NULL,NULL),('DTA0009','CD00008',NULL,'AN0009','2025-11-11 23:48:01.889906','2025-11-08','Laboratorio SANNA','Orina con resultados aceptables.',NULL,'DTA0009-1762904882370-430095001.pdf'),('DTA0010',NULL,'CP00038','AN0012','2025-11-13 04:42:42.391799','2025-11-10','Laboratorios Santa Maria','si','no',NULL),('DTA0012',NULL,'CP00040','AN0003','2025-11-28 18:02:44.454304','2025-11-24','Laboratorio de SANNA','Hemoglobina baja pero no con índice alarmante','Comida rica en hierro','DTA0012-1764352965165-715441668.pdf');
/*!40000 ALTER TABLE `resultado_analisis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` char(6) NOT NULL,
  `dni` char(8) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `contrasena` varchar(64) NOT NULL,
  `rol` enum('Administrador','Obstetra') NOT NULL DEFAULT 'Obstetra',
  `estado` enum('A','I','F') NOT NULL DEFAULT 'A',
  `fecha_nacimiento` date NOT NULL,
  `correo_electronico` varchar(254) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `numero_colegiatura` varchar(20) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `IDX_d88d01a9aaf85b32b985061d36` (`dni`),
  UNIQUE KEY `IDX_656a48ae9eacaf9e820af18d24` (`correo_electronico`),
  UNIQUE KEY `IDX_ecaf8fb87951262b5c76e6ac89` (`numero_colegiatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('OB0001','72296663','Admin','Principal','adminpass','Administrador','A','1999-12-30','admin@correo.com','999888778','Av. Principal 123','123456'),('OB0002','72839463','juanita','lopez','1p8#LrTH','Obstetra','A','1994-05-16','sadsad@ejemplo.com','837453723','calle falsa 123','432123'),('OB0003','12345678','Sofía','Vergara','admin123','Administrador','A','2004-11-21','sofvergara@gmail.com','123456789','Av España 123','741852'),('OB0004','45678941','Naomi','Rodriguez','YTa@Iy7H','Obstetra','A','1990-07-09','naomirodriguez@gmai.com','456753951','Calle Colombia 446','123457'),('OB0005','45678949','Camila','Casas','NoS69$6J','Obstetra','A','1990-12-11','camilacasas@gmail.com','456741852','Av Larco #444','456783');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04 19:09:26
