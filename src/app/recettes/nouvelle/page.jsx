// app/recettes/nouvelle/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Euro } from 'lucide-react';

export default function NouvelleRecette() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    service: 'midi',
    montant: '',
    mode_paiement: 'especes',
    commentaire: ''
  });

  const services = [
    { value: 'midi', label: '🍽️ Service Midi' },
    { value: 'soir', label: '🌙 Service Soir' },
    { value: 'emporter', label: '🚀 À emporter' }
  ];

  const modesPaiement = [
    { value: 'especes', label: '💵 Espèces', color: 'text-green-600' },
    { value: 'carte', label: '💳 Carte bancaire', color: 'text-blue-600' },
    { value: 'ticket_resto', label: '🎫 Ticket restaurant', color: 'text-purple-600' },
    { value: 'virement', label: '🏦 Virement', color: 'text-gray-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/recettes', {
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
        alert('✅ Recette enregistrée avec succès !');
        router.push('/recettes');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <h1 className="text-3xl font-bold text-gray-900">💰 Nouvelle Recette</h1>
          <p className="text-gray-600 mt-2">Enregistrez une vente du restaurant</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🍽️ Service
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {services.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, service: service.value })}
                    className={`p-4 rounded-lg border-2 transition-all ${formData.service === service.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-medium">{service.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="inline w-4 h-4 mr-1" />
                Montant (€)
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className={`font-medium ${mode.color}`}>{mode.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Commentaire (optionnel)
              </label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Table 5, Anniversaire, Livraison Uber..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer la recette
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Aide */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 Conseils :</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Sélectionnez le service correspondant (Midi, Soir ou À emporter)</li>
            <li>• Notez le numéro de table ou détail important dans les commentaires</li>
            <li>• Vérifiez le montant avant d'enregistrer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}