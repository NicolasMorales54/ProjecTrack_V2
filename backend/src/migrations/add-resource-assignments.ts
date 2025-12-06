import { DataSource } from 'typeorm';

async function runMigration() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'yofer',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Migration 3: Add task and subtask assignment columns to recursos_proyecto
    console.log('📝 Running migration 3: Add task and subtask assignment to resources...');

    try {
      await dataSource.query(`
        ALTER TABLE \`recursos_proyecto\`
        ADD COLUMN \`id_tarea\` int DEFAULT NULL AFTER \`asignado\`,
        ADD COLUMN \`id_subtarea\` int DEFAULT NULL AFTER \`id_tarea\`
      `);
      console.log('✅ Added id_tarea and id_subtarea columns');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Columns already exist, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await dataSource.query(`
        ALTER TABLE \`recursos_proyecto\`
        ADD CONSTRAINT \`recursos_proyecto_ibfk_1\` FOREIGN KEY (\`id_tarea\`)
          REFERENCES \`tareas\` (\`id_tarea\`) ON DELETE CASCADE
      `);
      console.log('✅ Added foreign key for id_tarea');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_FK_DUP_NAME') {
        console.log('ℹ️  Foreign key for id_tarea already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await dataSource.query(`
        ALTER TABLE \`recursos_proyecto\`
        ADD CONSTRAINT \`recursos_proyecto_ibfk_2\` FOREIGN KEY (\`id_subtarea\`)
          REFERENCES \`subtareas\` (\`id_subtarea\`) ON DELETE CASCADE
      `);
      console.log('✅ Added foreign key for id_subtarea');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_FK_DUP_NAME') {
        console.log('ℹ️  Foreign key for id_subtarea already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await dataSource.query(`
        CREATE INDEX \`idx_recursos_tarea\` ON \`recursos_proyecto\`(\`id_tarea\`)
      `);
      console.log('✅ Created index on id_tarea');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_recursos_tarea already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await dataSource.query(`
        CREATE INDEX \`idx_recursos_subtarea\` ON \`recursos_proyecto\`(\`id_subtarea\`)
      `);
      console.log('✅ Created index on id_subtarea');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_recursos_subtarea already exists, skipping...');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Migration 3 completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

runMigration();
