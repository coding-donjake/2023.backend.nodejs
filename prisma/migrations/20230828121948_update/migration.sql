-- AlterTable
ALTER TABLE `admin` MODIFY `status` ENUM('ok', 'removed') NOT NULL DEFAULT 'ok';
