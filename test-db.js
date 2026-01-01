// test-neon-complete.js
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

console.log('🚀 TEST NEON DATABASE COMPLET');
console.log('=============================\n');

// Vérifier si .env.local existe
const envPath = resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ FICHIER .env.local MANQUANT');
  console.log('\nCréez-le avec:');
  console.log('echo POSTGRES_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require" > .env.local');
  process.exit(1);
}

// Charger les variables
config({ path: envPath });

// Afficher les variables chargées
console.log('📁 Fichier .env.local:', envPath);
console.log('🔧 Variables chargées:');

// Lire et afficher le contenu (sans le mot de passe)
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(line => line.trim() !== '');

lines.forEach(line => {
  if (line.includes('POSTGRES_URL')) {
    // Cacher le mot de passe
    const safeLine = line.replace(/:[^:@]*@/, ':****@');
    console.log(`   ${safeLine}`);
  } else {
    console.log(`   ${line}`);
  }
});

console.log('\n🧪 Test de connexion...');

// Importer pg après avoir chargé les variables
import pkg from 'pg';
const { Client } = pkg;

const neonUrl = process.env.POSTGRES_URL;

if (!neonUrl) {
  console.error('❌ POSTGRES_URL non trouvé dans .env.local');
  console.log('\n💡 Format requis pour Neon:');
  console.log('POSTGRES_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"');
  console.log('\nExemple:');
  console.log('POSTGRES_URL="postgresql://ali:monpass123@ep-cool-bird-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

async function connectToNeon() {
  const client = new Client({
    connectionString: neonUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ CONNECTÉ À NEON!');
    
    // Version de PostgreSQL
    const version = await client.query('SELECT version()');
    console.log(`📋 ${version.rows[0].version.split(',')[0]}`);
    
    // Créer schéma restaurant
    console.log('\n🏗️  Création du schéma restaurant...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS recettes (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP DEFAULT NOW(),
        service VARCHAR(20) CHECK (service IN ('midi', 'soir', 'emporter')),
        montant DECIMAL(10,2) NOT NULL,
        mode_paiement VARCHAR(20) CHECK (mode_paiement IN ('especes', 'carte', 'ticket_resto')),
        commentaire TEXT,
        caisse_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS depenses (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP DEFAULT NOW(),
        categorie VARCHAR(50) NOT NULL,
        fournisseur VARCHAR(100),
        montant DECIMAL(10,2) NOT NULL,
        mode_paiement VARCHAR(20),
        urgent BOOLEAN DEFAULT false,
        justificatif_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Insérer données de test
    await client.query(`
      INSERT INTO recettes (service, montant, mode_paiement, commentaire)
      VALUES 
        ('midi', 150.50, 'carte', 'Table 5'),
        ('soir', 230.75, 'especes', 'Anniversaire'),
        ('emporter', 89.90, 'ticket_resto', 'Commande Uber')
      ON CONFLICT DO NOTHING
    `);
    
    // Compter les recettes
    const count = await client.query('SELECT COUNT(*) as total FROM recettes');
    console.log(`📊 ${count.rows[0].total} recettes de test insérées`);
    
    // Afficher un aperçu
    const sample = await client.query('SELECT * FROM recettes ORDER BY date DESC LIMIT 3');
    console.log('\n📋 Aperçu des données:');
    sample.rows.forEach(row => {
      console.log(`   ${row.date.toISOString().split('T')[0]} | ${row.service} | ${row.montant}€ | ${row.mode_paiement}`);
    });
    
    console.log('\n🎉 BASE DE DONNÉES PRÊTE POUR LE RESTAURANT!');
    console.log('🚀 Prochaine étape: npm run dev');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    
    // Diagnostics
    if (error.message.includes('Connection terminated')) {
      console.log('\n🔧 Vérifiez votre connexion internet');
    }
    
    if (error.message.includes('no pg_hba.conf entry')) {
      console.log('\n🔧 Problème d\'authentification - Regénérez le mot de passe dans Neon');
    }
    
    if (error.message.includes('getaddrinfo')) {
      console.log('\n🔧 Hostname incorrect - Vérifiez l\'URL Neon');
    }
    
    console.log('\n🔧 URL utilisée (sans mdp):', neonUrl.replace(/:[^:@]*@/, ':****@'));
    
  } finally {
    await client.end();
  }
}

connectToNeon();