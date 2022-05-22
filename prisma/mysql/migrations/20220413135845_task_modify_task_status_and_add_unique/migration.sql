/*
  Warnings:

  - The values [DELETED] on the enum `tasks_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[title,id,user_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `status` ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO';

-- CreateIndex
CREATE UNIQUE INDEX `tasks_title_id_user_id_key` ON `tasks`(`title`, `id`, `user_id`);
