import type { Database } from 'better-sqlite3';
import { defaultUserTypingConfig } from './defaultData.js';

export function migrateUserTypingConfig(db: Database) {

  const users = db.prepare('SELECT id, typing_config FROM user').all() as { id: string, typing_config: string }[];

  const updateStmt = db.prepare('UPDATE user SET typing_config = ? WHERE id = ?');

  db.transaction(() => {
    for (const user of users) {
      let config = JSON.parse(user.typing_config);

      if (!config.theme) {
        config.theme = defaultUserTypingConfig.theme
      }

      if (!config.typingLanguage) {
        config.typingLanguage = "english"
      }

      if (!config.visualConfig) {
        config.visualConfig = defaultUserTypingConfig.visualConfig
      }

      if (config.errorCorrectionMode === 3) {
        config.errorCorrectionMode = 0;
      }

      const updatedConfig = JSON.stringify(config);


      updateStmt.run(updatedConfig, user.id);
    }
  })();


  // console.log("MIGRATION COMPLETED")
}

