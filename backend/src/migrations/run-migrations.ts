import { DataSource } from 'typeorm';

async function runMigrations() {
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

    // Migration 1: Add eliminado column to proyectos
    console.log('📝 Running migration 1: Add eliminado column...');
    try {
      await dataSource.query(`
        ALTER TABLE \`proyectos\`
        ADD COLUMN \`eliminado\` BOOLEAN DEFAULT FALSE
        AFTER \`fecha_actualizacion\`
      `);
      console.log('✅ Added eliminado column');
    } catch (error: any) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Column eliminado already exists, skipping...');
      } else {
        throw error;
      }
    }

    try {
      await dataSource.query(`
        CREATE INDEX \`idx_proyectos_eliminado\` ON \`proyectos\`(\`eliminado\`)
      `);
      console.log('✅ Created index on eliminado');
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Index idx_proyectos_eliminado already exists, skipping...');
      } else {
        throw error;
      }
    }

    // Migration 2: Create archivos_subtarea table
    console.log('📝 Running migration 2: Create archivos_subtarea table...');
    try {
      await dataSource.query(`
        CREATE TABLE \`archivos_subtarea\` (
          \`id_archivo\` int NOT NULL AUTO_INCREMENT,
          \`id_subtarea\` int NOT NULL,
          \`nombre\` varchar(255) NOT NULL,
          \`ruta\` varchar(500) NOT NULL,
          \`tipo\` varchar(50) DEFAULT NULL,
          \`tamano\` int DEFAULT NULL,
          \`id_subido_por\` int DEFAULT NULL,
          \`fecha_subida\` timestamp DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id_archivo\`),
          KEY \`id_subtarea\` (\`id_subtarea\`),
          KEY \`id_subido_por\` (\`id_subido_por\`),
          CONSTRAINT \`archivos_subtarea_ibfk_1\` FOREIGN KEY (\`id_subtarea\`) REFERENCES \`subtareas\` (\`id_subtarea\`) ON DELETE CASCADE,
          CONSTRAINT \`archivos_subtarea_ibfk_2\` FOREIGN KEY (\`id_subido_por\`) REFERENCES \`usuarios\` (\`id_usuario\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Created archivos_subtarea table');
    } catch (error: any) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('ℹ️  Table archivos_subtarea already exists, skipping...');
      } else {
        throw error;
      }
    }

    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

runMigrations();
