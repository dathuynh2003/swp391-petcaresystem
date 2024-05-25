CREATE database pethealthcare;
use pethealthcare;

CREATE TABLE `User` 
	(
	user_id int NOT NULL AUTO_INCREMENT, 
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
	
CREATE TABLE Pet 
	(
	pet_id int(10) NOT NULL AUTO_INCREMENT, 
	customer_id int(10) NOT NULL, 
	name varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	pet_type varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	breed varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	gender varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	neutered bit(1), 
	dob date, 
	description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,  
	status bit(1), 
	PRIMARY KEY (pet_id)
	);
CREATE TABLE Booking 
	(
	booking_id int(10) NOT NULL AUTO_INCREMENT, 
	customer_id int(10) NOT NULL, 
	vs_id int(10) NOT NULL, 
	booking_date date, 
	appointment_date date, 
	status varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	total_amount double, 
	`type` bit(1), 
	rating varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	PRIMARY KEY (booking_id)
	);
CREATE TABLE Service 
	(
	service_id int(10) NOT NULL AUTO_INCREMENT, 
	service_name varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	price double, 
	PRIMARY KEY (service_id)
	);
CREATE TABLE Booking_Detail 
	(
	booking_detail_id int(10) NOT NULL AUTO_INCREMENT, 
	booking_id int(10) NOT NULL, 
	service_id int(10) NOT NULL, 
	quantity int(10), price double, 
	PRIMARY KEY (booking_detail_id)
	);
CREATE TABLE Vet_Shift_Detail 
	(
	vs_id int(10) NOT NULL AUTO_INCREMENT, 
	vet_id int(10) NOT NULL, 
	shift_id int(10) NOT NULL, 
	`date` date, 
	status varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	PRIMARY KEY (vs_id)
	);
CREATE TABLE Medical_Record 
	(
	medical_record_id int(10) NOT NULL AUTO_INCREMENT, 
	pet_id int(10) NOT NULL, 
	vet_id int(10) NOT NULL, 
	`date` date, 
	diagnosis varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	treatment varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	vet_note varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	vaccine varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	total_amount double, 	
	status int(1), 
	PRIMARY KEY (medical_record_id)
	);
CREATE TABLE Cage 
	(
	cage_id int(10) NOT NULL AUTO_INCREMENT, 
	staff_id int(10) NOT NULL, 
	status bit(1), 
	description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	PRIMARY KEY (cage_id)
	);
CREATE TABLE Hospitalization_Record 
	(
	hospitalization_id int(10) NOT NULL AUTO_INCREMENT, 
	pet_id int(10) NOT NULL, 
	cage_id int(10) NOT NULL, 
	vet_id int(10) NOT NULL, 
	from_time date, 
	to_time date, 
	total_amount double, 
	status int(1), 
	PRIMARY KEY (hospitalization_id)
	);
CREATE TABLE Summary_Data 
	(
	summary_id int(10) NOT NULL AUTO_INCREMENT, 
	`date` date, 
	total_amount double, 
	total_booking int(10), 
	total_user int(10), 
	PRIMARY KEY (summary_id)
	);
CREATE TABLE Shift 
	(
	shift_id int(10) NOT NULL AUTO_INCREMENT, 
	from_time varchar(10), 
	to_time varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	PRIMARY KEY (shift_id)
	);
CREATE TABLE Medicine 
	(
	medicine_id int(10) NOT NULL AUTO_INCREMENT, 
	name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	description varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	price double, 
	quantity int(10), 
	`type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	PRIMARY KEY (medicine_id)
	);
CREATE TABLE Prescription 
	(
	prescription_id int(10) NOT NULL AUTO_INCREMENT, 
	medical_record_id int(10) NOT NULL, 
	medicine_id int(10) NOT NULL, 
	dosage int(10), 
	frequency varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
	price double, 
	PRIMARY KEY (prescription_id)
	);
CREATE TABLE Hospitaization_Detail 
(
hospital_detail_id int(10) NOT NULL AUTO_INCREMENT, 
medicine_id int(10) NOT NULL, 
hospitalization_id int(10) NOT NULL, 
`time` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci, 
dosage int(10), 
frequency varchar(255), 
description varchar(255), 
price double, 
PRIMARY KEY (hospital_detail_id)
);
-- CREATE TABLE Payment (payment_id int(10) NOT NULL AUTO_INCREMENT, user_id int(10) NOT NULL, method varchar(255), amount double, `date` date, status varchar(50), booking_id int(10), hospitalization_id int(10), medical_history_id int(10), description varchar(255), PRIMARY KEY (payment_id));
ALTER TABLE Pet ADD CONSTRAINT FKPet470119 FOREIGN KEY (customer_id) REFERENCES `User` (user_id);
ALTER TABLE Booking_Detail ADD CONSTRAINT FKBooking_De488165 FOREIGN KEY (booking_id) REFERENCES Booking (booking_id);
ALTER TABLE Booking_Detail ADD CONSTRAINT FKBooking_De574465 FOREIGN KEY (service_id) REFERENCES Service (service_id);
ALTER TABLE Booking ADD CONSTRAINT FKBooking209068 FOREIGN KEY (customer_id) REFERENCES `User` (user_id);
ALTER TABLE Vet_Shift_Detail ADD CONSTRAINT FKVet_Shift_874102 FOREIGN KEY (vet_id) REFERENCES `User` (user_id);
ALTER TABLE Medical_Record ADD CONSTRAINT FKMedical_Re486305 FOREIGN KEY (pet_id) REFERENCES Pet (pet_id);
ALTER TABLE Hospitalization_Record ADD CONSTRAINT FKHospitaliz974505 FOREIGN KEY (pet_id) REFERENCES Pet (pet_id);
ALTER TABLE Hospitalization_Record ADD CONSTRAINT FKHospitaliz981190 FOREIGN KEY (cage_id) REFERENCES Cage (cage_id);
ALTER TABLE Cage ADD CONSTRAINT FKCage904378 FOREIGN KEY (staff_id) REFERENCES `User` (user_id);
ALTER TABLE Vet_Shift_Detail ADD CONSTRAINT FKVet_Shift_393811 FOREIGN KEY (shift_id) REFERENCES Shift (shift_id);
ALTER TABLE Booking ADD CONSTRAINT FKBooking374565 FOREIGN KEY (vs_id) REFERENCES Vet_Shift_Detail (vs_id);
ALTER TABLE Hospitalization_Record ADD CONSTRAINT FKHospitaliz111848 FOREIGN KEY (vet_id) REFERENCES `User` (user_id);
ALTER TABLE Prescription ADD CONSTRAINT FKPrescripti162502 FOREIGN KEY (medical_record_id) REFERENCES Medical_Record (medical_record_id);
ALTER TABLE Prescription ADD CONSTRAINT FKPrescripti917738 FOREIGN KEY (medicine_id) REFERENCES Medicine (medicine_id);
ALTER TABLE Hospitaization_Detail ADD CONSTRAINT FKHospitaiza195422 FOREIGN KEY (medicine_id) REFERENCES Medicine (medicine_id);
ALTER TABLE Hospitaization_Detail ADD CONSTRAINT FKHospitaiza247627 FOREIGN KEY (hospitalization_id) REFERENCES Hospitalization_Record (hospitalization_id);
-- ALTER TABLE Payment ADD CONSTRAINT FKPayment352697 FOREIGN KEY (user_id) REFERENCES `User` (user_id);
-- ALTER TABLE Payment ADD CONSTRAINT FKPayment809900 FOREIGN KEY (booking_id) REFERENCES Booking (booking_id);
-- ALTER TABLE Payment ADD CONSTRAINT FKPayment514964 FOREIGN KEY (hospitalization_id) REFERENCES Hospitalization_Record (hospitalization_id);
-- ALTER TABLE Payment ADD CONSTRAINT FKPayment326140 FOREIGN KEY (medical_history_id) REFERENCES Medical_Record (medical_record_id);
ALTER TABLE Medical_Record ADD CONSTRAINT FKMedical_Re600048 FOREIGN KEY (vet_id) REFERENCES `User` (user_id);
