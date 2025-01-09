CREATE TABLE `ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gender` text DEFAULT 'FEMALE' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
