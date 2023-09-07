-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(255) NULL,
    MODIFY `status` ENUM('nur', 'unverified', 'ok', 'deactivated', 'removed', 'suspended') NULL DEFAULT 'unverified';
