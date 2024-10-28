/*
  Warnings:

  - You are about to drop the column `authorId` on the `document` table. All the data in the column will be lost.
  - Added the required column `author` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` DROP COLUMN `authorId`,
    ADD COLUMN `author` VARCHAR(191) NOT NULL;
