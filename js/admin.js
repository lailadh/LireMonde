let tousLesLivres = [];
let modeEdition = false;
let idEdition = null;

// DOM
const tableauBody = document.getElementById("tableau-body");
const formOverlay = document.getElementById("form-overlay");
const btnOuvrirForm = document.getElementById("btn-ouvrir-form");
const formClose = document.getElementById("form-close");
const btnAnnuler = document.getElementById("btn-annuler");
const btnSauvegarder = document.getElementById("btn-sauvegarder");
const formTitreModal = document.getElementById("form-titre-modal");
const searchBar = document.getElementById("search-bar");

const champId = document.getElementById("form-id");
const champTitre = document.getElementById("form-titre");
const champAuteur = document.getElementById("form-auteur");
const champGenre = document.getElementById("form-genre");
const champCouverture = document.getElementById("form-couverture");
const champDescription = document.getElementById("form-description");
const champAlire = document.getElementById("form-alire");

document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  setupEventListeners();
});

async function chargerLivres() {
  tousLesLivres = await getAllLivres();
  afficherTableau(tousLesLivres);
  mettreAJourStats();
}

function mettreAJourStats() {
  document.getElementById("stat-total").textContent = tousLesLivres.length;
  document.getElementById("stat-alire").textContent = tousLesLivres.filter(
    (l) => l.aLire,
  ).length;
  const genres = new Set(tousLesLivres.map((l) => l.genre));
  document.getElementById("stat-genres").textContent = genres.size;
}

function afficherTableau(livres) {
  tableauBody.innerHTML = "";

  if (livres.length === 0) {
    tableauBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#d8a8e8; padding:30px;">Aucun livre trouvé.</td></tr>`;
    return;
  }

  livres.forEach((livre) => {
    const imageSrc =
      livre.couverture && livre.couverture.startsWith("http")
        ? livre.couverture
        : "image/dene.jpg";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="td-img">
        <img src="${imageSrc}" alt="${livre.titre}" onerror="this.src='image/dene.jpg'" />
      </td>
      <td><strong>${livre.titre}</strong></td>
      <td>${livre.auteur}</td>
      <td><span class="genre-badge">${livre.genre}</span></td>
      <td>
        <span class="td-alire-badge ${livre.aLire ? "badge-oui" : "badge-non"}">
          ${livre.aLire ? "✓ Oui" : "Non"}
        </span>
      </td>
      <td>
        <button class="btn-edit" data-id="${livre.id}">✏️ Modifier</button>
        <button class="btn-delete" data-id="${livre.id}">🗑️ Supprimer</button>
      </td>
    `;

    tr.querySelector(".btn-edit").addEventListener("click", () =>
      ouvrirFormEdition(livre),
    );
    tr.querySelector(".btn-delete").addEventListener("click", () =>
      confirmerSuppression(livre),
    );

    tableauBody.appendChild(tr);
  });
}

function ouvrirFormAjout() {
  modeEdition = false;
  idEdition = null;
  formTitreModal.textContent = "➕ Ajouter un livre";
  champId.value = "";
  champTitre.value = "";
  champAuteur.value = "";
  champGenre.value = "Classique";
  champCouverture.value = "";
  champDescription.value = "";
  champAlire.checked = false;
  formOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function ouvrirFormEdition(livre) {
  modeEdition = true;
  idEdition = livre.id;
  formTitreModal.textContent = "✏️ Modifier le livre";
  champId.value = livre.id;
  champTitre.value = livre.titre;
  champAuteur.value = livre.auteur;
  champGenre.value = livre.genre;
  champCouverture.value = livre.couverture || "";
  champDescription.value = livre.description || "";
  champAlire.checked = livre.aLire;
  formOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function fermerForm() {
  formOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

async function sauvegarder() {
  const titre = champTitre.value.trim();
  const auteur = champAuteur.value.trim();

  if (!titre || !auteur) {
    afficherNotif("Titre et auteur sont obligatoires !", true);
    return;
  }

  const livre = {
    titre,
    auteur,
    genre: champGenre.value,
    couverture: champCouverture.value.trim() || "image/dene.jpg",
    description: champDescription.value.trim(),
    aLire: champAlire.checked,
  };

  let resultat;

  if (modeEdition) {
    resultat = await updateLivre(idEdition, { ...livre, id: idEdition });
    if (resultat) {
      const index = tousLesLivres.findIndex((l) => l.id === idEdition);
      if (index !== -1) tousLesLivres[index] = resultat;
      afficherNotif("Livre modifié avec succès !");
    } else {
      afficherNotif("Erreur lors de la modification.", true);
    }
  } else {
    resultat = await addLivre(livre);
    if (resultat) {
      tousLesLivres.push(resultat);
      afficherNotif("Livre ajouté avec succès !");
    } else {
      afficherNotif("Erreur lors de l'ajout.", true);
    }
  }

  if (resultat) {
    fermerForm();
    afficherTableau(tousLesLivres);
    mettreAJourStats();
  }
}

async function confirmerSuppression(livre) {
  if (!confirm(`Supprimer "${livre.titre}" ?`)) return;

  const ok = await deleteLivre(livre.id);
  if (ok) {
    tousLesLivres = tousLesLivres.filter((l) => l.id !== livre.id);
    afficherTableau(tousLesLivres);
    mettreAJourStats();
    afficherNotif("Livre supprimé !");
  } else {
    afficherNotif("Erreur lors de la suppression.", true);
  }
}

function afficherNotif(message, error = false) {
  const notif = document.getElementById("notif");
  notif.textContent = message;
  notif.className = "notif show" + (error ? " error" : "");
  setTimeout(() => notif.classList.remove("show"), 3000);
}

function setupEventListeners() {
  btnOuvrirForm.addEventListener("click", ouvrirFormAjout);
  formClose.addEventListener("click", fermerForm);
  btnAnnuler.addEventListener("click", fermerForm);
  btnSauvegarder.addEventListener("click", sauvegarder);

  formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) fermerForm();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fermerForm();
  });

  searchBar.addEventListener("input", (e) => {
    const texte = e.target.value.toLowerCase();
    const filtrés = tousLesLivres.filter(
      (l) =>
        l.titre.toLowerCase().includes(texte) ||
        l.auteur.toLowerCase().includes(texte) ||
        l.genre.toLowerCase().includes(texte),
    );
    afficherTableau(filtrés);
  });
}
