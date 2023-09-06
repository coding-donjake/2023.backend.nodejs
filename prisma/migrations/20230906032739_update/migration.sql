-- AlterTable
ALTER TABLE `customer` MODIFY `status` ENUM('ok', 'flagged', 'removed') NOT NULL DEFAULT 'ok';

-- AlterTable
ALTER TABLE `user` MODIFY `username` VARCHAR(255) NOT NULL;
