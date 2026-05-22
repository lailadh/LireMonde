
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.className = "carte-livre";
  carte.innerHTML = `
    <img src="${livre.couverture}" alt="${livre.titre}" />
    <div class="carte-info">
      <h3>${livre.titre}</h3>
      <p class="auteur">${livre.auteur}</p>
      <span class="genre-badge">${livre.genre}</span>
    </div>
    <button class="btn-alire ${livre.aLire ? "active" : ""}" 
            data-id="${livre.id}" 
            data-alire="${livre.aLire}">
      ${livre.aLire ? "♥" : "♡"}
    </button>
  `;

  carte.querySelector(".carte-info").addEventListener("click", () => {
    ouvrirModale(livre);
  });

  carte.querySelector(".btn-alire").addEventListener("click", async (e) => {
    e.stopPropagation();
    const nouvelleValeur = !livre.aLire;
    const updated = await toggleALire(livre.id, nouvelleValeur);
    if (updated) {
      livre.aLire = nouvelleValeur;
      e.target.textContent = nouvelleValeur ? "♥" : "♡";
      e.target.classList.toggle("active", nouvelleValeur);
      e.target.dataset.alire = nouvelleValeur;

      if (document.body.id === "accueil") {
        const alireContainer = document.getElementById("alire-container");
        if (alireContainer) {
          const livres = await getAllLivres();
          afficherSectionAlire(livres, alireContainer);
        }
      } else if (document.body.id === "alire") {
        initAlire();
      }
    }
  });

  return carte;
}

function afficherSectionAlire(livres, container) {
  const aLire = livres.filter((l) => l.aLire);
  container.innerHTML = "";
  if (aLire.length === 0) {
    container.innerHTML = `<p class="vide">Aucun livre dans votre liste.</p>`;
    return;
  }
  aLire.forEach((l) => {
    const carte = creerCarteLivre(l);
    container.appendChild(carte);
  });
}



function ouvrirModale(livre) {
  const modale = document.getElementById("modale");
  if (!modale) return;

  document.getElementById("modale-img").src = livre.couverture;
  document.getElementById("modale-titre").textContent = livre.titre;
  document.getElementById("modale-auteur").textContent = livre.auteur;
  document.getElementById("modale-genre").textContent = livre.genre;
  document.getElementById("modale-description").textContent = livre.description;

  const btnModale = document.getElementById("btn-modale-alire");
  if (btnModale) {
    mettreAJourBoutonModale(btnModale, livre);
  }

  modale.classList.remove("hidden");
}

function mettreAJourBoutonModale(btnModale, livre) {
  btnModale.textContent = livre.aLire
    ? "♥ Retirer de ma liste"
    : "♡ Ajouter à ma liste";
  btnModale.className = "btn-modale-alire" + (livre.aLire ? " active" : "");

  const newBtn = btnModale.cloneNode(true);
  btnModale.parentNode.replaceChild(newBtn, btnModale);

  newBtn.addEventListener("click", async () => {
    const nouvelleValeur = !livre.aLire;
    const updated = await toggleALire(livre.id, nouvelleValeur);
    if (updated) {
      livre.aLire = nouvelleValeur;
      mettreAJourBoutonModale(newBtn, livre);

      if (document.body.id === "accueil") {
        initAccueil();
      }
    }
  });
}

function fermerModale() {
  document.getElementById("modale")?.classList.add("hidden");
}



async function initAccueil() {
  const container = document.getElementById("livres-container");
  if (!container) return;

  let livres = await getAllLivres();
  let filtreActif = "Tous";

  const genres = ["Tous", ...new Set(livres.map((l) => l.genre))];
  const filtresSection = document.getElementById("filtres-container");
  if (filtresSection) {
    filtresSection.innerHTML = "";
    genres.forEach((genre) => {
      const btn = document.createElement("button");
      btn.className = "btn-filtre" + (genre === "Tous" ? " actif" : "");
      btn.textContent = genre;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".btn-filtre")
          .forEach((b) => b.classList.remove("actif"));
        btn.classList.add("actif");
        filtreActif = genre;
        afficherLivres();
      });
      filtresSection.appendChild(btn);
    });
  }

  const searchBar = document.querySelector(".search-bar");
  searchBar?.addEventListener("input", afficherLivres);

  document
    .getElementById("btn-fermer-modale")
    ?.addEventListener("click", fermerModale);

  document.getElementById("modale")?.addEventListener("click", (e) => {
    if (e.target.id === "modale") fermerModale();
  });

  function afficherLivres() {
    const recherche = searchBar?.value.toLowerCase() || "";
    const filtered = livres.filter((l) => {
      const matchGenre = filtreActif === "Tous" || l.genre === filtreActif;
      const matchRecherche =
        l.titre.toLowerCase().includes(recherche) ||
        l.auteur.toLowerCase().includes(recherche);
      return matchGenre && matchRecherche;
    });

    container.innerHTML = "";
    if (filtered.length === 0) {
      container.innerHTML = `<p class="vide">Aucun livre trouvé.</p>`;
      return;
    }
    filtered.forEach((l) => container.appendChild(creerCarteLivre(l)));
  }

  afficherLivres();

  const alireContainer = document.getElementById("alire-container");
  if (alireContainer) {
    afficherSectionAlire(livres, alireContainer);
  }
}



