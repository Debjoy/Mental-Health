-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 11, 2019 at 05:59 AM
-- Server version: 5.6.13
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `data`
--
CREATE DATABASE IF NOT EXISTS `data` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `data`;

-- --------------------------------------------------------

--
-- Table structure for table `chatinfo`
--

CREATE TABLE IF NOT EXISTS `chatinfo` (
  `chatid` int(32) NOT NULL AUTO_INCREMENT,
  `tidseen` tinyint(1) NOT NULL DEFAULT '1',
  `sidseen` tinyint(1) NOT NULL DEFAULT '0',
  `tid` int(32) NOT NULL,
  `sid` int(32) NOT NULL,
  `rand` varchar(20) NOT NULL,
  `timestamp` varchar(15) NOT NULL,
  `alias` varchar(20) NOT NULL,
  PRIMARY KEY (`chatid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `chatinfo`
--

INSERT INTO `chatinfo` (`chatid`, `tidseen`, `sidseen`, `tid`, `sid`, `rand`, `timestamp`, `alias`) VALUES
(1, 0, 0, 1, 1, '#444', '1560269426', ''),
(2, 0, 1, 2, 2, '#F52', '1566730264', ''),
(3, 0, 0, 1, 2, '#2B5', '1560269035', '');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `mid` int(32) NOT NULL AUTO_INCREMENT,
  `chatid` int(32) NOT NULL,
  `msgno` int(32) NOT NULL,
  `from` varchar(5) NOT NULL,
  `message` varchar(500) NOT NULL,
  PRIMARY KEY (`mid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`mid`, `chatid`, `msgno`, `from`, `message`) VALUES
(1, 2, 1, 'S', 'hello'),
(2, 1, 1, 'S', 'hi sir'),
(3, 1, 2, 'S', 'I would like to talk to you about something'),
(4, 2, 2, 'T', 'Yes what do you want to talk about?'),
(5, 3, 1, 'S', 'sir!'),
(6, 1, 3, 'T', 'Yes please go ahead...'),
(7, 3, 2, 'T', 'yes What do you want to talk about'),
(8, 1, 4, 'S', 'I''m not liking engineering at all'),
(9, 2, 3, 'S', 'I am not getting the hang of anything in college'),
(10, 3, 3, 'S', 'I just wanted to say that i am a fan of your teaching, you do great in class'),
(11, 1, 5, 'T', 'It''s Completely ok to feel that! i didn''t when i first joined college as a student'),
(12, 2, 4, 'T', 'Just hang yourself :)\r\njust kidding ask for help from your corresponding teachers...'),
(13, 2, 5, 'S', 'Sir, what are saying !! XD'),
(14, 2, 6, 'S', 'you are kidding right?'),
(15, 1, 6, 'S', 'thank you sir'),
(28, 1, 7, 'S', ':)'),
(29, 2, 7, 'T', 'yes of course!!... yes of course..'),
(30, 2, 8, 'T', '....');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `sid` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `regno` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `checksum` int(32) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`sid`, `name`, `pass`, `regno`, `email`, `contact`, `checksum`) VALUES
(1, 'Debjoy Bhowal', '123456789', '03/2017', 'testemailid@gmail.com', '9876543210', 38520021),
(2, 'Student Kumar', '123456789', '04/2018', 'someemailid@gmail.com', '7894561230', 19436443);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `tid` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `dept` varchar(10) NOT NULL,
  `checksum` int(32) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`tid`, `name`, `pass`, `email`, `contact`, `dept`, `checksum`) VALUES
(1, 'Steve Rogers', 'steverogers', 'steve@gmail.com', '123456789', 'CSE', 17751833),
(2, 'Tony Stark', 'iamironman', 'tony@gmail.com', '123456789', 'CSE', 56176402);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `daily_student` ON SCHEDULE EVERY 1 DAY STARTS '2019-05-01 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO Update student set checksum = CAST(RAND() * 100000000 AS UNSIGNED)$$

CREATE DEFINER=`root`@`localhost` EVENT `daily_teacher` ON SCHEDULE EVERY 1 DAY STARTS '2019-05-01 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO Update teacher set checksum = CAST(RAND() * 100000000 AS UNSIGNED)$$

DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
