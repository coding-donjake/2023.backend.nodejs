/*
  Warnings:

  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `status` ENUM('nur', 'unverified', 'ok', 'deactivated', 'removed', 'suspended') NOT NULL DEFAULT 'unverified';
