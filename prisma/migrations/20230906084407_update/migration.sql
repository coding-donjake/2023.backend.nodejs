/*
  Warnings:

  - Added the required column `datetimeExpected` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `datetimeExpected` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('active', 'arrived', 'cancelled', 'removed') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `supplier` MODIFY `status` ENUM('ok', 'flagged', 'removed') NOT NULL DEFAULT 'ok';
