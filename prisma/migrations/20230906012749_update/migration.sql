/*
  Warnings:

  - You are about to drop the column `eventId` on the `customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_eventId_fkey`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `eventId`;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `customerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
