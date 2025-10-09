/*
  Warnings:

  - A unique constraint covering the columns `[telephone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "adresse" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "telephone" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "users_telephone_key" ON "public"."users"("telephone");
