// app/api/depenses/route.js
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await query(
      'SELECT * FROM depenses ORDER BY date DESC, created_at DESC'
    );
    return Response.json(result.rows);
  } catch (error) {
    return Response.json(
      { error: 'Erreur lors de la récupération des dépenses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, categorie, fournisseur, montant, mode_paiement, urgent, justificatif_url } = body;
    
    if (!categorie || !montant) {
      return Response.json(
        { error: 'Catégorie et montant sont requis' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `INSERT INTO depenses (date, categorie, fournisseur, montant, mode_paiement, urgent, justificatif_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        date || new Date().toISOString().split('T')[0],
        categorie,
        fournisseur || '',
        parseFloat(montant),
        mode_paiement || 'carte',
        urgent || false,
        justificatif_url || ''
      ]
    );
    
    return Response.json(result.rows[0], { status: 201 });
    
  } catch (error) {
    console.error('❌ Erreur POST depenses:', error);
    return Response.json(
      { error: 'Erreur lors de l\'ajout de la dépense' },
      { status: 500 }
    );
  }
}


// Dans app/api/depenses/route.js, ajoutez la méthode DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }
    
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