async function initAlire() {
  const container = document.getElementById("alire-container");
  if (!container) return;

  document
    .getElementById("btn-fermer-modale")
    ?.addEventListener("click", fermerModale);

  document.getElementById("modale")?.addEventListener("click", (e) => {
    if (e.target.id === "modale") fermerModale();
  });

  const searchBar = document.querySelector(".search-bar");
  searchBar?.addEventListener("input", () => afficherAlire());

  async function afficherAlire() {
    const livres = await getAllLivres();
    const recherche = searchBar?.value.toLowerCase() || "";

    const aLire = livres.filter((l) => {
      if (!l.aLire) return false;
      if (!recherche) return true;
      return (
        l.titre.toLowerCase().includes(recherche) ||
        l.auteur.toLowerCase().includes(recherche)
      );
    });

    container.innerHTML = "";

    if (aLire.length === 0) {
      container.innerHTML = `<p class="vide">Aucun livre dans votre liste.</p>`;
      return;
    }

    aLire.forEach((l) => {
      const carte = creerCarteLivre(l);

      const btnSupp = document.createElement("button");
      btnSupp.className = "btn-supprimer";
      btnSupp.textContent = "✕";
      btnSupp.title = "Retirer de ma liste";
      btnSupp.addEventListener("click", async (e) => {
        e.stopPropagation();
        await toggleALire(l.id, false);
        afficherAlire(); 
      });

      carte.appendChild(btnSupp);
      container.appendChild(carte);
    });
  }

  afficherAlire();
}



async function initAdmin() {
  const tbody = document.getElementById("admin-tbody");
  const formOverlay = document.getElementById("form-overlay");
  const adminForm = document.getElementById("admin-form");
  const formTitreModal = document.getElementById("form-titre-modal");

  if (!tbody) return;

  document.getElementById("btn-ajouter")?.addEventListener("click", () => {
    adminForm.reset();
    document.getElementById("form-id").value = "";
    formTitreModal.textContent = "Ajouter un livre";
    formOverlay.classList.remove("hidden");
  });

  function fermerFormulaire() {
    formOverlay?.classList.add("hidden");
  }

  document
    .getElementById("btn-form-close")
    ?.addEventListener("click", fermerFormulaire);
  document
    .getElementById("btn-annuler")
    ?.addEventListener("click", fermerFormulaire);

  formOverlay?.addEventListener("click", (e) => {
    if (e.target === formOverlay) fermerFormulaire();
  });

  async function afficherAdmin() {
    const livres = await getAllLivres();
    tbody.innerHTML = "";

    livres.forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${l.id}</td>
        <td class="td-img"><img src="${l.couverture}" alt="${l.titre}" width="40" /></td>
        <td>${l.titre}</td>
        <td>${l.auteur}</td>
        <td>${l.genre}</td>
        <td>
          <button class="btn-edit" data-id="${l.id}" title="Modifier">✏️</button>
          <button class="btn-delete" data-id="${l.id}" title="Supprimer">🗑️</button>
        </td>
      `;

      tr.querySelector(".btn-delete").addEventListener("click", async () => {
        if (confirm(`Supprimer "${l.titre}" ?`)) {
          const success = await deleteLivre(l.id);
          if (success) afficherAdmin();
        }
      });

      tr.querySelector(".btn-edit").addEventListener("click", () => {
        remplirFormulaire(l);
        formTitreModal.textContent = "Modifier le livre";
        formOverlay.classList.remove("hidden");
      });

      tbody.appendChild(tr);
    });
  }

  function remplirFormulaire(l) {
    document.getElementById("form-id").value = l.id;
    document.getElementById("form-titre").value = l.titre;
    document.getElementById("form-auteur").value = l.auteur;
    document.getElementById("form-genre").value = l.genre;
    document.getElementById("form-description").value = l.description;
    document.getElementById("form-couverture").value = l.couverture;
  }

  adminForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("form-id").value;
    const data = {
      titre: document.getElementById("form-titre").value.trim(),
      auteur: document.getElementById("form-auteur").value.trim(),
      genre: document.getElementById("form-genre").value.trim(),
      description: document.getElementById("form-description").value.trim(),
      couverture: document.getElementById("form-couverture").value.trim(),
      aLire: false,
    };

    let success;
    if (id) {
      success = await updateLivre(id, { ...data, id: id });
    } else {

      success = await addLivre(data);
    }

    if (success) {
      e.target.reset();
      document.getElementById("form-id").value = "";
      fermerFormulaire();
      afficherAdmin();
    }
  });

  afficherAdmin();
}


document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.id;

  switch (page) {
    case "accueil":
      initAccueil();
      break;
    case "alire":
      initAlire();
      break;
    case "admin":
      initAdmin();
      break;
    default:
      console.warn("Page non reconnue:", page);
  }
});
