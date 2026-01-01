// app/api/dashboard/route.js
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const periode = searchParams.get('periode') || 'today'; // today, week, month
    
    let dateCondition = '';
    const params = [];
    
    if (periode === 'today') {
      dateCondition = 'WHERE date = CURRENT_DATE';
    } else if (periode === 'week') {
      dateCondition = 'WHERE date >= CURRENT_DATE - INTERVAL \'7 days\'';
    } else if (periode === 'month') {
      dateCondition = 'WHERE date >= CURRENT_DATE - INTERVAL \'30 days\'';
    }
    
    // Récupérer les totaux
    const [recettesResult, depensesResult, recettesParService, depensesParCategorie] = await Promise.all([
      // Total recettes
      query(`SELECT COALESCE(SUM(montant), 0) as total FROM recettes ${dateCondition}`, params),
      
      // Total dépenses
      query(`SELECT COALESCE(SUM(montant), 0) as total FROM depenses ${dateCondition}`, params),
      
      // Recettes par service
      query(`
        SELECT service, SUM(montant) as total 
        FROM recettes ${dateCondition}
        GROUP BY service 
        ORDER BY total DESC
      `, params),
      
      // Dépenses par catégorie
      query(`
        SELECT categorie, SUM(montant) as total 
        FROM depenses ${dateCondition}
        GROUP BY categorie 
        ORDER BY total DESC
      `, params)
    ]);
    
    const totalRecettes = parseFloat(recettesResult.rows[0]?.total || 0);
    const totalDepenses = parseFloat(depensesResult.rows[0]?.total || 0);
    const benefice = totalRecettes - totalDepenses;
    
    return Response.json({
      periode,
      totals: {
        recettes: totalRecettes,
        depenses: totalDepenses,
        benefice
      },
      recettesParService: recettesParService.rows,
      depensesParCategorie: depensesResult.rows,
      dernieresRecettes: (await query(
        `SELECT * FROM recettes ${dateCondition} ORDER BY created_at DESC LIMIT 5`,
        params
      )).rows,
      dernieresDepenses: (await query(
        `SELECT * FROM depenses ${dateCondition} ORDER BY created_at DESC LIMIT 5`,
        params
      )).rows
    });
    
  } catch (error) {
    console.error('❌ Erreur dashboard:', error);
    return Response.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}