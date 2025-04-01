-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               9.2.0 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for smart_note
CREATE DATABASE IF NOT EXISTS `smart_note` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_note`;

-- Dumping structure for table smart_note.calendar_events
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` tinytext COLLATE utf8mb4_general_ci,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.calendar_events: ~0 rows (approximately)

-- Dumping structure for table smart_note.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `note_id` bigint NOT NULL,
  `content` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `note_id` (`note_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.comments: ~1 rows (approximately)
REPLACE INTO `comments` (`id`, `user_id`, `note_id`, `content`, `created_at`) VALUES
	(13, 3, 3, ' @Nguyen Hoang Tuan  📄 Học lập trình Java Spring Boot ', '2025-03-23 07:23:01');

-- Dumping structure for table smart_note.files
CREATE TABLE IF NOT EXISTS `files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_url` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `files_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.files: ~0 rows (approximately)

-- Dumping structure for table smart_note.labels
CREATE TABLE IF NOT EXISTS `labels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `labels_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.labels: ~0 rows (approximately)

-- Dumping structure for table smart_note.notes
CREATE TABLE IF NOT EXISTS `notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` tinytext COLLATE utf8mb4_general_ci,
  `is_pinned` tinyint(1) DEFAULT '0',
  `color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.notes: ~42 rows (approximately)
REPLACE INTO `notes` (`id`, `user_id`, `title`, `content`, `is_pinned`, `color`, `created_at`, `updated_at`, `image_url`) VALUES
	(3, 3, 'Học lập trình Java Spring Boot', '', 0, '#ffffff', '2025-03-04 07:05:34', '2025-03-24 14:53:46', NULL),
	(4, 2, 'Chia công việc TKGD', '### **1. Thanh điều hướng (Header - Navigation Bar)**\r\n\r\n📍 **Vị trí:** Trên cùng trang web, hiển thị trên tất cả các trang.\r\n\r\n📍 **Chức năng:**\r\n\r\n- **Logo** (góc trái)\r\n- **Menu danh mục món ăn** (Pizza, Burger, Đồ ', 0, 'blue', '2025-03-04 07:06:19', '2025-03-04 15:23:03', NULL),
	(5, 2, 'Đồ Án Chuyên Ngành', '- Token izer\r\n- Word Embedding\r\n- Postional Encoding\r\n- Anttention\r\n- Residinal + Norm', 0, '#ffffff', '2025-03-04 07:07:13', '2025-03-24 11:01:37', NULL),
	(6, 1, 'Used To ', '- Cấu trúc used to dạng khẳng định : S + used to + V_inf\r\n    \r\n    Ex:\r\n    \r\n    - **She used to dance ballet when she was a child.**\r\n    - **They used to travel to Europe every summer before the pandemic.**\r\n    - **He used to speak fluent F', 0, '#ffffff', '2025-03-04 07:07:39', '2025-03-23 16:25:44', NULL),
	(7, 1, 'Smart Project - Ứng dụng ghi chú', '### **1. Không gian làm việc tối giản**\r\n\r\n- Giao diện tập trung vào **dự án cá nhân** thay vì dạng **wiki** như Notion.\r\n- **Bảng điều khiển (Dashboard)** đơn giản, chỉ hiển thị **các dự án quan trọng** thay v', 0, '#ffffff', '2025-03-04 07:08:03', '2025-03-23 16:38:19', NULL),
	(8, 3, 'My Note', 'This is a sample note', 0, '#FF5733', '2025-03-04 07:09:50', '2025-03-25 04:40:52', NULL),
	(9, 2, 'Tôi test 2', 'đây là content\r\n', 0, 'red', '2025-03-04 07:10:06', '2025-03-04 15:23:24', NULL),
	(10, 2, 'Tiêu đề 4', 'content 5', 0, 'blue', '2025-03-04 07:10:28', '2025-03-04 15:23:27', NULL),
	(11, 2, 'title 5', 'contnt 5', 0, 'orange', '2025-03-04 08:06:03', '2025-03-04 15:23:34', NULL),
	(12, 3, 'abcd', 'content 1', 0, 'red', '2025-03-12 09:25:29', '2025-03-16 05:18:56', NULL),
	(13, 3, 'abcd', 'content 1', 0, 'red', '2025-03-16 04:59:45', '2025-03-16 04:59:45', NULL),
	(14, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:06:49', '2025-03-24 11:39:35', NULL),
	(15, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:09:05', '2025-03-24 12:36:30', NULL),
	(16, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:09:24', '2025-03-16 06:09:24', NULL),
	(17, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:09:29', '2025-03-16 06:09:29', NULL),
	(18, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:09:36', '2025-03-16 06:09:36', NULL),
	(19, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:10:13', '2025-03-16 06:10:13', NULL),
	(20, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:10:54', '2025-03-16 06:10:54', NULL),
	(21, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:11:21', '2025-03-16 06:11:21', NULL),
	(22, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:11:39', '2025-03-16 06:11:39', NULL),
	(23, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:12:26', '2025-03-16 06:12:26', NULL),
	(24, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:12:31', '2025-03-16 06:12:31', NULL),
	(25, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:15:22', '2025-03-16 06:15:22', NULL),
	(26, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:15:59', '2025-03-16 06:15:59', NULL),
	(27, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:16:11', '2025-03-16 06:16:11', NULL),
	(28, 3, 'abcd', 'content 1', 0, 'red', '2025-03-16 06:17:14', '2025-03-16 06:17:14', NULL),
	(29, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:19:52', '2025-03-16 06:19:52', NULL),
	(30, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:19:55', '2025-03-16 06:19:55', NULL),
	(31, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:20:02', '2025-03-16 06:20:02', NULL),
	(32, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:20:06', '2025-03-16 06:20:06', NULL),
	(33, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:20:18', '2025-03-16 06:20:18', NULL),
	(34, 3, 'Untitled No', '', 0, '#ffffff', '2025-03-16 06:20:52', '2025-03-16 06:20:52', NULL),
	(35, 3, 'Untitled N', '', 0, '#ffffff', '2025-03-16 06:21:04', '2025-03-16 06:21:04', NULL),
	(36, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:21:32', '2025-03-16 06:21:32', NULL),
	(37, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:21:56', '2025-03-16 06:21:56', NULL),
	(38, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:22:22', '2025-03-16 06:22:22', NULL),
	(39, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-16 06:22:27', '2025-03-16 06:22:27', NULL),
	(40, 3, 'Học lập trình Java Spring Boot   ', 'Back end là mọi thứ mà người dùng không nhìn thấy và chứa các hoạt động phía sau xảy ra khi thực hiện bất kỳ hành động nào trên một website, ứng dụng. Một lập trình viên back end xây dựng và duy trì', 0, '#ffffff', '2025-03-16 06:23:28', '2025-03-16 06:58:48', NULL),
	(41, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-23 04:55:20', '2025-03-23 04:55:20', NULL),
	(42, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-23 04:55:36', '2025-03-23 04:55:36', NULL),
	(43, 3, 'Untitled Note', '', 0, '#ffffff', '2025-03-23 04:56:09', '2025-03-23 04:56:09', NULL),
	(44, 3, 'Note 23', 'abc', 0, '#ffffff', '2025-03-25 04:57:22', '2025-03-25 04:57:22', NULL);

-- Dumping structure for table smart_note.note_features
CREATE TABLE IF NOT EXISTS `note_features` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `feature_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `feature_data` tinytext COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`),
  CONSTRAINT `note_features_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.note_features: ~0 rows (approximately)

-- Dumping structure for table smart_note.note_images
CREATE TABLE IF NOT EXISTS `note_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `note_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4378ba8iyykqnk4cwgxsnqeu5` (`note_id`),
  CONSTRAINT `FK4378ba8iyykqnk4cwgxsnqeu5` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table smart_note.note_images: ~5 rows (approximately)
REPLACE INTO `note_images` (`id`, `image_url`, `note_id`) VALUES
	(9, '/uploads/images/e4ec5f99-da08-403e-8736-baa6c7cc50ec.jpg', 8),
	(10, '/uploads/images/2f6026c4-afdf-4eca-ba15-c464359d6ce0.png', 8),
	(11, '/uploads/images/57d01786-9bb8-4ad9-ba9f-92f5ae38b941.jpg', 8),
	(12, '/uploads/images/bff84f4c-a81f-4e37-8fc8-c138e8380fab.png', 44),
	(13, '/uploads/images/828db2a5-696c-4d59-8dd9-79ab532d2b32.png', 44);

-- Dumping structure for table smart_note.note_labels
CREATE TABLE IF NOT EXISTS `note_labels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `label_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`),
  KEY `label_id` (`label_id`),
  CONSTRAINT `note_labels_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `note_labels_ibfk_2` FOREIGN KEY (`label_id`) REFERENCES `labels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.note_labels: ~0 rows (approximately)

