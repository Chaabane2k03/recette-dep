// app/api/depenses/[id]/route.js
import { query } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    // 🔥 CORRECTION : ajouter "await" devant params
    const { id } = await params;
    
    console.log(`🗑️ Suppression dépense ID: ${id}`);
    
    // Validation
    if (!id || isNaN(id)) {
      return Response.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const result = await query(
      'DELETE FROM depenses WHERE id = $1 RETURNING *',
      [parseInt(id)] // 🔥 Convertir en nombre
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Dépense supprimée',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erreur DELETE dépense:', error);
    return Response.json(
      { error: 'Erreur lors de la suppression: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // 🔥 CORRECTION ici aussi
    const { id } = await params;
    const body = await request.json();
    
    // Validation de l'ID
    if (!id || isNaN(id)) {
      return Response.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const { date, categorie, fournisseur, montant, mode_paiement, urgent, justificatif_url } = body;
    
    // Validation des données requises
    if (!categorie || !montant) {
      return Response.json(
        { error: 'Catégorie et montant sont requis' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `UPDATE depenses 
       SET date = $1, categorie = $2, fournisseur = $3, montant = $4, 
           mode_paiement = $5, urgent = $6, justificatif_url = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        date || new Date().toISOString().split('T')[0],
        categorie,
        fournisseur || '',
        parseFloat(montant),
        mode_paiement || 'carte',
        urgent || false,
        justificatif_url || '',
        parseInt(id) // 🔥 Convertir en nombre
      ]
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erreur PUT dépense:', error);
    return Response.json(
      { error: 'Erreur lors de la modification: ' + error.message },
      { status: 500 }
    );
  }
}

// 🔥 AJOUTER aussi GET pour récupérer une dépense spécifique
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(id)) {
      return Response.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const result = await query(
      'SELECT * FROM depenses WHERE id = $1',
      [parseInt(id)]
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur GET dépense:', error);
    return Response.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}