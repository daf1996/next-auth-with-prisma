/*
  Warnings:

  - You are about to alter the column `editNo` on the `document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `docNo` on the `document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `document` MODIFY `editNo` INTEGER NULL DEFAULT 1,
    MODIFY `docNo` INTEGER NOT NULL;
