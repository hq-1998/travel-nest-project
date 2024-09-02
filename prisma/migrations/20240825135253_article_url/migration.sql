/*
  Warnings:

  - The primary key for the `ArticleUrl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imgId` on the `ArticleUrl` table. All the data in the column will be lost.
  - Added the required column `articleId` to the `ArticleUrl` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ArticleUrl` DROP FOREIGN KEY `ArticleUrl_imgId_fkey`;

-- AlterTable
ALTER TABLE `ArticleUrl` DROP PRIMARY KEY,
    DROP COLUMN `imgId`,
    ADD COLUMN `articleId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`url`, `articleId`);

-- CreateIndex
CREATE INDEX `ArticleUrl_articleId_idx` ON `ArticleUrl`(`articleId`);

-- AddForeignKey
ALTER TABLE `ArticleUrl` ADD CONSTRAINT `ArticleUrl_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
