const BASE_URL = "http://localhost:3001";

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

async function toggleALire(id, valeur) {
  return await patchLivre(id, { aLire: valeur });
}

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
