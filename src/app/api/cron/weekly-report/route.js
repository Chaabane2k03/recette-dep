// app/api/cron/weekly-report/route.js
import { query } from '@/lib/db';
import { sendWeeklyReport } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Sécurité : vérifier un token secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 });
  }
  
  try {
    // Calculer la période (7 derniers jours)
    const aujourdhui = new Date();
    const debut = new Date();
    debut.setDate(aujourdhui.getDate() - 7);
    
    // Récupérer les données
    const [recettesResult, depensesResult] = await Promise.all([
      query(`
        SELECT 
          service,
          SUM(montant) as total
        FROM recettes
        WHERE date >= $1
        GROUP BY service
        ORDER BY total DESC
      `, [debut.toISOString().split('T')[0]]),
      
      query(`
        SELECT 
          categorie,
          SUM(montant) as total
        FROM depenses
        WHERE date >= $1
        GROUP BY categorie
        ORDER BY total DESC
      `, [debut.toISOString().split('T')[0]])
    ]);
    
    // Calculer les totaux
    const totalRecettes = recettesResult.rows.reduce((sum, r) => sum + parseFloat(r.total), 0);
    const totalDepenses = depensesResult.rows.reduce((sum, d) => sum + parseFloat(d.total), 0);
    
    const reportData = {
      periode: {
        debut: debut.toLocaleDateString('fr-FR'),
        fin: aujourdhui.toLocaleDateString('fr-FR')
      },
      totals: {
        recettes: totalRecettes,
        depenses: totalDepenses,
        benefice: totalRecettes - totalDepenses
      },
      recettesParService: recettesResult.rows,
      depensesParCategorie: depensesResult.rows
    };
    
    // Envoyer l'email
    await sendWeeklyReport(reportData);
    
    // Enregistrer dans la base
    await query(
      `INSERT INTO rapports_history (type, periode_debut, periode_fin, total_recettes, total_depenses)
       VALUES ($1, $2, $3, $4, $5)`,
      ['hebdo', debut, aujourdhui, totalRecettes, totalDepenses]
    );
    
    return Response.json({
      success: true,
      message: 'Rapport hebdomadaire envoyé',
      data: reportData
    });
    
  } catch (error) {
    console.error('❌ Erreur cron:', error);
    return Response.json(
      { error: 'Erreur lors de la génération du rapport' },
      { status: 500 }
    );
  }
}