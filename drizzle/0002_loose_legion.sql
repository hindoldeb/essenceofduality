ALTER TABLE `site_content` DROP INDEX `site_content_key_unique`;--> statement-breakpoint
ALTER TABLE `site_content` ADD CONSTRAINT `site_content_key_lang_unique` UNIQUE(`key`,`lang`);