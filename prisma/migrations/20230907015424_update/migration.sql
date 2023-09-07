-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('nur', 'unverified', 'ok', 'deactivated', 'removed', 'suspended') NOT NULL DEFAULT 'unverified';
