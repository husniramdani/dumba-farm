PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_history_ternak` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer NOT NULL,
	`weight` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_history_ternak`("id", "ternak_id", "weight", "notes", "created_at", "updated_at") SELECT "id", "ternak_id", "weight", "notes", "created_at", "updated_at" FROM `history_ternak`;--> statement-breakpoint
DROP TABLE `history_ternak`;--> statement-breakpoint
ALTER TABLE `__new_history_ternak` RENAME TO `history_ternak`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_keuangan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ternak_id` integer,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`ternak_id`) REFERENCES `ternak`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_keuangan`("id", "ternak_id", "type", "category", "amount", "description", "created_at", "updated_at") SELECT "id", "ternak_id", "type", "category", "amount", "description", "created_at", "updated_at" FROM `keuangan`;--> statement-breakpoint
DROP TABLE `keuangan`;--> statement-breakpoint
ALTER TABLE `__new_keuangan` RENAME TO `keuangan`;