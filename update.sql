ALTER TABLE `post` CHANGE `sort` `sort` INT(10) UNSIGNED NOT NULL DEFAULT '1' COMMENT 'number';
UPDATE `globs` SET `tag` = 'pvar' WHERE `globs`.`id` = 54;
UPDATE `globs` SET `tag` = 'pvar' WHERE `globs`.`id` = 34;
UPDATE `globs` SET `tag` = 'pvar' WHERE `globs`.`id` = 51;
UPDATE `globs` SET `type` = 'html' WHERE `globs`.`id` = 34;
UPDATE `globs` SET `type` = 'string' WHERE `globs`.`id` = 51;
UPDATE `globs` SET `type` = 'text' WHERE `globs`.`id` = 51;
UPDATE `globs` SET `type` = 'text' WHERE `globs`.`id` = 54;
INSERT INTO `globs` (`id`, `name`, `en`, `tag`, `type`, `permit`) VALUES (NULL, 'bgimg', 'https://scontent.fath6-1.fna.fbcdn.net/v/t1.0-9/61155773_10218553843812959_7617648790408790016_n.jpg?_nc_cat=108&_nc_ohc=IlFiqZRgEWYAQnrNnBzz2BxWFip3QDF-PZW_3orc_bX9CvrvyRWWPBMgA&_nc_ht=scontent.fath6-1.fna&oh=9c085c6c81b211b9cebc7ae61df92b44&oe=5EA6D034', 'pvar', 'img', '');
INSERT INTO `globs` (`id`, `name`, `en`, `tag`, `type`, `permit`) VALUES (NULL, 'subtitle', 'A new system for creating apps and websites', 'pvar', 'text', '');
DROP TABLE `varpage`;
ALTER TABLE `menu` CHANGE `title` `title` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE `user` CHANGE `authentication` `auth` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'text';
UPDATE `usergrp` SET `permissions` = '["setup","templates","page","widget","menu","post","taxonomy","media","user","seo"]' WHERE `usergrp`.`id` = 6;
UPDATE `usergrp` SET `permissions` = '["setup","templates","page","widget","menu","post","taxonomy","seo","media","user"]' WHERE `usergrp`.`id` = 7;
PDATE `usergrp` SET `permissions` = '["setup","media","user","templates","widget","page","post","taxonomy","seo"]' WHERE `usergrp`.`id` = 8;


ALTER TABLE `user` CHANGE `lang` `lang` CHAR(2) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'en' COMMENT 'select-langs';
ALTER TABLE `user` CHANGE `auth` `auth` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'hidden';
ALTER TABLE `user` DROP `privacy`;
ALTER TABLE `user` DROP `city`;


ALTER TABLE `user` CHANGE `img` `img` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'img-upload';
ALTER TABLE `post` CHANGE `img` `img` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'img-upload';
update post SET img=(SELECT filename from obj WHERE id=post.img LIMIT 1);
update user SET img=(SELECT filename from obj WHERE id=user.img LIMIT 1);

update post SET img=0 WHERE img=NULL;
update user SET img=0 WHERE img=NULL;