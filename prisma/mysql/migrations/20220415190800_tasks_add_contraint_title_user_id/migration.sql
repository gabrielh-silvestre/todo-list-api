/*
  Warnings:

  - A unique constraint covering the columns `[title,user_id]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `tasks_title_id_user_id_key` ON `tasks`;

-- CreateIndex
CREATE UNIQUE INDEX `tasks_title_user_id_key` ON `tasks`(`title`, `user_id`);
