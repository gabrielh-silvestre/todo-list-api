/*
  Warnings:

  - You are about to drop the column `userId` on the `tasks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,user_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_userId_fkey`;

-- DropIndex
DROP INDEX `tasks_id_userId_key` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `userId`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tasks_id_user_id_key` ON `tasks`(`id`, `user_id`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
