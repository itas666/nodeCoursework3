-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2022 at 04:33 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cw3`
--
CREATE DATABASE IF NOT EXISTS `cw3` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cw3`;

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `articleId` int(11) NOT NULL AUTO_INCREMENT,
  `articleTitle` varchar(255) NOT NULL,
  `articleCreatedDate` datetime DEFAULT NULL,
  `articleModifiedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `personId` int(11) DEFAULT NULL,
  `articleShortText` text DEFAULT NULL,
  `articleLongText` text DEFAULT NULL,
  PRIMARY KEY (`articleId`),
  KEY `FK_person_article` (`personId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`articleId`, `articleTitle`, `articleCreatedDate`, `articleModifiedDate`, `personId`, `articleShortText`, `articleLongText`) VALUES
(1, 'Criminal and civil investigations opened into P&O Ferries after it sacked 786 employees', '0000-00-00 00:00:00', '2022-04-01 14:31:17', NULL, 'The government\'s business misconduct watchdog has launched criminal and civil probes into P&O Ferries, adding to pressure on the embattled company.\r\n\r\n', 'The move comes two weeks after P&O Ferries sacked nearly 800 workers and replaced them with lower-paid crew, a decision that the government called illegal.\r\n\r\nBusiness Secretary Kwasi Kwarteng confirmed on Friday afternoon that the Insolvency Service had decided to launch a formal investigation into \"the circumstances surrounding the recent redundancies made by P&O Ferries\".\r\n\r\nSky News understands that the Insolvency Service investigation is on the grounds that it failed to consult workers and unions and didn’t notify the Secretary of State before making the decision. It is also looking into concerns about the conduct of P&O’s directors.\r\n\r\nA government spokesperson said: \"Today the Insolvency Service has confirmed it has commenced formal criminal and civil investigations into the circumstances surrounding the recent appalling behaviour of P&O Ferries.\"\r\n\r\nMr Kwarteng wrote to the Insolvency Service on 23rd March, asking the watchdog to undertake an \"urgent and thorough enquiry\" into P&O\'s mass layoffs, to \"determine whether the law has been complied with and consider prompt and appropriate action where it has not.\"\r\n\r\nThe Insolvency Service responded to Mr Kwarteng, informing him that following an enquiry, it had decided to press ahead with a criminal and civil investigation.\r\n\r\nThis week, the government launched a full-throated attack on the company, insisting that it would have \"little choice\" but to reverse its decision.\r\n\r\nIn a letter to company boss Peter Hebblethwaite made public on Monday, transport secretary Grant Shapps said proposals being brought to parliament would \"block the outcome that P&O Ferries has pursued, including paying workers less than the minimum wage.\"\r\n\r\nHe said this would leave P&O \"one further opportunity\" to offer all 800 workers their jobs back on previous terms, conditions and wages - if they want them back. P&O declined the opportunity a day later, saying it was standing by its decision.\r\n\r\nIn Mr Shapps\' letter to the company\'s boss, he wrote: \"The past week has left the reputation of P&O Ferries and, I\'m afraid, you personally in tatters.\"\r\n\r\n\"There is no excuse for this behaviour, and as I said publicly on Friday, I believe your position as chief executive, and indeed as a company director, has become untenable,\" he added.\r\n\r\nThe company\'s woes continued on Tuesday when a second P&O ferry, the Pride of Kent, was detained after it failed safety checks by authorities.\r\n\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `personId` int(11) NOT NULL,
  `articleId` int(11) NOT NULL,
  `createdDate` datetime NOT NULL,
  `commentText` text DEFAULT NULL,
  `modifiedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`personId`,`articleId`,`createdDate`),
  KEY `FK_article_comment` (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`personId`, `articleId`, `createdDate`, `commentText`, `modifiedDate`) VALUES
(1, 1, '2022-04-01 06:22:21', 'Wow, incredible this thieves', '2022-04-01 14:32:08');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `personId` int(11) NOT NULL AUTO_INCREMENT,
  `personFullName` varchar(255) NOT NULL,
  `personPassword` varchar(255) NOT NULL,
  `personEmail` varchar(255) NOT NULL,
  `personCreatedDate` date NOT NULL,
  `personTypeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`personId`),
  KEY `FK_personType_person` (`personTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`personId`, `personFullName`, `personPassword`, `personEmail`, `personCreatedDate`, `personTypeId`) VALUES
(1, 'Administrator', '1234', 'admin', '2022-04-01', 1);

-- --------------------------------------------------------

--
-- Table structure for table `persontype`
--

DROP TABLE IF EXISTS `persontype`;
CREATE TABLE IF NOT EXISTS `persontype` (
  `personTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`personTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `persontype`
--

INSERT INTO `persontype` (`personTypeId`, `description`) VALUES
(1, 'Admins'),
(2, 'Guests');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `FK_person_article` FOREIGN KEY (`personId`) REFERENCES `person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_article_comment` FOREIGN KEY (`articleId`) REFERENCES `article` (`articleId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_person_comment` FOREIGN KEY (`personId`) REFERENCES `person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `FK_personType_person` FOREIGN KEY (`personTypeId`) REFERENCES `persontype` (`personTypeId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
