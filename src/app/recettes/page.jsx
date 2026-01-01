// app/recistes/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Calendar, Euro, Search, Edit, Trash2 } from 'lucide-react';

export default function RecettesPage() {
  const router = useRouter();
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecettes();
  }, [filter]);

  const fetchRecettes = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/api/recettes'
        : `/api/dashboard?periode=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (filter === 'all') {
        setRecettes(data);
      } else {
        setRecettes(data.dernieresRecettes || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecette = async (id) => {
    if (!confirm('Supprimer cette recette ?')) return;
    
    try {
      // Note: Vous devez créer l'API DELETE
      const response = await fetch(`/api/recettes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchRecettes();
        alert('Recette supprimée');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getServiceColor = (service) => {
    switch (service) {
      case 'midi': return 'bg-yellow-100 text-yellow-800';
      case 'soir': return 'bg-indigo-100 text-indigo-800';
      case 'emporter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (mode) => {
    switch (mode) {
      case 'especes': return '💵';
      case 'carte': return '💳';
      case 'ticket_resto': return '🎫';
      case 'virement': return '🏦';
      default: return '💰';
    }
  };

  const filteredRecettes = recettes.filter(recette =>
    recette.commentaire?.toLowerCase().includes(search.toLowerCase()) ||
    recette.service?.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredRecettes.reduce((sum, r) => sum + parseFloat(r.montant || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💰 Recettes</h1>
              <p className="text-gray-600">Gestion des ventes du restaurant</p>
            </div>
            <button
              onClick={() => router.push('/recettes/nouvelle')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nouvelle recette
            </button>
          </div>
        </div>

        {/* Stats et filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Carte Total */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total recettes</p>
                <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)}€</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Euro className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Carte Nombre */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Nombre de transactions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredRecettes.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher par commentaire..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Filtres période */}
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Tout' },
                  { value: 'today', label: 'Aujourd\'hui' },
                  { value: 'week', label: 'Semaine' },
                  { value: 'month', label: 'Mois' }
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${filter === f.value
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des recettes */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-500">Chargement des recettes...</p>
            </div>
          ) : filteredRecettes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune recette</h3>
              <p className="text-gray-500 mb-6">Commencez par ajouter votre première recette</p>
              <button
                onClick={() => router.push('/recettes/nouvelle')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Ajouter une recette
              </button>
            </div>
          ) : (
            <>
              {/* En-tête du tableau */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-700">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Service</div>
                <div className="col-span-3">Détails</div>
                <div className="col-span-2">Paiement</div>
                <div className="col-span-2 text-right">Montant</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Lignes du tableau */}
              <div className="divide-y">
                {filteredRecettes.map((recette) => (
                  <div
                    key={recette.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
                  >
                    {/* Date */}
                    <div className="col-span-2">
                      <div className="font-medium">
                        {new Date(recette.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(recette.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Service */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getServiceColor(recette.service)}`}>
                        {recette.service === 'midi' && '🍽️ '}
                        {recette.service === 'soir' && '🌙 '}
                        {recette.service === 'emporter' && '🚀 '}
                        {recette.service}
                      </span>
                    </div>

                    {/* Détails */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">
                        {recette.commentaire || 'Aucun commentaire'}
                      </div>
                    </div>

                    {/* Paiement */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getPaymentIcon(recette.mode_paiement)}</span>
                        <span className="capitalize">{recette.mode_paiement}</span>
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="col-span-2 text-right">
                      <div className="text-xl font-bold text-green-700">
                        {parseFloat(recette.montant).toFixed(2)}€
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/recettes/edit/${recette.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRecette(recette.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Résumé */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {filteredRecettes.length} recette{filteredRecettes.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    Total: {total.toFixed(2)}€
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export et actions */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => {
              // Fonction d'export à implémenter
              alert('Export à implémenter');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            📥 Exporter en Excel
          </button>
          <button
            onClick={fetchRecettes}
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
}