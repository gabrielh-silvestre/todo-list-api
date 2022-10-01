/*
  Warnings:

  - You are about to drop the column `user_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,userId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- DropIndex
DROP INDEX "tasks_id_user_id_key";

-- DropIndex
DROP INDEX "tasks_title_user_id_key";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "tasks_id_userId_key" ON "tasks"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_title_userId_key" ON "tasks"("title", "userId");
