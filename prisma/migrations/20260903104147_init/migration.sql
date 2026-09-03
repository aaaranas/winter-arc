-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "date" DATETIME NOT NULL,
    "name" TEXT,
    "notes" TEXT,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseSlug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutExerciseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" REAL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "rpe" REAL,
    "durationSec" INTEGER,
    "distanceM" REAL,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExerciseSet_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'USER',
    "source" TEXT,
    "isEstimate" BOOLEAN NOT NULL DEFAULT false,
    "calories" REAL NOT NULL,
    "proteinG" REAL NOT NULL,
    "carbsG" REAL NOT NULL,
    "fatG" REAL NOT NULL,
    "servingSize" REAL NOT NULL,
    "servingUnit" TEXT NOT NULL,
    "servingLabel" TEXT,
    "seedKey" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "date" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dailyLogId" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "mealType" TEXT NOT NULL DEFAULT 'SNACK',
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LogEntry_dailyLogId_fkey" FOREIGN KEY ("dailyLogId") REFERENCES "DailyLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LogEntry_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'local',
    "calorieTarget" REAL,
    "proteinTarget" REAL,
    "carbsTarget" REAL,
    "fatTarget" REAL,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Workout_userId_date_idx" ON "Workout"("userId", "date");

-- CreateIndex
CREATE INDEX "WorkoutExercise_workoutId_idx" ON "WorkoutExercise"("workoutId");

-- CreateIndex
CREATE INDEX "ExerciseSet_workoutExerciseId_idx" ON "ExerciseSet"("workoutExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_seedKey_key" ON "FoodItem"("seedKey");

-- CreateIndex
CREATE INDEX "FoodItem_userId_category_idx" ON "FoodItem"("userId", "category");

-- CreateIndex
CREATE INDEX "FoodItem_name_idx" ON "FoodItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE INDEX "LogEntry_dailyLogId_idx" ON "LogEntry"("dailyLogId");

-- CreateIndex
CREATE INDEX "LogEntry_foodItemId_idx" ON "LogEntry"("foodItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
