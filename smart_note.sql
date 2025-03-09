-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 09, 2025 lúc 04:08 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `smart_note`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` tinytext DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `color` varchar(20) DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `content` tinytext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `files`
--

CREATE TABLE `files` (
  `id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` tinytext NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `labels`
--

CREATE TABLE `labels` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(20) DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` tinytext DEFAULT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `color` varchar(20) DEFAULT 'default',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notes`
--

INSERT INTO `notes` (`id`, `user_id`, `title`, `content`, `is_pinned`, `color`, `created_at`, `updated_at`) VALUES
(3, 3, 'Học lập trình Java Spring Boot', 'Back end là mọi thứ mà người dùng không nhìn thấy và chứa các hoạt động phía sau xảy ra khi thực hiện bất kỳ hành động nào trên một website, ứng dụng. Một lập trình viên back end xây dựng và duy trì', 0, 'red', '2025-03-04 07:05:34', '2025-03-04 07:05:34'),
(4, 2, 'Chia công việc TKGD', '### **1. Thanh điều hướng (Header - Navigation Bar)**\r\n\r\n📍 **Vị trí:** Trên cùng trang web, hiển thị trên tất cả các trang.\r\n\r\n📍 **Chức năng:**\r\n\r\n- **Logo** (góc trái)\r\n- **Menu danh mục món ăn** (Pizza, Burger, Đồ ', 0, 'blue', '2025-03-04 07:06:19', '2025-03-04 15:23:03'),
(5, 2, 'Đồ Án Chuyên Ngành', '- Token izer\r\n- Word Embedding\r\n- Postional Encoding\r\n- Anttention\r\n- Residinal + Norm', 0, 'green', '2025-03-04 07:07:13', '2025-03-04 15:23:07'),
(6, 1, 'Used To ', '- Cấu trúc used to dạng khẳng định : S + used to + V_inf\r\n    \r\n    Ex:\r\n    \r\n    - **She used to dance ballet when she was a child.**\r\n    - **They used to travel to Europe every summer before the pandemic.**\r\n    - **He used to speak fluent F', 0, 'yellow', '2025-03-04 07:07:39', '2025-03-04 15:23:17'),
(7, 1, 'Smart Project - Ứng dụng ghi chú', '### **1. Không gian làm việc tối giản**\r\n\r\n- Giao diện tập trung vào **dự án cá nhân** thay vì dạng **wiki** như Notion.\r\n- **Bảng điều khiển (Dashboard)** đơn giản, chỉ hiển thị **các dự án quan trọng** thay v', 0, 'red', '2025-03-04 07:08:03', '2025-03-04 15:23:20'),
(8, 3, 'Lộ trình Spring boot + Microservices', 'Hiện nay kiến trúc Microservices đang là chủ đề được cộng đồng Developer vô cùng quan tâm. Bạn có thể tìm thấy khá nhiều tài nguyên giới thiệu và nói về tính chất cũng như lợi ích của Microservices tu', 0, 'red', '2025-03-04 07:09:50', '2025-03-04 15:23:22'),
(9, 2, 'Tôi test 2', 'đây là content\r\n', 0, 'red', '2025-03-04 07:10:06', '2025-03-04 15:23:24'),
(10, 2, 'Tiêu đề 4', 'content 5', 0, 'blue', '2025-03-04 07:10:28', '2025-03-04 15:23:27'),
(11, 2, 'title 5', 'contnt 5', 0, 'orange', '2025-03-04 08:06:03', '2025-03-04 15:23:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `note_features`
--

CREATE TABLE `note_features` (
  `id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `feature_data` tinytext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `note_labels`
--

