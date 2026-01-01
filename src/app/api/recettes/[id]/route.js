// app/api/recettes/[id]/route.js
import { query } from '@/lib/db';

// DELETE - Supprimer une recette
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    console.log(`🗑️ Tentative de suppression recette ID: ${id}`);
    
    // Vérifier si la recette existe
    const checkResult = await query(
      'SELECT * FROM recettes WHERE id = $1',
      [id]
    );
    
    if (checkResult.rowCount === 0) {
      console.log(`❌ Recette ${id} non trouvée`);
      return Response.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }
    
    console.log(`📝 Recette à supprimer:`, checkResult.rows[0]);
    
    // Supprimer la recette
    const result = await query(
      'DELETE FROM recettes WHERE id = $1 RETURNING *',
      [id]
    );
    
    console.log(`✅ Recette ${id} supprimée avec succès`);
    
    return Response.json({
      success: true,
      message: 'Recette supprimée avec succès',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return Response.json(
      { 
        error: 'Erreur lors de la suppression de la recette',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Modifier une recette
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
      `UPDATE recettes 
       SET date = $1, service = $2, montant = $3, 
           mode_paiement = $4, commentaire = $5,
           created_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        date || new Date().toISOString().split('T')[0],
        service,
        parseFloat(montant),
        mode_paiement || 'especes',
        commentaire || '',
        id
      ]
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur modification recette:', error);
    return Response.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
}

// GET - Récupérer une recette spécifique
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await query(
      'SELECT * FROM recettes WHERE id = $1',
      [id]
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Recette non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur GET recette:', error);
    return Response.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}