// app/depenses/nouvelle/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, Receipt } from 'lucide-react';

export default function NouvelleDepense() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    categorie: 'Alimentaire',
    fournisseur: '',
    montant: '',
    mode_paiement: 'carte',
    urgent: false,
    justificatif_url: ''
  });

  const categories = [
    { value: 'Alimentaire', label: '🛒 Alimentaire', color: 'text-green-600' },
    { value: 'Boissons', label: '🥤 Boissons', color: 'text-blue-600' },
    { value: 'Salaires', label: '💰 Salaires', color: 'text-yellow-600' },
    { value: 'Loyer', label: '🏠 Loyer', color: 'text-purple-600' },
    { value: 'Fournitures', label: '📦 Fournitures', color: 'text-gray-600' },
    { value: 'Énergie', label: '⚡ Énergie', color: 'text-orange-600' },
    { value: 'Entretien', label: '🔧 Entretien', color: 'text-red-600' },
    { value: 'Marketing', label: '📢 Marketing', color: 'text-pink-600' },
    { value: 'Autres', label: '📝 Autres', color: 'text-gray-400' }
  ];

  const modesPaiement = [
    { value: 'carte', label: '💳 Carte bancaire' },
    { value: 'especes', label: '💵 Espèces' },
    { value: 'virement', label: '🏦 Virement' },
    { value: 'cheque', label: '📝 Chèque' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/depenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          montant: parseFloat(formData.montant)
        }),
      });

      if (response.ok) {
        alert('✅ Dépense enregistrée avec succès !');
        router.push('/depenses');
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Receipt className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📤 Nouvelle Dépense</h1>
              <p className="text-gray-600 mt-2">Enregistrez un achat, frais ou salaire</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Date de la dépense
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Catégorie
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((categorie) => (
                  <button
                    key={categorie.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, categorie: categorie.value })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${formData.categorie === categorie.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className={`font-medium ${categorie.color}`}>{categorie.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Fournisseur / Bénéficiaire
              </label>
              <input
                type="text"
                name="fournisseur"
                value={formData.fournisseur}
                onChange={handleChange}
                placeholder="Ex: Metro, EDF, Serveur..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Montant (€)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💳 Mode de paiement
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {modesPaiement.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, mode_paiement: mode.value })}
                    className={`p-3 rounded-lg border transition-all ${formData.mode_paiement === mode.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-medium text-gray-700">{mode.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgent */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <input
                type="checkbox"
                id="urgent"
                name="urgent"
                checked={formData.urgent}
                onChange={handleChange}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <label htmlFor="urgent" className="text-sm font-medium text-yellow-800">
                  Dépense urgente / Critique
                </label>
              </div>
            </div>

            {/* URL du justificatif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📎 URL du justificatif (optionnel)
              </label>
              <input
                type="url"
                name="justificatif_url"
                value={formData.justificatif_url}
                onChange={handleChange}
                placeholder="https://drive.google.com/... ou lien vers photo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Description (optionnel)
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Détails sur cette dépense..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer la dépense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Aide */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 Bonnes pratiques :</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• <strong>Alimentaire</strong> : Achats de nourriture, légumes, viandes...</li>
            <li>• <strong>Boissons</strong> : Vins, sodas, eau, café...</li>
            <li>• <strong>Salaires</strong> : Rémunération du personnel</li>
            <li>• <strong>Loyer</strong> : Paiement du local, charges</li>
            <li>• Marquez <strong>urgent</strong> pour les paiements critiques</li>
            <li>• Gardez les justificatifs (tickets, factures)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}