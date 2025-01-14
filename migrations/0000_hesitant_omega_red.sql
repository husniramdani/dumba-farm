CREATE TABLE `ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gender` text DEFAULT 'FEMALE' NOT NULL,
	`buy_price` real NOT NULL,
	`weight` integer DEFAULT 0,
	`age` integer NOT NULL,
	`breed` text NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
