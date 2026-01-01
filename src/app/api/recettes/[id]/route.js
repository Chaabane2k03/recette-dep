// app/api/recettes/route.js
import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    console.log(`🗑️ Suppression ID: ${id}`);
    
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const client = await db.connect();
    
    // Supprimer
    await client.sql`
      DELETE FROM recettes WHERE id = ${parseInt(id)}
    `;
    
    return NextResponse.json({
      success: true,
      message: `Recette ${id} supprimée`
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}