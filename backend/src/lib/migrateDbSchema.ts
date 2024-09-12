import type { Database } from "better-sqlite3";

export function migrateDbSchema(db: Database) {
  try {
    // Start a transaction
    const transaction = db.transaction(() => {
      // Check if the column already exists
      const columnInfo = db.prepare("PRAGMA table_info(user)").all();

      const githubIdColumnExists = columnInfo.some((column: any) => column.name === 'github_id');

      if (!githubIdColumnExists) {
        // Step 1: Add the github_id column without UNIQUE constraint
        db.prepare(`
            ALTER TABLE user
            ADD COLUMN github_id TEXT
          `).run();
        console.log("Added github_id column without UNIQUE constraint.");

        // Step 2: Create a new UNIQUE index for the github_id column
        db.prepare(`
            CREATE UNIQUE INDEX idx_user_github_id
            ON user (github_id)
            WHERE github_id IS NOT NULL
          `).run();
        console.log("Created UNIQUE index for github_id column.");

        // Verify the column was added
        const updatedColumnInfo = db.prepare("PRAGMA table_info(user)").all();
        console.log("Updated table structure:", updatedColumnInfo);

        const columnAdded = updatedColumnInfo.some((column: any) => column.name === 'github_id');
        if (!columnAdded) {
          throw new Error("Column was not added despite no error being thrown.");
        }
        console.log("Successfully added github_id column to user table with UNIQUE constraint.");
      } else {
        console.log("github_id column already exists in user table.");
      }
    });
    transaction();

  } catch (error) {
    console.error("Error adding github_id column:", error);
    console.error("Error details:", (error as Error).message);
    console.error("Stack trace:", (error as Error).stack);
  }

  try {
    db.exec("DROP TABLE user_new");
  }
  catch (e) {
  }


  try {
    const columnInfo = db.prepare("PRAGMA table_info(user)").all();
    const needsUpdate = columnInfo.some((col: any) =>
      (col.name === 'password' && col.notnull === 1)
    );

    if (needsUpdate) {
      db.transaction(() => {
        db.prepare(`ALTER TABLE user RENAME COLUMN password TO password_old`).run();
        db.prepare(`ALTER TABLE user ADD COLUMN password TEXT`).run();
        db.prepare(`UPDATE user SET password = password_old`).run();  // Correct way to transfer values
        db.prepare(`ALTER TABLE user DROP COLUMN password_old`).run(); // Optional cleanup step

        console.log("Updated user table structure.");
      })();
    }
    console.log("updated table structure");
  }
  catch (error) {
    console.log("Table Users non unique password migration failed")
    console.error(error);
  }
};

