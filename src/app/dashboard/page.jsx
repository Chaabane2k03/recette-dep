// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, CreditCard, 
  Package, Users, Calendar, RefreshCw 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState('today');

  useEffect(() => {
    fetchStats();
  }, [periode]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard?periode=${periode}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données pour les graphiques
  const recettesParServiceData = stats?.recettesParService?.map(item => ({
    name: item.service === 'midi' ? 'Midi' : item.service === 'soir' ? 'Soir' : 'À emporter',
    value: parseFloat(item.total)
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const dernieresRecettesData = stats?.dernieresRecettes?.map(recette => ({
    date: new Date(recette.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    montant: parseFloat(recette.montant)
  })).reverse() || [];

  const statCards = [
    {
      title: 'Recettes totales',
      value: stats?.totals?.recettes ? `${stats.totals.recettes.toFixed(2)}TND` : '0TND',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12%'
    },
    {
      title: 'Dépenses totales',
      value: stats?.totals?.depenses ? `${stats.totals.depenses.toFixed(2)}TND` : '0TND',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-5%'
    },
    {
      title: 'Bénéfice net',
      value: stats?.totals?.benefice ? `${stats.totals.benefice.toFixed(2)}TND` : '0TND',
      icon: TrendingUp,
      color: stats?.totals?.benefice >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: stats?.totals?.benefice >= 0 ? 'bg-blue-50' : 'bg-red-50',
      trend: stats?.totals?.benefice >= 0 ? '+8%' : '-3%'
    },
    {
      title: 'Transactions',
      value: stats?.dernieresRecettes ? stats.dernieresRecettes.length : '0',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+15%'
    }
  ];

  const periodes = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: '7 derniers jours' },
    { value: 'month', label: '30 derniers jours' },
    { value: 'all', label: 'Tout' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Tableau de Bord</h1>
              <p className="text-gray-600">Statistiques et performances du restaurant</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sélecteur de période */}
              <div className="flex bg-white rounded-lg border p-1">
                {periodes.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriode(p.value)}
                    className={`px-4 py-2 rounded-md transition-colors ${periode === p.value
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchStats}
                className="p-2 bg-white border rounded-lg hover:bg-gray-50"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className={`text-sm font-medium ${card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recettes par service */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🍽️ Recettes par service</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recettesParServiceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recettesParServiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}TND`, 'Montant']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Évolution des recettes */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Évolution des recettes</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dernieresRecettesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}TND`, 'Montant']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="montant"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dernières transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dernières recettes */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Dernières recettes</h2>
            <div className="space-y-4">
              {stats?.dernieresRecettes?.slice(0, 5).map((recette) => (
                <div key={recette.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${recette.service === 'midi' ? 'bg-yellow-100' : recette.service === 'soir' ? 'bg-indigo-100' : 'bg-purple-100'}`}>
                      <span className="text-lg">
                        {recette.service === 'midi' ? '🍽️' : recette.service === 'soir' ? '🌙' : '🚀'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{recette.commentaire || 'Sans commentaire'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(recette.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {parseFloat(recette.montant).toFixed(2)}TND
                  </div>
                </div>
              ))}
              {(!stats?.dernieresRecettes || stats.dernieresRecettes.length === 0) && (
                <p className="text-center text-gray-500 py-8">Aucune recette récente</p>
              )}
            </div>
          </div>

          {/* Dernières dépenses */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📉 Dernières dépenses</h2>
            <div className="space-y-4">
              {stats?.dernieresDepenses?.slice(0, 5).map((depense) => (
                <div key={depense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${depense.urgent ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <span className="text-lg">📤</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{depense.categorie}</p>
                      <p className="text-sm text-gray-500">{depense.fournisseur}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-red-700">
                    {parseFloat(depense.montant).toFixed(2)}TND
                  </div>
                </div>
              ))}
              {(!stats?.dernieresDepenses || stats.dernieresDepenses.length === 0) && (
                <p className="text-center text-gray-500 py-8">Aucune dépense récente</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/recettes/nouvelle'}
              className="bg-white border-2 border-green-200 text-green-700 p-4 rounded-lg hover:bg-green-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium">Ajouter une recette</div>
            </button>
            <button
              onClick={() => window.location.href = '/depenses/nouvelle'}
              className="bg-white border-2 border-red-200 text-red-700 p-4 rounded-lg hover:bg-red-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📤</div>
              <div className="font-medium">Ajouter une dépense</div>
            </button>
            <button
              onClick={() => {
                // Fonction d'export
                alert('Export à implémenter');
              }}
              className="bg-white border-2 border-blue-200 text-blue-700 p-4 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📥</div>
              <div className="font-medium">Exporter le rapport</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}