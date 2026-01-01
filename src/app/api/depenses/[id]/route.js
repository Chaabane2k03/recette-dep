// app/api/depenses/[id]/route.js
import { query } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await query(
      'DELETE FROM depenses WHERE id = $1 RETURNING *',
      [id]
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
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { date, categorie, fournisseur, montant, mode_paiement, urgent, justificatif_url } = body;
    
    const result = await query(
      `UPDATE depenses 
       SET date = $1, categorie = $2, fournisseur = $3, montant = $4, 
           mode_paiement = $5, urgent = $6, justificatif_url = $7
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
        id
      ]
    );
    
    if (result.rowCount === 0) {
      return Response.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }
    
    return Response.json(result.rows[0]);
    
  } catch (error) {
    console.error('❌ Erreur PUT dépense:', error);
    return Response.json(
      { error: 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
}