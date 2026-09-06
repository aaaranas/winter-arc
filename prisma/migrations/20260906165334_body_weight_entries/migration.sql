-- CreateTable
CREATE TABLE "BodyWeightEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyWeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BodyWeightEntry_userId_date_idx" ON "BodyWeightEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BodyWeightEntry_userId_date_key" ON "BodyWeightEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "BodyWeightEntry" ADD CONSTRAINT "BodyWeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

