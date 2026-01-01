// lib/email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template email simple
export async function sendWeeklyReport(data) {
  try {
    const { periode, totals, recettesParService, depensesParCategorie } = data;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .card { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .positive { color: #4CAF50; }
          .negative { color: #f44336; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Récap Hebdomadaire - Restaurant Sidi Ali</h1>
            <p>${periode.debut} au ${periode.fin}</p>
          </div>
          
          <div class="card">
            <h2>💰 Synthèse Financière</h2>
            <p><strong>Recettes totales:</strong> ${totals.recettes.toFixed(2)}€</p>
            <p><strong>Dépenses totales:</strong> ${totals.depenses.toFixed(2)}€</p>
            <p><strong>Bénéfice net:</strong> 
              <span class="${totals.benefice >= 0 ? 'positive' : 'negative'}">
                ${totals.benefice.toFixed(2)}€
              </span>
            </p>
          </div>
          
          <div class="card">
            <h2>🍽️ Recettes par Service</h2>
            <table>
              <tr><th>Service</th><th>Montant</th></tr>
              ${recettesParService.map(r => `
                <tr>
                  <td>${r.service}</td>
                  <td>${r.total}€</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div class="card">
            <h2>📉 Dépenses par Catégorie</h2>
            <table>
              <tr><th>Catégorie</th><th>Montant</th></tr>
              ${depensesParCategorie.map(d => `
                <tr>
                  <td>${d.categorie}</td>
                  <td>${d.total}€</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div class="footer">
            <p>Ce rapport est généré automatiquement chaque semaine.</p>
            <p>© ${new Date().getFullYear()} Restaurant Sidi Ali - Gestion de Caisse</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const response = await resend.emails.send({
      from: 'Caisse Restaurant <notifications@votredomaine.com>',
      to: process.env.ADMIN_EMAILS.split(','),
      subject: `💰 Récap Hebdo - ${periode.debut} au ${periode.fin}`,
      html,
    });
    
    console.log('✅ Email envoyé:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

export { resend };