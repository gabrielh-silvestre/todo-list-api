/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('TODO', 'IN_PROGRESS', 'DONE', 'DELETED') NOT NULL DEFAULT 'TODO';

-- CreateIndex
CREATE UNIQUE INDEX `tasks_id_userId_key` ON `tasks`(`id`, `userId`);
