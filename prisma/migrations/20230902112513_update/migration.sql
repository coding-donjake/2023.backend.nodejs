-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('unverified', 'ok', 'deactivated', 'removed', 'suspended') NOT NULL DEFAULT 'unverified';
