-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('active', 'arrived', 'cancelled', 'removed') NOT NULL;
