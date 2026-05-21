// ===== VARIABLES GLOBALES =====
let tousLesLivres = [];
let livresFiltres = [];
let genreActif = "Tous";
let rechercheTexte = "";

// ===== DOM ELEMENTS =====
const livresContainer = document.getElementById("livres-container");
const alireContainer = document.getElementById("alire-container");
const searchBar = document.getElementById("search-bar");
const btnFiltrer = document.getElementById("btn-filtrer");
const filtresDropdown = document.getElementById("filtres-dropdown");
const filtreOptions = document.querySelectorAll(".filtre-option");

// Modale elements
const modaleOverlay = document.getElementById("modale-overlay");
const modaleClose = document.getElementById("modale-close");
const modaleImg = document.getElementById("modale-img");
const modaleTitre = document.getElementById("modale-titre");
const modaleAuteur = document.getElementById("modale-auteur");
const modaleGenre = document.getElementById("modale-genre");
const modaleDescription = document.getElementById("modale-description");
const btnModaleAlire = document.getElementById("btn-modale-alire");

let livreModaleActuel = null;

// ===== INITIALISATION =====
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  setupEventListeners();
});

// ===== CHARGER LES LIVRES =====
async function chargerLivres() {
  tousLesLivres = await getAllLivres();
  livresFiltres = [...tousLesLivres];
  afficherLivres();
  afficherLivresALire();
}

// ===== AFFICHER LES LIVRES (GRILLE PRINCIPALE) =====
function afficherLivres() {
  livresContainer.innerHTML = "";

  if (livresFiltres.length === 0) {
    livresContainer.innerHTML = `<p style="text-align:center; color:#d8a8e8; grid-column:1/-1;">Aucun livre trouvé.</p>`;
    return;
  }

  livresFiltres.forEach((livre) => {
    const carte = creerCarteLivre(livre);
    livresContainer.appendChild(carte);
  });
}

// ===== CRÉER UNE CARTE LIVRE =====
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.className = "carte-livre";
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
      <button class="btn-alire ${livre.aLire ? "active" : ""}" data-id="${livre.id}">
        ${livre.aLire ? "♥" : "♡"}
      </button>
    </div>
  `;

  // Click sur la carte = ouvrir modale
  carte.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-alire")) {
      ouvrirModale(livre);
    }
  });

  // Click sur le bouton cœur
  const btnCoeur = carte.querySelector(".btn-alire");
  btnCoeur.addEventListener("click", async (e) => {
    e.stopPropagation();
    await toggleLivreALire(livre.id, !livre.aLire);
  });

  return carte;
}

// ===== AFFICHER LES LIVRES "À LIRE" =====
function afficherLivresALire() {
  if (!alireContainer) return;
  alireContainer.innerHTML = "";

  const livresALire = tousLesLivres.filter((l) => l.aLire);

  if (livresALire.length === 0) {
    alireContainer.innerHTML = `<p style="text-align:center; color:#d8a8e8; grid-column:1/-1;">Aucun livre dans votre liste "À lire".</p>`;
    return;
  }

  livresALire.forEach((livre) => {
    const carte = creerCarteAlire(livre);
    alireContainer.appendChild(carte);
  });
}

// ===== CRÉER CARTE "À LIRE" =====
function creerCarteAlire(livre) {
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

  // Click sur la carte = ouvrir modale
  carte.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-supprimer")) {
      ouvrirModale(livre);
    }
  });

  // Click sur le bouton supprimer
  const btnSuppr = carte.querySelector(".btn-supprimer");
  btnSuppr.addEventListener("click", async (e) => {
    e.stopPropagation();
    await toggleLivreALire(livre.id, false);
  });

  return carte;
}

// ===== TOGGLE LIVRE À LIRE =====
async function toggleLivreALire(id, aLire) {
  const resultat = await toggleALire(id, aLire);
  if (resultat) {
    const index = tousLesLivres.findIndex((l) => l.id === id);
    if (index !== -1) {
      tousLesLivres[index].aLire = aLire;
    }
    filtrerLivres();
    afficherLivresALire();
    if (livreModaleActuel && livreModaleActuel.id === id) {
      livreModaleActuel.aLire = aLire;
      mettreAJourBoutonModale();
    }
  }
}

// ===== OUVRIR MODALE =====
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

  mettreAJourBoutonModale();
  modaleOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

// ===== METTRE À JOUR BOUTON MODALE =====
function mettreAJourBoutonModale() {
  if (livreModaleActuel.aLire) {
    btnModaleAlire.innerHTML = "♥ Retirer de ma liste";
    btnModaleAlire.style.background = "#ef4444";
  } else {
    btnModaleAlire.innerHTML = "♡ Ajouter à ma liste";
    btnModaleAlire.style.background = "#9333ea";
  }
}

// ===== FERMER MODALE =====
function fermerModale() {
  modaleOverlay.classList.remove("show");
  document.body.style.overflow = "";
  livreModaleActuel = null;
}

// ===== FILTRER LES LIVRES =====
function filtrerLivres() {
  livresFiltres = tousLesLivres.filter((livre) => {
    const matchGenre = genreActif === "Tous" || livre.genre === genreActif;
    const rechercheMin = rechercheTexte.toLowerCase();
    const matchRecherche =
      livre.titre.toLowerCase().includes(rechercheMin) ||
      livre.auteur.toLowerCase().includes(rechercheMin) ||
      livre.genre.toLowerCase().includes(rechercheMin);
    return matchGenre && matchRecherche;
  });

  afficherLivres();
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
  // Toggle dropdown filtres
  btnFiltrer.addEventListener("click", (e) => {
    e.stopPropagation();
    filtresDropdown.classList.toggle("show");
  });

  // Fermer dropdown quand on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!filtresDropdown.contains(e.target) && e.target !== btnFiltrer) {
      filtresDropdown.classList.remove("show");
    }
  });

  // Sélection d'un filtre
  filtreOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtreOptions.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      genreActif = btn.dataset.genre;
      filtrerLivres();
      filtresDropdown.classList.remove("show");
    });
  });

  // Recherche en temps réel
  searchBar.addEventListener("input", (e) => {
    rechercheTexte = e.target.value;
    filtrerLivres();
  });

  // Fermer modale
  modaleClose.addEventListener("click", fermerModale);
  modaleOverlay.addEventListener("click", (e) => {
    if (e.target === modaleOverlay) fermerModale();
  });

  // Bouton modale ajouter/retirer
  btnModaleAlire.addEventListener("click", async () => {
    if (livreModaleActuel) {
      await toggleLivreALire(livreModaleActuel.id, !livreModaleActuel.aLire);
    }
  });

  // Fermer modale avec Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modaleOverlay.classList.contains("show")) {
      fermerModale();
    }
  });
}
