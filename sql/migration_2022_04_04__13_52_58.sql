CREATE TABLE `tcategories` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `tcategories` ADD `name` TEXT;
ALTER TABLE `tcategories` ADD `description` TEXT;
ALTER TABLE `tcategories` ADD `tcategories_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`name`,`description`,`tcategories_id`);;
CREATE TABLE `tcategories` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`name` TEXT ,`description` TEXT ,`tcategories_id` INTEGER    );;
CREATE INDEX index_foreignkey_tcategories_tcategories ON `tcategories` (tcategories_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`name`,`description`,`tcategories_id`);;
CREATE TABLE `tcategories` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`name` TEXT ,`description` TEXT ,`tcategories_id` INTEGER   , FOREIGN KEY(`tcategories_id`)
						 REFERENCES `tcategories`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_tcategories_tcategories ON `tcategories` (tcategories_id) ;
CREATE TABLE `ttasks` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `ttasks` ADD `created_at` NUMERIC;
ALTER TABLE `ttasks` ADD `updated_at` NUMERIC;
ALTER TABLE `ttasks` ADD `timestamp` INTEGER;
ALTER TABLE `ttasks` ADD `name` TEXT;
ALTER TABLE `ttasks` ADD `description` TEXT;
ALTER TABLE `ttasks` ADD `ttasks_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`ttasks_id`);;
CREATE TABLE `ttasks` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`ttasks_id` INTEGER    );;
CREATE INDEX index_foreignkey_ttasks_ttasks ON `ttasks` (ttasks_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`ttasks_id`);;
CREATE TABLE `ttasks` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`ttasks_id` INTEGER   , FOREIGN KEY(`ttasks_id`)
						 REFERENCES `ttasks`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_ttasks_ttasks ON `ttasks` (ttasks_id) ;
ALTER TABLE `ttasks` ADD `tcategories_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`ttasks_id`,`tcategories_id`);;
CREATE TABLE `ttasks` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`ttasks_id` INTEGER ,`tcategories_id` INTEGER   , FOREIGN KEY(`ttasks_id`)
						 REFERENCES `ttasks`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_ttasks_ttasks ON `ttasks` (ttasks_id) ;
CREATE INDEX index_foreignkey_ttasks_tcategories ON `ttasks` (tcategories_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`created_at`,`updated_at`,`timestamp`,`name`,`description`,`ttasks_id`,`tcategories_id`);;
CREATE TABLE `ttasks` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`created_at` NUMERIC ,`updated_at` NUMERIC ,`timestamp` INTEGER ,`name` TEXT ,`description` TEXT ,`ttasks_id` INTEGER ,`tcategories_id` INTEGER   , FOREIGN KEY(`ttasks_id`)
						 REFERENCES `ttasks`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL, FOREIGN KEY(`tcategories_id`)
						 REFERENCES `tcategories`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_ttasks_tcategories ON `ttasks` (tcategories_id) ;
CREATE INDEX index_foreignkey_ttasks_ttasks ON `ttasks` (ttasks_id) ;
CREATE TABLE `ttags` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `ttags` ADD `created_at` NUMERIC;
ALTER TABLE `ttags` ADD `updated_at` NUMERIC;
ALTER TABLE `ttags` ADD `timestamp` INTEGER;
ALTER TABLE `ttags` ADD `name` TEXT;
CREATE TABLE `ttagstoobjectss` ( id INTEGER PRIMARY KEY AUTOINCREMENT );
ALTER TABLE `ttagstoobjectss` ADD `content_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`content_id`);;
CREATE TABLE `ttagstoobjectss` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`content_id` INTEGER    );;
CREATE INDEX index_foreignkey_ttagstoobjectss_content ON `ttagstoobjectss` (content_id) ;
ALTER TABLE `ttagstoobjectss` ADD `content_type` TEXT;
ALTER TABLE `ttagstoobjectss` ADD `ttags_id` INTEGER;
CREATE TEMPORARY TABLE tmp_backup(`id`,`content_id`,`content_type`,`ttags_id`);;
CREATE TABLE `ttagstoobjectss` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`content_id` INTEGER ,`content_type` TEXT ,`ttags_id` INTEGER    );;
CREATE INDEX index_foreignkey_ttagstoobjectss_content ON `ttagstoobjectss` (content_id) ;
CREATE INDEX index_foreignkey_ttagstoobjectss_ttags ON `ttagstoobjectss` (ttags_id) ;
CREATE TEMPORARY TABLE tmp_backup(`id`,`content_id`,`content_type`,`ttags_id`);;
CREATE TABLE `ttagstoobjectss` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT  ,`content_id` INTEGER ,`content_type` TEXT ,`ttags_id` INTEGER   , FOREIGN KEY(`ttags_id`)
						 REFERENCES `ttags`(`id`)
						 ON DELETE SET NULL ON UPDATE SET NULL );;
CREATE INDEX index_foreignkey_ttagstoobjectss_ttags ON `ttagstoobjectss` (ttags_id) ;
CREATE INDEX index_foreignkey_ttagstoobjectss_content ON `ttagstoobjectss` (content_id) ;
