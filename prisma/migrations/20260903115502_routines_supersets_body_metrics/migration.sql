-- AlterTable
ALTER TABLE "Workout" ADD COLUMN "routineDayKey" TEXT;
ALTER TABLE "Workout" ADD COLUMN "routineKey" TEXT;

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN "supersetGroup" INTEGER;
ALTER TABLE "WorkoutExercise" ADD COLUMN "targetReps" TEXT;
ALTER TABLE "WorkoutExercise" ADD COLUMN "targetSets" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "calorieTarget" REAL,
    "proteinTarget" REAL,
    "carbsTarget" REAL,
    "fatTarget" REAL,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "restTimerSec" INTEGER NOT NULL DEFAULT 120,
    "activeRoutineKey" TEXT,
    "heightCm" REAL,
    "weightKg" REAL,
    "age" INTEGER,
    "sex" TEXT,
    "activityLevel" TEXT NOT NULL DEFAULT 'moderate',
    "goal" TEXT NOT NULL DEFAULT 'maintain',
    "mealPattern" TEXT NOT NULL DEFAULT 'THREE',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("calorieTarget", "carbsTarget", "fatTarget", "id", "proteinTarget", "updatedAt", "userId", "weightUnit") SELECT "calorieTarget", "carbsTarget", "fatTarget", "id", "proteinTarget", "updatedAt", "userId", "weightUnit" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
