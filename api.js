const BASE_URL = "http://localhost:3001";

// ============================================
// API - Fonctions de communication avec JSON Server
// ============================================

/**
 * Récupère tous les livres depuis l'API
 * @returns {Promise<Array>} Liste des livres
 */
async function getAllLivres() {
  try {
    const res = await fetch(`${BASE_URL}/livres`);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("Erreur lors du chargement des livres:", e);
    return [];
  }
}

/**
 * Récupère un livre par son ID
 * @param {string|number} id - ID du livre
 * @returns {Promise<Object|null>} Le livre ou null
 */
async function getLivreById(id) {
  try {
    const res = await fetch(`${BASE_URL}/livres/${id}`);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Erreur lors de la récupération du livre ${id}:`, e);
    return null;
  }
}

/**
 * Ajoute un nouveau livre
 * @param {Object} livre - Objet livre à ajouter
 * @returns {Promise<Object|null>} Le livre ajouté ou null
 */
async function addLivre(livre) {
  try {
    const res = await fetch(`${BASE_URL}/livres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livre),
    });
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("Erreur lors de l'ajout du livre:", e);
    return null;
  }
}

/**
 * Met à jour un livre existant (PUT - remplacement complet)
 * @param {string|number} id - ID du livre
 * @param {Object} data - Nouvelles données du livre
 * @returns {Promise<Object|null>} Le livre mis à jour ou null
 */
async function updateLivre(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Erreur lors de la mise à jour du livre ${id}:`, e);
    return null;
  }
}

/**
 * Modifie partiellement un livre (PATCH)
 * @param {string|number} id - ID du livre
 * @param {Object} data - Données partielles à modifier
 * @returns {Promise<Object|null>} Le livre modifié ou null
 */
async function patchLivre(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Erreur lors de la modification du livre ${id}:`, e);
    return null;
  }
}

/**
 * Ajoute ou retire un livre de la liste "À lire"
 * @param {string|number} id - ID du livre
 * @param {boolean} valeur - true pour ajouter, false pour retirer
 * @returns {Promise<Object|null>} Le livre mis à jour ou null
 */
async function toggleALire(id, valeur) {
  return await patchLivre(id, { aLire: valeur });
}

/**
 * Supprime un livre
 * @param {string|number} id - ID du livre
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
async function deleteLivre(id) {
  try {
    const res = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return true;
  } catch (e) {
    console.error(`Erreur lors de la suppression du livre ${id}:`, e);
    return false;
  }
}
