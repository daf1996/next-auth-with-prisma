/*
  Warnings:

  - Added the required column `docNo` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `docNo` VARCHAR(191) NOT NULL;
