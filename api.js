const BASE_URL = "http://localhost:3000";

// ===== GET ALL LIVRES =====
async function getAllLivres() {
  try {
    const response = await fetch(`${BASE_URL}/livres`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error);
    return [];
  }
}

// ===== GET LIVRE BY ID =====
async function getLivreById(id) {
  try {
    const response = await fetch(`${BASE_URL}/livres/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération du livre ${id}:`, error);
    return null;
  }
}

// ===== ADD LIVRE =====
async function addLivre(livre) {
  try {
    const response = await fetch(`${BASE_URL}/livres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(livre),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error);
    return null;
  }
}

// ===== UPDATE LIVRE =====
async function updateLivre(id, livre) {
  try {
    const response = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(livre),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la modification du livre ${id}:`, error);
    return null;
  }
}

// ===== DELETE LIVRE =====
async function deleteLivre(id) {
  try {
    const response = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du livre ${id}:`, error);
    return false;
  }
}

// ===== TOGGLE À LIRE =====
async function toggleALire(id, aLire) {
  try {
    const response = await fetch(`${BASE_URL}/livres/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aLire: aLire }),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de aLire pour le livre ${id}:`,
      error,
    );
    return null;
  }
}
