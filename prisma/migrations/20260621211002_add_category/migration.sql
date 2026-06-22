-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "guideName" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "availableSlots" INTEGER NOT NULL,
    "guideId" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'Naturaleza',
    CONSTRAINT "Experience_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Experience" ("availableSlots", "city", "description", "duration", "guideId", "guideName", "id", "imageUrl", "price", "rating", "title") SELECT "availableSlots", "city", "description", "duration", "guideId", "guideName", "id", "imageUrl", "price", "rating", "title" FROM "Experience";
DROP TABLE "Experience";
ALTER TABLE "new_Experience" RENAME TO "Experience";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
