-- CreateTable
CREATE TABLE `User` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` TEXT NOT NULL,
    `name` TEXT,

    CONSTRAINT `User_pkey` PRIMARY KEY (`id`)
);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`username`);
