-- AlterTable
ALTER TABLE `event` MODIFY `status` ENUM('active', 'cancelled', 'completed', 'removed', 'unpaid') NOT NULL DEFAULT 'active';
