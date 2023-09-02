-- AlterTable
ALTER TABLE `supplier` MODIFY `status` ENUM('ok', 'flagged', 'removed') NOT NULL;
