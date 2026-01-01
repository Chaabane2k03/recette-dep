// lib/db.js
import { Pool } from 'pg';

// Configuration pour Neon
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false },
  max: 20, // Nombre max de connexions
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Gestion des erreurs
pool.on('error', (err) => {
  console.error('❌ Erreur pool PostgreSQL:', err);
});

// Fonctions utilitaires
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Query exécutée en ${duration}ms:`, text.substring(0, 100));
    return res;
  } catch (error) {
    console.error('❌ Erreur query:', { text, params, error: error.message });
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Initialiser la base de données
export async function initDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS recettes (
        id SERIAL PRIMARY KEY,
        date DATE DEFAULT CURRENT_DATE,
        service VARCHAR(20) CHECK (service IN ('midi', 'soir', 'emporter')),
        montant DECIMAL(10,2) NOT NULL,
        mode_paiement VARCHAR(20) CHECK (mode_paiement IN ('especes', 'carte', 'ticket_resto', 'virement')),
        commentaire TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await query(`
      CREATE TABLE IF NOT EXISTS depenses (
        id SERIAL PRIMARY KEY,
        date DATE DEFAULT CURRENT_DATE,
        categorie VARCHAR(50) NOT NULL,
        fournisseur VARCHAR(100),
        montant DECIMAL(10,2) NOT NULL,
        mode_paiement VARCHAR(20),
        urgent BOOLEAN DEFAULT false,
        justificatif_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('✅ Base de données initialisée');
  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
  }
}

export default pool;