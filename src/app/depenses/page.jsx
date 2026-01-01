// app/depenses/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, AlertCircle, Euro, Search, Edit, Trash2, Download } from 'lucide-react';

export default function DepensesPage() {
  const router = useRouter();
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDepenses();
  }, [filter]);

  const fetchDepenses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/depenses');
      const data = await response.json();
      setDepenses(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepense = async (id) => {
    if (!confirm('Supprimer cette dépense ?')) return;
    
    try {
      const response = await fetch(`/api/depenses/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchDepenses();
        alert('Dépense supprimée');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'Alimentaire': 'bg-green-100 text-green-800',
      'Boissons': 'bg-blue-100 text-blue-800',
      'Salaires': 'bg-yellow-100 text-yellow-800',
      'Loyer': 'bg-purple-100 text-purple-800',
      'Fournitures': 'bg-gray-100 text-gray-800',
      'Énergie': 'bg-orange-100 text-orange-800',
      'Entretien': 'bg-red-100 text-red-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Autres': 'bg-gray-100 text-gray-800'
    };
    return colors[categorie] || 'bg-gray-100 text-gray-800';
  };

  const categories = ['Toutes', 'Alimentaire', 'Boissons', 'Salaires', 'Loyer', 'Fournitures', 'Énergie', 'Entretien', 'Marketing', 'Autres'];

  const filteredDepenses = depenses.filter(depense => {
    const matchesSearch = 
      depense.fournisseur?.toLowerCase().includes(search.toLowerCase()) ||
      depense.categorie?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategorie = categorieFilter === 'all' || depense.categorie === categorieFilter;
    
    return matchesSearch && matchesCategorie;
  });

  const total = filteredDepenses.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
  const urgentCount = filteredDepenses.filter(d => d.urgent).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📤 Dépenses</h1>
              <p className="text-gray-600">Gestion des achats et frais du restaurant</p>
            </div>
            <button
              onClick={() => router.push('/depenses/nouvelle')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nouvelle dépense
            </button>
          </div>
        </div>

        {/* Stats et filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Carte Total */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total dépenses</p>
                <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)}€</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Euro className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Carte Urgentes */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dépenses urgentes</p>
                <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
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
                    placeholder="Rechercher par fournisseur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Filtre catégorie */}
              <select
                value={categorieFilter}
                onChange={(e) => setCategorieFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'Toutes' ? 'all' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des dépenses */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-500">Chargement des dépenses...</p>
            </div>
          ) : filteredDepenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune dépense</h3>
              <p className="text-gray-500 mb-6">Ajoutez votre première dépense</p>
              <button
                onClick={() => router.push('/depenses/nouvelle')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Ajouter une dépense
              </button>
            </div>
          ) : (
            <>
              {/* En-tête du tableau */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-700">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Catégorie</div>
                <div className="col-span-3">Fournisseur</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-2 text-right">Montant</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Lignes du tableau */}
              <div className="divide-y">
                {filteredDepenses.map((depense) => (
                  <div
                    key={depense.id}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center ${depense.urgent ? 'bg-red-50' : ''}`}
                  >
                    {/* Date */}
                    <div className="col-span-2">
                      <div className="font-medium">
                        {new Date(depense.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(depense.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategorieColor(depense.categorie)}`}>
                        {depense.categorie}
                      </span>
                    </div>

                    {/* Fournisseur */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">
                        {depense.fournisseur || 'Non spécifié'}
                      </div>
                      {depense.description && (
                        <div className="text-sm text-gray-500 truncate">
                          {depense.description}
                        </div>
                      )}
                    </div>

                    {/* Statut */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {depense.urgent && (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Urgent
                          </span>
                        )}
                        {depense.justificatif_url && (
                          <a
                            href={depense.justificatif_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            📎 Justificatif
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="col-span-2 text-right">
                      <div className="text-xl font-bold text-red-700">
                        {parseFloat(depense.montant).toFixed(2)}€
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/depenses/edit/${depense.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDepense(depense.id)}
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
                    {filteredDepenses.length} dépense{filteredDepenses.length > 1 ? 's' : ''}
                    {urgentCount > 0 && ` • ${urgentCount} urgente${urgentCount > 1 ? 's' : ''}`}
                  </div>
                  <div className="text-lg font-bold text-red-700">
                    Total: {total.toFixed(2)}€
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export et actions */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => {
                // Export Excel
                const csv = filteredDepenses.map(d => ({
                  Date: d.date,
                  Catégorie: d.categorie,
                  Fournisseur: d.fournisseur,
                  Montant: d.montant,
                  Urgent: d.urgent ? 'Oui' : 'Non',
                  Description: d.description
                }));
                
                const csvContent = [
                  Object.keys(csv[0]).join(','),
                  ...csv.map(row => Object.values(row).join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `depenses_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter CSV
            </button>
            <button
              onClick={() => {
                // Imprimer
                window.print();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              🖨️ Imprimer
            </button>
          </div>
          <button
            onClick={fetchDepenses}
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        {/* Statistiques par catégorie */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Répartition par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.slice(1).map(categorie => {
              const depensesCat = filteredDepenses.filter(d => d.categorie === categorie);
              const totalCat = depensesCat.reduce((sum, d) => sum + parseFloat(d.montant), 0);
              const pourcentage = total > 0 ? (totalCat / total * 100).toFixed(1) : 0;
              
              return (
                <div key={categorie} className="text-center p-4 border rounded-lg">
                  <div className={`text-2xl mb-2 ${getCategorieColor(categorie).split(' ')[0]}`}>
                    {categorie === 'Alimentaire' && '🛒'}
                    {categorie === 'Boissons' && '🥤'}
                    {categorie === 'Salaires' && '💰'}
                    {categorie === 'Loyer' && '🏠'}
                    {categorie === 'Fournitures' && '📦'}
                    {categorie === 'Énergie' && '⚡'}
                    {categorie === 'Entretien' && '🔧'}
                    {categorie === 'Marketing' && '📢'}
                    {categorie === 'Autres' && '📝'}
                  </div>
                  <div className="text-sm text-gray-500">{categorie}</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">{totalCat.toFixed(2)}€</div>
                  <div className="text-sm text-gray-600">{pourcentage}%</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {depensesCat.length} dépense{depensesCat.length > 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}