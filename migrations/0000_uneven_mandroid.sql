CREATE TABLE `history_ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer NOT NULL,
	`weight` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `keuangan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `market_price` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`price` real NOT NULL,
	`source` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gender` text DEFAULT 'FEMALE' NOT NULL,
	`buy_price` real NOT NULL,
	`weight` integer DEFAULT 0 NOT NULL,
	`age` integer NOT NULL,
	`breed` text NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
