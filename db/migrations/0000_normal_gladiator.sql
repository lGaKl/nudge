CREATE TABLE `task_instances` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`date` text NOT NULL,
	`completed_steps_json` text DEFAULT '[]' NOT NULL,
	`completed_at` integer,
	`skipped_at` integer,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`outcome` text NOT NULL,
	`steps_json` text NOT NULL,
	`recurrence_json` text,
	`scheduled_at` integer,
	`notify_at` integer,
	`music_query` text,
	`created_at` integer NOT NULL,
	`archived_at` integer
);
