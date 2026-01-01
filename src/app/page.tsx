// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🍽️ Restaurant Sidi Ali</h1>
        <p className="text-gray-600">Gestion des recettes et dépenses</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte Nouvelle Recette */}
        <Link href="/recettes/nouvelle">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nouvelle Recette</h2>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-gray-600 mb-4">Enregistrer une vente (midi, soir, à emporter)</p>
            <div className="text-green-600 font-medium">Ajouter →</div>
          </div>
        </Link>
        
        {/* Carte Nouvelle Dépense */}
        <Link href="/depenses/nouvelle">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-red-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nouvelle Dépense</h2>
              <span className="text-2xl">📤</span>
            </div>
            <p className="text-gray-600 mb-4">Enregistrer un achat, frais, salaire...</p>
            <div className="text-red-600 font-medium">Ajouter →</div>
          </div>
        </Link>
        
        {/* Carte Dashboard */}
        <Link href="/dashboard">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Tableau de Bord</h2>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-600 mb-4">Voir les statistiques et rapports</p>
            <div className="text-blue-600 font-medium">Voir →</div>
          </div>
        </Link>
        
        {/* Statistiques rapides */}
        <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Aujourd'hui</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">0€</div>
              <div className="text-sm text-green-600">Recettes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">0€</div>
              <div className="text-sm text-red-600">Dépenses</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">0€</div>
              <div className="text-sm text-blue-600">Bénéfice</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">0</div>
              <div className="text-sm text-purple-600">Transactions</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🚀 Pour commencer :</h3>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>Ajoutez vos premières recettes (ventes du jour)</li>
          <li>Enregistrez vos dépenses (achats, frais)</li>
          <li>Consultez le tableau de bord pour les statistiques</li>
          <li>Configurez les rapports automatiques par email</li>
        </ol>
      </div>
    </div>
  );
}