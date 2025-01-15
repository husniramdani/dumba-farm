CREATE TABLE `history_ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer NOT NULL,
	`weight` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `keuangan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `market_price` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`price` real NOT NULL,
	`source` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
