-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: yofer
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `asignaciones_subtareas`
--

DROP TABLE IF EXISTS `asignaciones_subtareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaciones_subtareas` (
  `id_asignacion_subtarea` int NOT NULL AUTO_INCREMENT,
  `id_subtarea` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_asignacion_subtarea`),
  UNIQUE KEY `unique_subtarea_usuario` (`id_subtarea`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `asignaciones_subtareas_ibfk_1` FOREIGN KEY (`id_subtarea`) REFERENCES `subtareas` (`id_subtarea`),
  CONSTRAINT `asignaciones_subtareas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaciones_subtareas`
--

LOCK TABLES `asignaciones_subtareas` WRITE;
/*!40000 ALTER TABLE `asignaciones_subtareas` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignaciones_subtareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignaciones_tareas`
--

DROP TABLE IF EXISTS `asignaciones_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaciones_tareas` (
  `id_asignacion_tarea` int NOT NULL AUTO_INCREMENT,
  `id_tarea` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_asignacion_tarea`),
  UNIQUE KEY `unique_tarea_usuario` (`id_tarea`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `asignaciones_tareas_ibfk_1` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`),
  CONSTRAINT `asignaciones_tareas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaciones_tareas`
--

LOCK TABLES `asignaciones_tareas` WRITE;
/*!40000 ALTER TABLE `asignaciones_tareas` DISABLE KEYS */;
INSERT INTO `asignaciones_tareas` VALUES (6,7,8),(7,8,8),(8,9,8),(9,10,8),(10,11,8);
/*!40000 ALTER TABLE `asignaciones_tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correos`
--

DROP TABLE IF EXISTS `correos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correos` (
  `id_correo` int NOT NULL AUTO_INCREMENT,
  `id_destinatario` int NOT NULL,
  `id_remitente` int NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `cuerpo` text NOT NULL,
  `fecha_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_correo`),
  KEY `id_destinatario` (`id_destinatario`),
  KEY `id_remitente` (`id_remitente`),
  CONSTRAINT `correos_ibfk_1` FOREIGN KEY (`id_destinatario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `correos_ibfk_2` FOREIGN KEY (`id_remitente`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correos`
--

LOCK TABLES `correos` WRITE;
/*!40000 ALTER TABLE `correos` DISABLE KEYS */;
INSERT INTO `correos` VALUES (1,10,10,'HOLA','HOLA','2025-06-03 19:47:48'),(2,10,10,'HOLA','HOLA','2025-06-03 19:47:48'),(3,10,10,'HOLA23213','HOALSDAS123','2025-06-03 19:49:21'),(4,10,10,'HOLA23213','HOALSDAS123','2025-06-03 19:49:21'),(5,11,10,'HOLADASDASDASD','GAKSDMASJDMASD','2025-06-03 19:51:05'),(6,11,10,'HOLADASDASDASD','GAKSDMASJDMASD','2025-06-03 19:51:05'),(7,8,10,'hola123','holas123','2025-06-03 19:56:03'),(8,8,10,'hola123','holas123','2025-06-03 19:56:04'),(9,12,10,'agasda','asdadas','2025-06-03 20:00:07'),(10,12,10,'agasda','asdadas','2025-06-03 20:00:07'),(11,11,10,'prueba correo','prueba','2025-06-04 21:15:00');
/*!40000 ALTER TABLE `correos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `mensaje` text NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `leida` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (6,12,'Has recibido un correo de mariafernandacabarico@ufps.edu.co el 3 jun 2025, 20:00','email','2025-06-03 20:00:07',0),(7,12,'Has recibido un correo de mariafernandacabarico@ufps.edu.co el 3 jun 2025, 20:00','email','2025-06-03 20:00:08',0),(8,11,'Has recibido un correo de mariafernandacabarico@ufps.edu.co el 4 jun 2025, 16:14','email','2025-06-04 21:15:00',1);
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyectos` (
  `id_proyecto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_proyecto`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `proyectos_chk_1` CHECK ((`estado` in (_utf8mb3'Abierto',_utf8mb3'En Progreso',_utf8mb3'Completado',_utf8mb3'Archivado',_utf8mb3'Pausado')))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (1,'Sistema de gestión','Sistema de gestión interna','2025-04-01','2025-06-01','En Progreso',10,'2025-04-15 17:09:17','2025-04-15 17:09:17'),(2,'VentasTRACK','Plataforma de ventas','2025-03-15','2025-05-20','Abierto',10,'2025-04-15 17:09:17','2025-06-04 04:02:46'),(3,'ReservasPRO','App móvil de reservas','2025-02-01','2025-04-30','Pausado',10,'2025-04-15 17:09:17','2025-04-15 17:09:17'),(4,'NominasPLUS','Sistema de nómina','2025-01-01','2025-03-01','Completado',10,'2025-04-15 17:09:17','2025-04-15 17:09:17'),(5,'ClientCRM','CRM para clientes','2025-04-10','2025-07-10','Abierto',10,'2025-04-15 17:09:17','2025-04-15 17:09:17'),(6,'Prueba editar proyecto','hola111','2025-05-20','2025-06-21','Pausado',10,'2025-05-20 06:14:09','2025-06-04 20:25:09'),(7,'Manejo de Inventario','','2025-05-20','2025-05-20','Abierto',10,'2025-05-20 06:41:05','2025-05-20 06:41:05'),(8,'GestionProyecto','abierto','2025-05-20','2025-06-01','Abierto',10,'2025-05-20 13:11:13','2025-05-20 13:11:13'),(9,'nomina','realizar nomina','2025-05-20','2025-07-20','Abierto',10,'2025-05-20 13:55:30','2025-05-20 13:55:30'),(11,'Proyecto de ejemplo','presentacion para ayd','2025-06-04','2025-07-23','En Progreso',10,'2025-06-04 21:11:45','2025-06-04 21:11:45');
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_tiempo_tareas`
--

DROP TABLE IF EXISTS `registro_tiempo_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_tiempo_tareas` (
  `id_registro_tiempo` int NOT NULL AUTO_INCREMENT,
  `id_tarea` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `tiempo_inicio` datetime DEFAULT NULL,
  `tiempo_fin` datetime DEFAULT NULL,
  `fecha_registro` date DEFAULT (curdate()),
  `notas` text,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_registro_tiempo`),
  KEY `id_tarea` (`id_tarea`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `registro_tiempo_tareas_ibfk_1` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`),
  CONSTRAINT `registro_tiempo_tareas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_tiempo_tareas`
--

LOCK TABLES `registro_tiempo_tareas` WRITE;
/*!40000 ALTER TABLE `registro_tiempo_tareas` DISABLE KEYS */;
INSERT INTO `registro_tiempo_tareas` VALUES (6,16,8,'2025-05-19 09:00:00','2025-05-19 10:00:00','2025-05-19','holaaa','2025-05-19 17:55:01');
/*!40000 ALTER TABLE `registro_tiempo_tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtareas`
--

DROP TABLE IF EXISTS `subtareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subtareas` (
  `id_subtarea` int NOT NULL AUTO_INCREMENT,
  `id_tarea` int DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `texto` text,
  `completada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_subtarea`),
  KEY `id_tarea` (`id_tarea`),
  CONSTRAINT `subtareas_ibfk_1` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtareas`
--

LOCK TABLES `subtareas` WRITE;
/*!40000 ALTER TABLE `subtareas` DISABLE KEYS */;
INSERT INTO `subtareas` VALUES (6,16,'task1','task1',0),(7,16,'hola','hola1',0),(8,11,'Subtarea1','Pendiente',0),(9,18,'Investigar integración con Google Calen','',1),(10,20,'NN','',1),(11,19,'aprobar proyecto','revisar cada documento',1),(12,21,'Roles','Comprobacion de los roles de los usuarios',0),(13,22,'validar JWT','validacion',1);
/*!40000 ALTER TABLE `subtareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `id_proyecto` int DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `prioridad` varchar(10) DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoria` varchar(100) DEFAULT NULL,
  `solicitud_revision` tinyint(1) DEFAULT '0',
  `calificacion_revision` int DEFAULT NULL,
  `completada` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_tarea`),
  KEY `id_proyecto` (`id_proyecto`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`),
  CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `tareas_chk_1` CHECK (((`calificacion_revision` >= 0) and (`calificacion_revision` <= 100))),
  CONSTRAINT `tareas_chk_2` CHECK ((`estado` in (_utf8mb3'Por Hacer',_utf8mb3'En Progreso',_utf8mb3'Completada',_utf8mb3'Bloqueada'))),
  CONSTRAINT `tareas_chk_3` CHECK ((`prioridad` in (_utf8mb3'Alta',_utf8mb3'Media',_utf8mb3'Baja')))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (7,1,'Tarea 1','Tarea de prueba 1',NULL,NULL,'En Progreso','Alta',8,'2025-05-19 11:45:48','2025-05-20 02:14:38',NULL,0,NULL,0),(8,2,'Tarea 2','Tarea de prueba 2',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 11:45:49','2025-05-19 11:45:49',NULL,0,NULL,0),(9,3,'Tarea 3','Tarea de prueba 3',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 11:45:49','2025-05-19 11:45:49',NULL,0,NULL,0),(10,4,'Tarea 4','Tarea de prueba 4',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 11:45:50','2025-05-19 11:45:50',NULL,0,NULL,0),(11,5,'Tarea 5','Tarea de prueba 5',NULL,NULL,'Por Hacer','Baja',8,'2025-05-19 11:45:50','2025-05-20 01:59:16',NULL,0,NULL,0),(12,1,'Tarea 6','Tarea de prueba 6',NULL,NULL,'En Progreso','Alta',8,'2025-05-19 12:16:26','2025-05-19 16:28:12',NULL,0,NULL,0),(13,2,'Tarea 7','Tarea de prueba 7',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 12:16:27','2025-05-19 12:16:27',NULL,0,NULL,0),(14,3,'Tarea 8','Tarea de prueba 8',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 12:16:27','2025-05-19 12:16:27',NULL,0,NULL,0),(15,4,'Tarea 9','Tarea de prueba 9',NULL,NULL,'Por Hacer','Alta',8,'2025-05-19 12:16:28','2025-05-19 12:16:28',NULL,0,NULL,0),(16,1,'Tareadepruebacreada','holaaaa','2025-05-20','2025-05-22','En Progreso','Media',8,'2025-05-19 15:02:28','2025-05-19 16:43:42','prueba',0,NULL,0),(17,2,'Holaaaatareaventas','asdasdasdasd','2025-05-21','2025-05-21','Por Hacer','Media',8,'2025-05-19 17:13:53','2025-06-04 03:58:45','Pruebanadamas',0,NULL,0),(18,1,'Diseñar la interfaz del módulo de reportes','','2025-05-21','2025-05-23','Por Hacer','Alta',10,'2025-05-20 10:48:53','2025-05-20 10:48:53','',0,NULL,0),(19,8,'req','hacerkas','2025-05-21','2025-05-22','Por Hacer','Media',10,'2025-05-20 13:35:08','2025-05-20 13:35:08','vualla',0,NULL,0),(20,9,'Diseñar formulario de registro de empleados','Pendiente','2025-06-12','2025-09-12','Por Hacer','Alta',10,'2025-05-20 13:56:44','2025-05-20 13:57:04','empleados',0,NULL,0),(21,6,'Realizar el Log In','Se debe implementar el login con JWT y OAuth2','2025-06-05','2025-06-10','Por Hacer','Alta',8,'2025-06-04 04:07:56','2025-06-04 04:07:56','Autenticacion',0,NULL,0),(22,11,'Realizar el Log In','realizar las respectivas validaciones','2025-06-05','2025-06-11','En Progreso','Media',10,'2025-06-04 21:13:16','2025-06-04 21:13:16','Autenticacion',0,NULL,0);
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `segundo_apellido` varchar(50) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `posicion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`),
  CONSTRAINT `usuarios_chk_1` CHECK ((`rol` in (_utf8mb3'Administrador',_utf8mb3'Líder de Proyecto',_utf8mb3'Empleado',_utf8mb3'Cliente')))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (8,'nicolasrodriguez','yofernicolasmc@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','Nicolas','Rodriguez','Perez','Perez','Empleado','2025-05-19 00:30:44',NULL),(10,'mfcabarico','mariafernandacabarico@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','Maria','Cabarico','Fernanda','Perez','Administrador','2025-05-19 10:41:09',NULL),(11,'danielstiven','danielstiven@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','Daniel','Stiven','Perez','Perez','Líder de Proyecto','2025-05-19 10:41:12',NULL),(12,'cliente','cliente@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','Andrés','Salarriaga','Hernandez','Hernandez','Cliente','2025-05-19 10:41:16',NULL),(15,'hola1','hola@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','hola','hola','hola','hola','Empleado','2025-05-20 07:06:15','Frontend'),(16,'Pilarayd','pilarayd@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','Pilar','Rodriguez','Maria','Tenjo','Líder de Proyecto','2025-05-20 13:54:38',NULL),(17,'hola','holacontexto@ufps.edu.co','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','hola','hola','hola','hola','Empleado','2025-05-20 15:47:54','hola'),(18,'holacomoestas','holacomoestas@gmail.com','$2b$10$l22KP3jnHVL5btIQmnMksu27UUySstkFjQ9molVz3HvYbl16Ajzhy','prueba1','prueba2','hola','comoestas','Empleado','2025-09-19 06:51:45','backend');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_proyectos`
--

DROP TABLE IF EXISTS `usuarios_proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_proyectos` (
  `id_usuario_proyecto` int NOT NULL AUTO_INCREMENT,
  `id_proyecto` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `rol_en_proyecto` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_usuario_proyecto`),
  UNIQUE KEY `unique_proyecto_usuario` (`id_proyecto`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `usuarios_proyectos_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`),
  CONSTRAINT `usuarios_proyectos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `usuarios_proyectos_chk_1` CHECK ((`rol_en_proyecto` in (_utf8mb3'Administrador',_utf8mb3'Líder de Proyecto',_utf8mb3'Empleado',_utf8mb3'Cliente')))
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_proyectos`
--

LOCK TABLES `usuarios_proyectos` WRITE;
/*!40000 ALTER TABLE `usuarios_proyectos` DISABLE KEYS */;
INSERT INTO `usuarios_proyectos` VALUES (6,1,8,'Empleado'),(7,1,10,'Administrador'),(8,1,11,'Líder de Proyecto'),(9,1,12,'Cliente'),(10,2,8,'Empleado'),(11,2,10,'Administrador'),(12,2,11,'Líder de Proyecto'),(13,2,12,'Cliente'),(14,3,8,'Empleado'),(15,3,10,'Administrador'),(16,3,11,'Líder de Proyecto'),(17,3,12,'Cliente'),(18,4,8,'Empleado'),(19,4,10,'Administrador'),(20,4,11,'Líder de Proyecto'),(21,4,12,'Cliente'),(22,5,8,'Empleado'),(23,5,10,'Administrador'),(24,5,11,'Líder de Proyecto'),(25,5,12,'Cliente'),(26,1,15,'Empleado'),(27,6,11,'Empleado'),(28,6,12,'Líder de Proyecto'),(29,8,11,'Líder de Proyecto'),(30,8,8,'Empleado'),(31,9,15,'Líder de Proyecto'),(32,6,8,'Cliente'),(33,11,8,'Empleado'),(34,11,11,'Líder de Proyecto');
/*!40000 ALTER TABLE `usuarios_proyectos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-26 14:02:57