-- Dumping structure for table smart_note.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `message` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.notifications: ~9 rows (approximately)
REPLACE INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
	(1, 3, 'Còn 1 tiếng nữa là đến hạn task 1', 0, '2025-03-08 09:38:32'),
	(2, 3, 'Còn 1 tiếng nữa là đến hạn task 2', 0, '2025-03-08 09:38:40'),
	(3, 3, 'thông báo 3', 0, '2025-03-09 06:20:41'),
	(4, 3, 'Còn 1 tiếng nữa là đến hạn task: test ', 0, '2025-03-08 22:45:26'),
	(5, 3, 'Còn 1 tiếng nữa là đến hạn task: Học Spring Boot Kafla', 0, '2025-03-12 02:21:09'),
	(6, 3, 'Còn 1 tiếng nữa là đến hạn task: Học Spring Boot Cloud Api GateWay', 0, '2025-03-12 02:21:09'),
	(7, 3, 'Còn 1 tiếng nữa là đến hạn task: Học Spring Boot Cloud Api GateWay', 0, '2025-03-12 02:21:09'),
	(8, 3, 'Còn 1 tiếng nữa là đến hạn task: Học Spring Boot Cloud Api GateWay', 0, '2025-03-12 02:21:09'),
	(9, 3, 'Còn 1 tiếng nữa là đến hạn task: a', 0, '2025-03-12 02:21:09'),
	(10, 3, 'Còn 1 tiếng nữa là đến hạn task: a', 0, '2025-03-25 09:37:23');

