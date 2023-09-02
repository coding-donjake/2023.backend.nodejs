/*
  Warnings:

  - The values [canceled] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `status` ENUM('active', 'cancelled', 'completed', 'removed', 'unpaid') NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('active', 'arrived', 'cancelled') NOT NULL;
