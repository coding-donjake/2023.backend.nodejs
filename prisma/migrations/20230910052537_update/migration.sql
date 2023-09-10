-- AlterTable
ALTER TABLE `asset` MODIFY `status` ENUM('good', 'broken', 'removed') NOT NULL;
