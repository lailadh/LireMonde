// ===== PAGE À LIRE =====
let tousLesLivres = [];
let livreModaleActuel = null;

const alireContainer = document.getElementById("alire-page-container");
const compteur = document.getElementById("compteur-alire");
const searchBar = document.getElementById("search-bar");
const modaleOverlay = document.getElementById("modale-overlay");
const modaleClose = document.getElementById("modale-close");
const modaleImg = document.getElementById("modale-img");
const modaleTitre = document.getElementById("modale-titre");
const modaleAuteur = document.getElementById("modale-auteur");
const modaleGenre = document.getElementById("modale-genre");
const modaleDescription = document.getElementById("modale-description");
const btnModaleAlire = document.getElementById("btn-modale-alire");

// ===== INITIALISATION =====
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  setupEventListeners();
});

// ===== CHARGER =====
async function chargerLivres() {
  tousLesLivres = await getAllLivres();
  afficherLivresALire(tousLesLivres);
}

// ===== AFFICHER =====
function afficherLivresALire(livres) {
  const livresALire = livres.filter((l) => l.aLire);
  alireContainer.innerHTML = "";
  compteur.textContent = `${livresALire.length} livre(s) dans la liste`;

  if (livresALire.length === 0) {
    alireContainer.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <p style="color:#d8a8e8; font-size:18px; margin-bottom:12px;">📚 Votre liste "À lire" est vide.</p>
        <a href="index.html" style="color:#c084fc; text-decoration:underline;">Retourner à l'accueil</a>
      </div>`;
    return;
  }

  livresALire.forEach((livre) => {
    const carte = document.createElement("div");
    carte.className = "carte-alire";
    carte.dataset.id = livre.id;

    const imageSrc =
      livre.couverture && livre.couverture.startsWith("http")
        ? livre.couverture
        : "image/dene.jpg";

    carte.innerHTML = `
      <img src="${imageSrc}" alt="${livre.titre}" onerror="this.src='image/dene.jpg'">
      <div class="carte-info">
        <h3>${livre.titre}</h3>
        <p class="auteur">${livre.auteur}</p>
        <span class="genre-badge">${livre.genre}</span>
        <button class="btn-supprimer" data-id="${livre.id}" title="Retirer de la liste">✕</button>
      </div>
    `;

    carte.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-supprimer")) ouvrirModale(livre);
    });

    carte
      .querySelector(".btn-supprimer")
      .addEventListener("click", async (e) => {
        e.stopPropagation();
        const resultat = await toggleALire(livre.id, false);
        if (resultat) {
          const index = tousLesLivres.findIndex((l) => l.id === livre.id);
          if (index !== -1) tousLesLivres[index].aLire = false;
          afficherLivresALire(tousLesLivres);
        }
      });

    alireContainer.appendChild(carte);
  });
}

// ===== MODALE =====
function ouvrirModale(livre) {
  livreModaleActuel = livre;
  const imageSrc =
    livre.couverture && livre.couverture.startsWith("http")
      ? livre.couverture
      : "image/dene.jpg";
  modaleImg.src = imageSrc;
  modaleImg.onerror = function () {
    this.src = "image/dene.jpg";
  };
  modaleTitre.textContent = livre.titre;
  modaleAuteur.textContent = livre.auteur;
  modaleGenre.textContent = livre.genre;
  modaleDescription.textContent = livre.description;
  btnModaleAlire.innerHTML = "♥ Retirer de ma liste";
  btnModaleAlire.style.background = "#ef4444";
  modaleOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function fermerModale() {
  modaleOverlay.classList.remove("show");
  document.body.style.overflow = "";
  livreModaleActuel = null;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  modaleClose.addEventListener("click", fermerModale);
  modaleOverlay.addEventListener("click", (e) => {
    if (e.target === modaleOverlay) fermerModale();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fermerModale();
  });

  btnModaleAlire.addEventListener("click", async () => {
    if (livreModaleActuel) {
      const resultat = await toggleALire(livreModaleActuel.id, false);
      if (resultat) {
        const index = tousLesLivres.findIndex(
          (l) => l.id === livreModaleActuel.id,
        );
        if (index !== -1) tousLesLivres[index].aLire = false;
        fermerModale();
        afficherLivresALire(tousLesLivres);
      }
    }
  });

  // Recherche en temps réel
  searchBar.addEventListener("input", (e) => {
    const texte = e.target.value.toLowerCase();
    const filtrés = tousLesLivres.filter(
      (l) =>
        l.titre.toLowerCase().includes(texte) ||
        l.auteur.toLowerCase().includes(texte),
    );
    afficherLivresALire(filtrés);
  });
}