CREATE TABLE `note_labels` (
  `id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `label_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `message` tinytext NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(1, 3, 'Còn 1 tiếng nữa là đến hạn task 1', 0, '2025-03-08 09:38:32'),
(2, 3, 'Còn 1 tiếng nữa là đến hạn task 2', 0, '2025-03-08 09:38:40');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `recent_notes`
--

CREATE TABLE `recent_notes` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `last_opened` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reminders`
--

CREATE TABLE `reminders` (
  `id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `remind_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shared_notes`
--

CREATE TABLE `shared_notes` (
  `id` bigint(20) NOT NULL,
  `note_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission` tinytext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` tinytext DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `status` tinytext DEFAULT NULL,
  `priority` tinytext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_notified` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `due_date`, `status`, `priority`, `created_at`, `updated_at`, `is_notified`) VALUES
(1, 1, 'Học tiếng Anh trong 30 ngày', 'Học grammar, vocabulary , làm bài tập cho từng cấu trúc ngữ pháp, luyện trên dictionary, luyện study4 and làm đề với mỗi part ...', '2025-03-31 20:50:05', 'Đang hoàn thành ', 'Trung Bình', '2025-03-04 13:51:53', '2025-03-04 16:19:49', 0),
(2, 3, 'Đồ Án Chuyên Ngành', 'Thực hiện dự án website cá nhân sử dụng React Typescript + Spring Boot trong 10 tuần', '2025-04-25 20:52:48', 'Đang hoàn thành', 'Cao', '2025-03-04 13:54:16', '2025-03-04 16:19:53', 0),
(3, 3, 'Làm Báo Cáo Chuyên Đề Seminar', 'Thực hiện nghiên cứu báo cáo về Neuron và network và nộp tiểu luận ở tuần 10', '2025-04-27 20:54:27', 'Chưa làm', 'Cao', '2025-03-04 13:55:49', '2025-03-04 16:19:55', 0),
(4, 3, 'Thiết Kế Giao Diện', 'Xây dựng  Cho Website Bán Đồ Ăn Nhanh bằng Figma với các chức năng cần thiết cho người dùng và tối ưu UI/UX', '2025-05-09 20:56:01', 'Đang hoàn thành', 'Thấp', '2025-03-04 13:57:37', '2025-03-04 16:19:57', 0),
(5, 3, 'test ', 'abcd', '2025-03-08 16:40:24', 'update', 'cao', '2025-03-04 16:32:24', '2025-03-08 08:51:21', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task_assignees`
--

CREATE TABLE `task_assignees` (
  `id` bigint(20) NOT NULL,
  `task_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `templates`
--

CREATE TABLE `templates` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content` tinytext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar_url` tinytext DEFAULT NULL,
  `provider` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `avatar_url`, `provider`) VALUES
(1, 'Nguyen Hoang Tuan', 'nguyenvana@gmail.com', '$2a$10$U837cixRAYLmwr3svhsUAOpxTQ.5HbSCoEMQ58BrOhN953KJjfFva', 'avatar', 'local'),
(2, 'Nguyen Van A', 'nguyenvanaa@gmail.com', '$2a$10$0zLnPXUdbM22y3NwRBk/2.WSu0JG0yiQSwnB9VINRN6m.wqWgJ8qu', 'avatar', 'local'),
(3, 'Nguyễn Hoàng Tuấn', 'nguyenhoangtuan12102003@gmail.com', 'default password google', 'abc', 'google');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `note_id` (`note_id`);

--
-- Chỉ mục cho bảng `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `note_features`
--
ALTER TABLE `note_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`);

--
-- Chỉ mục cho bảng `note_labels`
--
ALTER TABLE `note_labels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`),
  ADD KEY `label_id` (`label_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `recent_notes`
--
ALTER TABLE `recent_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`note_id`),
  ADD KEY `note_id` (`note_id`);

--
-- Chỉ mục cho bảng `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `shared_notes`
--
ALTER TABLE `shared_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_id` (`note_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `task_assignees`
--
ALTER TABLE `task_assignees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `files`
--
ALTER TABLE `files`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `labels`
--
ALTER TABLE `labels`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `note_features`
--
ALTER TABLE `note_features`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `note_labels`
--
ALTER TABLE `note_labels`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `recent_notes`
--
ALTER TABLE `recent_notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shared_notes`
--
ALTER TABLE `shared_notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `task_assignees`
--
ALTER TABLE `task_assignees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `templates`
--
ALTER TABLE `templates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `files_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `labels`
--
ALTER TABLE `labels`
  ADD CONSTRAINT `labels_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `note_features`
--
ALTER TABLE `note_features`
  ADD CONSTRAINT `note_features_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `note_labels`
--
ALTER TABLE `note_labels`
  ADD CONSTRAINT `note_labels_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `note_labels_ibfk_2` FOREIGN KEY (`label_id`) REFERENCES `labels` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `recent_notes`
--
ALTER TABLE `recent_notes`
  ADD CONSTRAINT `recent_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recent_notes_ibfk_2` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reminders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `shared_notes`
--
ALTER TABLE `shared_notes`
  ADD CONSTRAINT `shared_notes_ibfk_1` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shared_notes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `task_assignees`
--
ALTER TABLE `task_assignees`
  ADD CONSTRAINT `task_assignees_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_assignees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `templates`
--
ALTER TABLE `templates`
  ADD CONSTRAINT `templates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
