CREATE TABLE `gallery_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`captionEn` varchar(512),
	`captionDe` varchar(512),
	`altEn` varchar(512),
	`altDe` varchar(512),
	`category` enum('concert','portrait','album','tour','other') NOT NULL DEFAULT 'concert',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `musicians` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(256) NOT NULL,
	`nameDe` varchar(256) NOT NULL,
	`roleEn` varchar(256) NOT NULL,
	`roleDe` varchar(256) NOT NULL,
	`bioEn` text NOT NULL,
	`bioDe` text NOT NULL,
	`imageUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `musicians_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `press_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicationEn` varchar(256) NOT NULL,
	`publicationDe` varchar(256) NOT NULL,
	`reviewerEn` varchar(256),
	`reviewerDe` varchar(256),
	`quoteEn` text NOT NULL,
	`quoteDe` text NOT NULL,
	`dateEn` varchar(64),
	`dateDe` varchar(64),
	`rating` int DEFAULT 0,
	`sourceUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `press_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `raga_descriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ragaName` varchar(256) NOT NULL,
	`trackTitleEn` varchar(256) NOT NULL,
	`trackTitleDe` varchar(256) NOT NULL,
	`descriptionEn` text NOT NULL,
	`descriptionDe` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raga_descriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(128) NOT NULL,
	`labelEn` varchar(256) NOT NULL,
	`labelDe` varchar(256) NOT NULL,
	`isVisible` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `sections_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(128) NOT NULL,
	`lang` enum('en','de') NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `streaming_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(128) NOT NULL,
	`url` text NOT NULL,
	`iconKey` varchar(64),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streaming_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_dates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateStr` varchar(64) NOT NULL,
	`venueEn` varchar(512) NOT NULL,
	`venueDe` varchar(512) NOT NULL,
	`cityEn` varchar(256) NOT NULL,
	`cityDe` varchar(256) NOT NULL,
	`countryEn` varchar(128) NOT NULL,
	`countryDe` varchar(128) NOT NULL,
	`region` enum('germany','europe','india','other') NOT NULL DEFAULT 'germany',
	`eventUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tour_dates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackNumber` int NOT NULL,
	`titleEn` varchar(256) NOT NULL,
	`titleDe` varchar(256) NOT NULL,
	`ragaEn` varchar(256) NOT NULL,
	`ragaDe` varchar(256) NOT NULL,
	`subtitleEn` varchar(512),
	`subtitleDe` varchar(512),
	`duration` varchar(16) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
