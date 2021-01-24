-- --------------------------------------------------------
-- Host:                         35.240.175.76
-- Server version:               8.0.20 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for sika
DROP DATABASE IF EXISTS `sika`;
CREATE DATABASE IF NOT EXISTS `sika` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sika`;

-- Dumping structure for procedure sika.createPemasukan
DROP PROCEDURE IF EXISTS `createPemasukan`;
DELIMITER //
CREATE PROCEDURE `createPemasukan`(
	IN `newJenisID` INT,
	IN `newNomorKas` CHAR(50),
	IN `newTanggal` DATETIME,
	IN `newNamaPenanggungJawab` VARCHAR(255),
	IN `newTotal` DOUBLE,
	IN `newJudul` VARCHAR(50),
	IN `newImageUrl` VARCHAR(255),
	IN `newKeterangan` VARCHAR(255)
)
BEGIN
	DECLARE latestTransaksiID INT DEFAULT 0;
	DECLARE latestSaldo DOUBLE DEFAULT 0;
	DECLARE newSaldo DOUBLE DEFAULT 0;
	DECLARE insertedID INT DEFAULT 0;
	
	SELECT
		saldoSekarang, ID INTO latestSaldo, latestTransaksiID
	FROM transaksi 
	order by ID DESC LIMIT 1;
	
	SET newSaldo = latestSaldo + newTotal;
	
	
	INSERT INTO transaksi
	SET
		transaksiLinkID = latestTransaksiID,
		nomorKas = newNomorKas,
		tanggal = newTanggal,
		saldoSebelum = latestSaldo,
		saldoSekarang = newSaldo,
		total = newTotal;
		
		
	SET insertedID = LAST_INSERT_ID();
	
	INSERT INTO pemasukan
	SET
		jenisID = newJenisID,
		nomorKas = newNomorKas,
		tanggal = newTanggal,
		jumlah = newTotal,
		transaksiID = insertedID,
		judul = newJudul,
		imageUrl = newImageUrl,
		keterangan = newKeterangan,
		namaPenanggungJawab = newNamaPenanggungJawab;
	
	UPDATE transaksi SET refID = LAST_INSERT_ID() WHERE ID = insertedID;
END//
DELIMITER ;

-- Dumping structure for procedure sika.createPengeluaran
DROP PROCEDURE IF EXISTS `createPengeluaran`;
DELIMITER //
CREATE PROCEDURE `createPengeluaran`(
	IN `newJenisID` INT,
	IN `newNomorKas` CHAR(50),
	IN `newTanggal` DATETIME,
	IN `newNamaPenanggungJawab` VARCHAR(255),
	IN `newTotal` DOUBLE,
	IN `newJudul` VARCHAR(50),
	IN `newImageUrl` VARCHAR(255),
	IN `newKeterangan` VARCHAR(255)
)
BEGIN
	DECLARE latestTransaksiID INT DEFAULT 0;
	DECLARE latestSaldo DOUBLE DEFAULT 0;
	DECLARE newSaldo DOUBLE DEFAULT 0;
	DECLARE insertedID INT DEFAULT 0;
	
	SELECT
		saldoSekarang, ID INTO latestSaldo, latestTransaksiID
	FROM transaksi 
	order by ID DESC LIMIT 1;
	
	SET newSaldo = latestSaldo - newTotal;
	
	
	INSERT INTO transaksi
	SET
		transaksiLinkID = latestTransaksiID,
		nomorKas = newNomorKas,
		tanggal = newTanggal,
		saldoSebelum = latestSaldo,
		saldoSekarang = newSaldo,
		total = newTotal;
		
		
	SET insertedID = LAST_INSERT_ID();
	
	INSERT INTO pengeluaran
	SET
		jenisID = newJenisID,
		nomorKas = newNomorKas,
		tanggal = newTanggal,
		jumlah = newTotal,
		transaksiID = insertedID,
		judul = newJudul,
		imageUrl = newImageUrl,
		keterangan = newKeterangan,
		namaPenanggungJawab = newNamaPenanggungJawab;
	
	UPDATE transaksi SET refID = LAST_INSERT_ID() WHERE ID = insertedID;
END//
DELIMITER ;

-- Dumping structure for table sika.jenis
DROP TABLE IF EXISTS `jenis`;
CREATE TABLE IF NOT EXISTS `jenis` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `tipe` char(2) NOT NULL DEFAULT 'I',
  `nama` varchar(255) DEFAULT NULL,
  `isDeleted` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sika.pemasukan
DROP TABLE IF EXISTS `pemasukan`;
CREATE TABLE IF NOT EXISTS `pemasukan` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `jenisID` int NOT NULL,
  `transaksiID` int DEFAULT NULL,
  `nomorKas` char(16) NOT NULL,
  `tanggal` datetime NOT NULL,
  `namaPenanggungJawab` varchar(255) NOT NULL DEFAULT '',
  `judul` varchar(255) NOT NULL DEFAULT '',
  `imageUrl` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) NOT NULL DEFAULT '',
  `jumlah` double(30,0) NOT NULL DEFAULT '0',
  `isDeleted` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK__jenis` (`jenisID`) USING BTREE,
  KEY `FK__Transaksi` (`transaksiID`) USING BTREE,
  CONSTRAINT `FK_pemasukan_jenis` FOREIGN KEY (`jenisID`) REFERENCES `jenis` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sika.pengeluaran
DROP TABLE IF EXISTS `pengeluaran`;
CREATE TABLE IF NOT EXISTS `pengeluaran` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `jenisID` int NOT NULL,
  `transaksiID` int DEFAULT NULL,
  `nomorKas` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggal` datetime NOT NULL,
  `namaPenanggungJawab` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `imageUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `keterangan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `jumlah` double(30,0) NOT NULL DEFAULT '0',
  `isDeleted` char(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`) USING BTREE,
  KEY `FK__jenis` (`jenisID`) USING BTREE,
  KEY `FK__Transaksi` (`transaksiID`) USING BTREE,
  CONSTRAINT `pengeluaran_ibfk_1` FOREIGN KEY (`jenisID`) REFERENCES `jenis` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table sika.transaksi
DROP TABLE IF EXISTS `transaksi`;
CREATE TABLE IF NOT EXISTS `transaksi` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `refID` int DEFAULT NULL,
  `nomorKas` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tanggal` datetime NOT NULL,
  `total` double(30,0) NOT NULL DEFAULT '0',
  `isDeleted` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sika.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL DEFAULT '',
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `createdDate` varchar(255) NOT NULL DEFAULT '',
  `isDeleted` char(1) NOT NULL DEFAULT '0',
  `refreshToken` varchar(255) DEFAULT NULL,
  `refreshTokenExpires` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