-- Dumping structure for table smart_note.recent_notes
CREATE TABLE IF NOT EXISTS `recent_notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `note_id` bigint NOT NULL,
  `last_opened` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`note_id`),
  KEY `note_id` (`note_id`),
  CONSTRAINT `recent_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recent_notes_ibfk_2` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.recent_notes: ~8 rows (approximately)
REPLACE INTO `recent_notes` (`id`, `user_id`, `note_id`, `last_opened`) VALUES
	(3, 3, 8, '2025-03-23 16:28:32'),
	(4, 3, 3, '2025-03-27 06:09:50'),
	(5, 3, 5, '2025-03-24 10:52:20'),
	(6, 3, 7, '2025-03-24 13:04:52'),
	(7, 3, 4, '2025-03-24 10:52:16'),
	(8, 3, 14, '2025-03-24 11:01:52'),
	(9, 3, 15, '2025-03-24 12:12:59'),
	(10, 3, 44, '2025-03-27 06:10:08');

-- Dumping structure for table smart_note.reminders
CREATE TABLE IF NOT EXISTS `reminders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `remind_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reminders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.reminders: ~0 rows (approximately)

-- Dumping structure for table smart_note.shared_notes
CREATE TABLE IF NOT EXISTS `shared_notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `permission` tinytext COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `note_id` (`note_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shared_notes_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shared_notes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.shared_notes: ~0 rows (approximately)

-- Dumping structure for table smart_note.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` tinytext COLLATE utf8mb4_general_ci,
  `due_date` datetime DEFAULT NULL,
  `status` tinytext COLLATE utf8mb4_general_ci,
  `priority` tinytext COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_notified` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.tasks: ~28 rows (approximately)
REPLACE INTO `tasks` (`id`, `user_id`, `title`, `description`, `due_date`, `status`, `priority`, `created_at`, `updated_at`, `is_notified`) VALUES
	(1, 1, 'Học tiếng Anh trong 30 ngày', 'Học grammar, vocabulary , làm bài tập cho từng cấu trúc ngữ pháp, luyện trên dictionary, luyện study4 and làm đề với mỗi part ...', '2025-03-31 20:50:05', 'Đang hoàn thành ', 'Trung Bình', '2025-03-04 13:51:53', '2025-03-04 16:19:49', 0),
	(2, 3, 'Đồ Án Chuyên Ngành', 'Thực hiện dự án website cá nhân sử dụng React Typescript + Spring Boot trong 10 tuần', '2025-04-25 20:52:48', 'Đang hoàn thành', 'Cao', '2025-03-04 13:54:16', '2025-03-04 16:19:53', 0),
	(3, 3, 'Làm Báo Cáo Chuyên Đề Seminar', 'Thực hiện nghiên cứu báo cáo về Neuron và network và nộp tiểu luận ở tuần 10', '2025-04-27 20:54:27', 'Chưa làm', 'Cao', '2025-03-04 13:55:49', '2025-03-04 16:19:55', 0),
	(4, 3, 'Thiết Kế Giao Diện', 'Xây dựng  Cho Website Bán Đồ Ăn Nhanh bằng Figma với các chức năng cần thiết cho người dùng và tối ưu UI/UX', '2025-05-09 20:56:01', 'Đang hoàn thành', 'Thấp', '2025-03-04 13:57:37', '2025-03-04 16:19:57', 0),
	(5, 3, 'test ', 'abcd', '2025-03-08 16:40:24', 'update', 'cao', '2025-03-04 16:32:24', '2025-03-08 08:51:21', 1),
	(6, 3, 'test ', 'description 1', '2025-03-09 13:30:40', 'Đang hoàn thành', 'Thấp', '2025-03-09 05:41:25', '2025-03-09 05:41:44', 1),
	(7, 3, 'Thông báo 6', 'Mô tả 6', '2025-03-09 14:45:55', 'Đang hoàn thành', 'Cao', '2025-03-09 05:46:30', '2025-03-11 08:47:28', 0),
	(8, 3, 'Học Laravel trong 30 ngày', 'Laravel được phát triển mạnh mẽ từ năm 2011, hiện nay có trên 1.300.000 website .', NULL, 'Đang Hoàn Thành', 'Trung Bình', '2025-03-12 00:19:36', '2025-03-12 00:19:36', 0),
	(9, 3, 'Học Spring Boot Kafla', 'Học lý thuyết + thực hành và áp dụng vào dự án thực tế để chat trực với người khác và thông báo cho người dùng', '2025-03-12 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:44:56', '2025-03-12 00:44:56', 1),
	(10, 3, 'Học Spring Boot Cloud Api GateWay', 'Học lý thuyết + thực hành và áp dụng vào dự án thực tế để chat trực với người khác và thông báo cho người dùng', '2025-03-12 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:45:40', '2025-03-12 00:45:40', 1),
	(11, 3, 'Học Laravel trong 30 ngày', 'Laravel được phát triển mạnh mẽ từ năm 2011, hiện nay có trên 1.300.000 website .', NULL, 'Đang Hoàn Thành', 'Trung Bình', '2025-03-12 00:46:46', '2025-03-12 00:46:46', 0),
	(12, 3, 'Học Spring Boot Cloud Api GateWay', 'Học lý thuyết + thực hành và áp dụng vào dự án thực tế để chat trực với người khác và thông báo cho người dùng', '2025-03-12 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:46:52', '2025-03-12 00:46:52', 1),
	(13, 3, 'Học Spring Boot Cloud Api GateWay', 'Học lý thuyết + thực hành và áp dụng vào dự án thực tế để chat trực với người khác và thông báo cho người dùng', '2025-03-12 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:47:30', '2025-03-12 00:47:30', 1),
	(14, 3, 'a', 'a', '2025-03-13 17:00:00', 'Đang hoàn thành', 'Cao', '2025-03-12 00:51:51', '2025-03-12 00:51:51', 0),
	(15, 3, 'a', 'a', '2025-03-12 17:00:00', 'Đã hoàn thành', 'Trung bình', '2025-03-12 00:53:07', '2025-03-12 00:53:07', 1),
	(16, 3, 'a', 'a', '2025-03-19 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:56:40', '2025-03-12 00:56:40', 0),
	(17, 3, 'a', 'a', '2025-03-22 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 00:58:09', '2025-03-12 00:58:09', 0),
	(18, 3, 'a', 'a', '2025-03-22 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:00:51', '2025-03-12 01:00:51', 0),
	(19, 3, 'b', 'b', '2025-03-17 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:03:45', '2025-03-12 01:03:45', 0),
	(20, 3, 'b', 'b', '2025-03-21 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:04:23', '2025-03-12 01:04:23', 0),
	(21, 3, 'b', 'b', '2025-03-21 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:04:24', '2025-03-12 01:04:24', 0),
	(22, 3, 'a', 'aa', '2025-03-17 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:08:20', '2025-03-12 01:08:20', 0),
	(23, 3, 'a', 'a', '2025-03-17 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:08:28', '2025-03-12 01:08:28', 0),
	(24, 3, 'Tập thể dục mỗi ngày 30p trong vòng 6 tháng', 'Hít đất 100 cái + hít xà đơn 30 cái + chạy bộ 1km', '2025-06-26 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:15:41', '2025-03-12 01:15:41', 0),
	(25, 3, 'a', 'aa', '2025-06-26 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:16:57', '2025-03-12 01:16:57', 0),
	(26, 3, 'a', 'aa', '2025-03-26 17:00:00', 'Đang hoàn thành', 'Trung bình', '2025-03-12 01:17:36', '2025-03-12 01:17:36', 0),
	(27, 3, 'a', 'a', '2025-03-17 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:19:02', '2025-03-12 01:19:02', 0),
	(28, 3, 'a', 'a', '2025-03-25 17:00:00', 'Đang hoàn thành', 'Thấp', '2025-03-12 01:20:15', '2025-03-12 01:20:15', 1);

-- Dumping structure for table smart_note.task_assignees
CREATE TABLE IF NOT EXISTS `task_assignees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `task_assignees_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.task_assignees: ~0 rows (approximately)

-- Dumping structure for table smart_note.templates
CREATE TABLE IF NOT EXISTS `templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `templates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.templates: ~0 rows (approximately)

-- Dumping structure for table smart_note.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar_url` tinytext COLLATE utf8mb4_general_ci,
  `provider` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smart_note.users: ~3 rows (approximately)
REPLACE INTO `users` (`id`, `full_name`, `email`, `password`, `avatar_url`, `provider`) VALUES
	(1, 'Nguyen Hoang Tuan', 'nguyenvana@gmail.com', '$2a$10$U837cixRAYLmwr3svhsUAOpxTQ.5HbSCoEMQ58BrOhN953KJjfFva', 'avatar', 'local'),
	(2, 'Nguyen Van A', 'nguyenvanaa@gmail.com', '$2a$10$0zLnPXUdbM22y3NwRBk/2.WSu0JG0yiQSwnB9VINRN6m.wqWgJ8qu', 'avatar', 'local'),
	(3, 'Nguyễn Hoàng Tuấn', 'nguyenhoangtuan12102003@gmail.com', 'default password google', 'abc', 'google');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
