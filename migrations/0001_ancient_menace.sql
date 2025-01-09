ALTER TABLE `ternak` ALTER COLUMN "updated_at" TO "updated_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `ternak` ADD `buy_price` real NOT NULL;--> statement-breakpoint
ALTER TABLE `ternak` ADD `age` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `ternak` ADD `breed` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ternak` ADD `status` text DEFAULT 'AVAILABLE' NOT NULL;