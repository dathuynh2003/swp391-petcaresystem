CREATE database pethealthcare;
use pethealthcare;

CREATE TABLE `user` 
	(
	user_id bigint NOT NULL AUTO_INCREMENT, 
	email varchar(100) NOT NULL UNIQUE, 
	password varchar(20) NOT NULL, 
    full_name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, 
	phone_number varchar(15), 
    address VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	role_id int(1) NOT NULL, 
	avatar varchar(255), 
	gender varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	status bit(1), 
	dob date, 
	PRIMARY KEY (user_id)
	);