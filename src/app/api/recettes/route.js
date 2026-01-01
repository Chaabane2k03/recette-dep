// app/api/recettes/route.js
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const service = searchParams.get('service');
    
    let sql = 'SELECT * FROM recettes';
    const params = [];
    
    if (date) {
      sql += ' WHERE date = $1';
      params.push(date);
    }
    
    if (service && !date) {
      sql += ' WHERE service = $1';
      params.push(service);
    } else if (service) {
      sql += ' AND service = $2';
      params.push(service);
    }
    
    sql += ' ORDER BY date DESC, created_at DESC';
    
    const result = await query(sql, params);
    return Response.json(result.rows);
    
  } catch (error) {
    console.error('❌ Erreur GET recettes:', error);
    return Response.json(
      { error: 'Erreur lors de la récupération des recettes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, service, montant, mode_paiement, commentaire } = body;
    
    // Validation
    if (!service || !montant) {
      return Response.json(
        { error: 'Service et montant sont requis' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO recettes (date, service, montant, mode_paiement, commentaire)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        date || new Date().toISOString().split('T')[0],
        service,
        parseFloat(montant),
        mode_paiement || 'especes',
        commentaire || ''
      ]
    );
    
    return Response.json(result.rows[0], { status: 201 });
    
  } catch (error) {
    console.error('❌ Erreur POST recettes:', error);
    return Response.json(
      { error: 'Erreur lors de l\'ajout de la recette' },
      { status: 500 }
    );
  }
}