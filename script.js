import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNuZKi1j0uZHyzYsDdzbBA1qzL5iGMKtw",
  authDomain: "mustchrist-commande-9183d.firebaseapp.com",
  databaseURL: "https://mustchrist-commande-9183d-default-rtdb.firebaseio.com",
  projectId: "mustchrist-commande-9183d",
  storageBucket: "mustchrist-commande-9183d.firebasestorage.app",
  messagingSenderId: "342434426007",
  appId: "1:342434426007:web:0deca6a033819b526a0dd2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const MOT_DE_PASSE_ADMIN = "Mustchrist5.@";
let logoOui = false;

function afficherPage(id) {
  document.querySelectorAll(".page").forEach(function(p) {
    p.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

window.afficherPage = afficherPage;

function afficherQuestions(type) {
  document.querySelectorAll(".questions-specifiques").forEach(function(q) {
    q.classList.remove("visible");
  });
  let el = document.getElementById("questions-" + type);
  if (el) el.classList.add("visible");
}

window.afficherQuestions = afficherQuestions;

function afficherAlerteLogo() {
  let val = document.getElementById("logo").value;
  let alerte = document.getElementById("alerte-logo");
  if (val === "oui") {
    alerte.classList.add("visible");
    logoOui = true;
  } else {
    alerte.classList.remove("visible");
    logoOui = false;
  }
}

window.afficherAlerteLogo = afficherAlerteLogo;

function obtenirTypesite() {
  let radios = document.querySelectorAll('input[name="type"]');
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "";
}

function obtenirQuestionsSpecifiques(type) {
  let data = {};
  if (type === "portfolio") {
    data.metier = document.getElementById("p-metier").value;
    data.competences = document.getElementById("p-competences").value;
    data.realisations = document.getElementById("p-realisations").value;
    data.temoignages = document.getElementById("p-temoignages").value;
  } else if (type === "vitrine") {
    data.nomEntreprise = document.getElementById("v-nom").value;
    data.secteur = document.getElementById("v-secteur").value;
    data.adresse = document.getElementById("v-adresse").value;
    data.horaires = document.getElementById("v-horaires").value;
    data.services = document.getElementById("v-services").value;
  } else if (type === "boutique") {
    data.categories = document.getElementById("b-categories").value;
    data.nombre = document.getElementById("b-nombre").value;
    data.prix = document.getElementById("b-prix").value;
    data.livraison = document.getElementById("b-livraison").value;
    data.paiement = document.getElementById("b-paiement").value;
  } else if (type === "blog") {
    data.theme = document.getElementById("bl-theme").value;
    data.frequence = document.getElementById("bl-frequence").value;
    data.public = document.getElementById("bl-public").value;
    data.langue = document.getElementById("bl-langue").value;
  } else if (type === "autre") {
    data.description = document.getElementById("a-description").value;
    data.fonctions = document.getElementById("a-fonctions").value;
  }
  return data;
}

function obtenirDonnees() {
  let type = obtenirTypesite();
  return {
    nom: document.getElementById("nom").value,
    whatsapp: document.getElementById("whatsapp").value,
    email: document.getElementById("email").value,
    ville: document.getElementById("ville").value,
    type: type,
    specifiques: obtenirQuestionsSpecifiques(type),
    couleur: document.getElementById("couleur").value,
    style: document.getElementById("style").value,
    logo: document.getElementById("logo").value,
    facebook: document.getElementById("facebook").value,
    tiktok: document.getElementById("tiktok").value,
    instagram: document.getElementById("instagram").value,
    whatsappBusiness: document.getElementById("whatsappBusiness").value,
    autreReseau: document.getElementById("autreReseau").value,
    budget: document.getElementById("budget").value,
    delai: document.getElementById("delai").value,
    commentaires: document.getElementById("commentaires").value,
    date: new Date().toLocaleDateString("fr-FR"),
    heure: new Date().toLocaleTimeString("fr-FR"),
    numero: "CMD-" + Date.now(),
    lienSite: ""
  };
}

function validerFormulaire(d) {
  if (!d.nom) { alert("Veuillez entrer votre nom complet."); return false; }
  if (!d.whatsapp) { alert("Veuillez entrer votre numéro WhatsApp."); return false; }
  if (!d.ville) { alert("Veuillez entrer votre ville et quartier."); return false; }
  if (!d.type) { alert("Veuillez choisir un type de site."); return false; }
  if (!d.budget) { alert("Veuillez sélectionner votre budget."); return false; }
  if (!d.delai) { alert("Veuillez sélectionner un délai."); return false; }
  return true;
}

function traduireType(v) {
  return {"portfolio":"Portfolio personnel","vitrine":"Site vitrine entreprise","boutique":"Boutique en ligne","blog":"Blog","autre":"Autre"}[v]||v;
}

function traduireStyle(v) {
  return {"moderne":"Moderne et épuré","classique":"Classique et élégant","colore":"Coloré et dynamique","sombre":"Sombre et professionnel"}[v]||v;
}

function traduireLogo(v) {
  return {"oui":"Oui, j'ai un logo","non":"Non, je n'ai pas de logo","creation":"Non, mais je souhaite en créer un"}[v]||v;
}

function traduireBudget(v) {
  return {"5000-15000":"5 000 — 15 000 FCFA","15000-50000":"15 000 — 50 000 FCFA","50000-100000":"50 000 — 100 000 FCFA","100000+":"Plus de 100 000 FCFA","discuter":"A discuter"}[v]||v;
}

function traduireDelai(v) {
  return {"urgent":"Urgent — moins d'une semaine","normal":"Normal — 1 à 2 semaines","flexible":"Flexible — plus de 2 semaines"}[v]||v;
}

function resumeSpecifiques(type, sp) {
  let html = "";
  if (!sp) return html;
  if (type === "portfolio") {
    html += `<div class="resume-item"><span>Métier</span><span>${sp.metier||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Compétences</span><span>${sp.competences||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Réalisations</span><span>${sp.realisations||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Témoignages</span><span>${sp.temoignages||"Non renseigné"}</span></div>`;
  } else if (type === "vitrine") {
    html += `<div class="resume-item"><span>Entreprise</span><span>${sp.nomEntreprise||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Secteur</span><span>${sp.secteur||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Adresse</span><span>${sp.adresse||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Horaires</span><span>${sp.horaires||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Services</span><span>${sp.services||"Non renseigné"}</span></div>`;
  } else if (type === "boutique") {
    html += `<div class="resume-item"><span>Catégories</span><span>${sp.categories||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Nb produits</span><span>${sp.nombre||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Prix</span><span>${sp.prix||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Livraison</span><span>${sp.livraison||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Paiement</span><span>${sp.paiement||"Non renseigné"}</span></div>`;
  } else if (type === "blog") {
    html += `<div class="resume-item"><span>Thème</span><span>${sp.theme||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Fréquence</span><span>${sp.frequence||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Public</span><span>${sp.public||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Langue</span><span>${sp.langue||"Non renseigné"}</span></div>`;
  } else if (type === "autre") {
    html += `<div class="resume-item"><span>Description</span><span>${sp.description||"Non renseigné"}</span></div>`;
    html += `<div class="resume-item"><span>Fonctionnalités</span><span>${sp.fonctions||"Non renseigné"}</span></div>`;
  }
  return html;
}

function previsualiser() {
  let d = obtenirDonnees();
  if (!validerFormulaire(d)) return;
  let html = `
    <div class="resume-section"><h4>Informations personnelles</h4>
      <div class="resume-item"><span>Nom</span><span>${d.nom}</span></div>
      <div class="resume-item"><span>WhatsApp</span><span>${d.whatsapp}</span></div>
      <div class="resume-item"><span>Email</span><span>${d.email||"Non renseigné"}</span></div>
      <div class="resume-item"><span>Ville</span><span>${d.ville}</span></div>
    </div>
    <div class="resume-section"><h4>Type : ${traduireType(d.type)}</h4>
      ${resumeSpecifiques(d.type, d.specifiques)}
    </div>
    <div class="resume-section"><h4>Design et apparence</h4>
      <div class="resume-item"><span>Couleur</span><span>${d.couleur||"Non renseigné"}</span></div>
      <div class="resume-item"><span>Style</span><span>${traduireStyle(d.style)}</span></div>
      <div class="resume-item"><span>Logo</span><span>${traduireLogo(d.logo)}</span></div>
    </div>
    <div class="resume-section"><h4>Réseaux sociaux</h4>
      <div class="resume-item"><span>Facebook</span><span>${d.facebook||"Non renseigné"}</span></div>
      <div class="resume-item"><span>TikTok</span><span>${d.tiktok||"Non renseigné"}</span></div>
      <div class="resume-item"><span>Instagram</span><span>${d.instagram||"Non renseigné"}</span></div>
      <div class="resume-item"><span>WhatsApp Business</span><span>${d.whatsappBusiness||"Non renseigné"}</span></div>
      <div class="resume-item"><span>Autre réseau</span><span>${d.autreReseau||"Non renseigné"}</span></div>
    </div>
    <div class="resume-section"><h4>Budget et délai</h4>
      <div class="resume-item"><span>Budget</span><span>${traduireBudget(d.budget)}</span></div>
      <div class="resume-item"><span>Délai</span><span>${traduireDelai(d.delai)}</span></div>
      <div class="resume-item"><span>Commentaires</span><span>${d.commentaires||"Aucun"}</span></div>
    </div>`;
  document.getElementById("resume-commande").innerHTML = html;
  afficherPage("page-preview");
}

window.previsualiser = previsualiser;

function soumettre() {
  let d = obtenirDonnees();
  if (!validerFormulaire(d)) return;

  let commandesRef = ref(db, "commandes");
  push(commandesRef, d).then(function() {
    document.getElementById("numeroCommande").innerHTML = d.numero;
    let logoMsg = document.getElementById("logo-message");
    let waBtn = document.getElementById("btn-whatsapp-logo");
    if (logoOui) {
      logoMsg.style.display = "block";
      logoMsg.innerHTML = "Vous avez indiqué avoir un logo. Veuillez l'envoyer sur WhatsApp au +229 0152353448 en mentionnant votre numéro de commande.";
      waBtn.style.display = "block";
    } else {
      logoMsg.style.display = "none";
      waBtn.style.display = "none";
    }
    afficherPage("page-confirmation");
  }).catch(function(error) {
    alert("Erreur lors de l'envoi. Vérifiez votre connexion et réessayez !");
  });
}

window.soumettre = soumettre;

function envoyerWhatsApp() {
  let numero = document.getElementById("numeroCommande").innerHTML;
  let message = "Bonjour Mustchrist ! Voici mon logo pour ma commande. Numéro : " + numero;
  window.open("https://wa.me/2290152353448?text=" + encodeURIComponent(message), "_blank");
}

window.envoyerWhatsApp = envoyerWhatsApp;

function copier(id, btn) {
  let element = document.getElementById(id);
  let texte = element.innerText || element.innerHTML;
  let input = document.createElement("textarea");
  input.value = texte;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.focus();
  input.select();
  try {
    document.execCommand("copy");
    let ancienTexte = btn.innerHTML;
    btn.innerHTML = "Copié !";
    btn.style.background = "#006600";
    setTimeout(function() {
      btn.innerHTML = ancienTexte;
      btn.style.background = "#333";
    }, 2000);
  } catch(e) {
    alert("Appuyez longuement sur le texte pour copier manuellement !");
  }
  document.body.removeChild(input);
}

window.copier = copier;

function nouvelleCommande() {
  document.querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], textarea").forEach(function(el) { el.value = ""; });
  document.querySelectorAll("select").forEach(function(el) { el.selectedIndex = 0; });
  document.querySelectorAll("input[type='radio']").forEach(function(el) { el.checked = false; });
  document.querySelectorAll(".questions-specifiques").forEach(function(q) { q.classList.remove("visible"); });
  document.getElementById("alerte-logo").classList.remove("visible");
  logoOui = false;
  afficherPage("page-accueil");
}

window.nouvelleCommande = nouvelleCommande;

function connecterAdmin() {
  let mdp = document.getElementById("motDePasse").value;
  if (mdp === MOT_DE_PASSE_ADMIN) {
    document.getElementById("motDePasse").value = "";
    afficherPageAdmin();
  } else {
    alert("Mot de passe incorrect !");
  }
}

window.connecterAdmin = connecterAdmin;

function afficherPageAdmin() {
  let commandesRef = ref(db, "commandes");
  onValue(commandesRef, function(snapshot) {
    let data = snapshot.val();
    let commandes = [];
    if (data) {
      Object.keys(data).forEach(function(key) {
        commandes.push({key: key, ...data[key]});
      });
      commandes.reverse();
    }

    document.getElementById("stats-admin").innerHTML = `
      <div class="stats-grid">
        <div class="stat-carte"><div class="stat-nombre">${commandes.length}</div><div class="stat-label">Commandes reçues</div></div>
      </div>`;

    let html = "<h3 style='color:orange; margin-bottom:15px;'>Liste des commandes</h3>";
    if (commandes.length === 0) {
      html += "<p style='color:#aaa;'>Aucune commande pour le moment.</p>";
    } else {
      commandes.forEach(function(c) {
        html += `
          <div class="commande-carte">
            <div class="commande-carte-header">
              <h4>${c.nom}</h4>
              <span class="commande-date">${c.date} à ${c.heure}</span>
            </div>
            <div class="commande-detail">
              <strong>Type :</strong> ${traduireType(c.type)}<br>
              <strong>WhatsApp :</strong> ${c.whatsapp}<br>
              <strong>Ville :</strong> ${c.ville}<br>
              <strong>Budget :</strong> ${traduireBudget(c.budget)}<br>
              <strong>Délai :</strong> ${traduireDelai(c.delai)}<br>
              <strong>Numéro :</strong> ${c.numero}
            </div>
            <div class="commande-actions">
              <button class="btn-telecharger" onclick="telechargerCommande('${c.key}')">Télécharger</button>
              <button class="btn-supprimer" onclick="supprimerCommande('${c.key}')">Supprimer</button>
            </div>
            <div style="margin-top:12px; border-top:1px solid #333; padding-top:12px;">
              <p style="color:orange; font-size:13px; margin-bottom:8px;">Déposer le lien du site créé :</p>
              <input type="text" class="champ-lien" id="lien-${c.key}"
              value="${c.lienSite||''}"
              placeholder="Ex: https://nomduclient.netlify.app" />
              <button class="btn-enregistrer" onclick="enregistrerLien('${c.key}')">
              Enregistrer le lien
              </button>
            </div>
          </div>`;
      });
    }
    document.getElementById("liste-commandes").innerHTML = html;
    afficherPage("page-admin");
  }, {onlyOnce: true});
}

window.afficherPageAdmin = afficherPageAdmin;

function enregistrerLien(key) {
  let lien = document.getElementById("lien-" + key).value;
  if (!lien) {
    alert("Veuillez entrer le lien du site !");
    return;
  }
  let commandeRef = ref(db, "commandes/" + key);
  update(commandeRef, {lienSite: lien}).then(function() {
    alert("Lien enregistré avec succès !");
    afficherPageAdmin();
  });
}

window.enregistrerLien = enregistrerLien;

function rechercherCommande() {
  let numero = document.getElementById("numeroRecherche").value.trim();
  if (!numero) {
    alert("Veuillez entrer votre numéro de commande !");
    return;
  }
  let commandesRef = ref(db, "commandes");
  onValue(commandesRef, function(snapshot) {
    let data = snapshot.val();
    let commande = null;
    if (data) {
      Object.keys(data).forEach(function(key) {
        if (data[key].numero === numero) {
          commande = data[key];
        }
      });
    }
    let resultat = document.getElementById("resultat-recherche");
    resultat.style.display = "block";
    if (!commande) {
      resultat.innerHTML = `
        <div class="section-formulaire" style="text-align:center;">
          <p style="color:#ff4444; font-size:15px;">Aucune commande trouvée avec ce numéro.</p>
          <p class="info-texte">Vérifiez votre numéro de commande et réessayez.</p>
        </div>`;
    } else if (!commande.lienSite) {
      resultat.innerHTML = `
        <div class="section-formulaire" style="text-align:center;">
          <p style="color:orange; font-size:15px;">Commande trouvée !</p>
          <p class="info-texte">Bonjour ${commande.nom}, votre site est en cours de création. Mustchrist vous contactera sur WhatsApp dès qu'il sera prêt !</p>
        </div>`;
    } else {
      resultat.innerHTML = `
        <div class="section-formulaire" style="text-align:center;">
          <p style="color:orange; font-size:15px;">Votre site est prêt !</p>
          <p class="info-texte" style="margin-bottom:15px;">Bonjour ${commande.nom} !</p>
          <a href="${commande.lienSite}" target="_blank"
          style="display:block; background:purple; color:white;
          padding:15px; border-radius:8px; text-decoration:none;
          font-size:15px; margin-bottom:10px;">
          Visiter mon site web
          </a>
          <p id="lien-a-copier" style="color:#aaa; font-size:12px;">${commande.lienSite}</p>
          <button class="btn-secondaire" style="margin-top:10px; width:auto; padding:10px 20px;" onclick="copier('lien-a-copier', this)">
          Copier le lien du site
          </button>
        </div>`;
    }
  }, {onlyOnce: true});
}

window.rechercherCommande = rechercherCommande;

function telechargerCommande(key) {
  let commandeRef = ref(db, "commandes/" + key);
  onValue(commandeRef, function(snapshot) {
    let c = snapshot.val();
    if (!c) return;
    let sp = c.specifiques || {};
    let contenu = `COMMANDE — MUSTCHRIST
Numero : ${c.numero}
Date : ${c.date} a ${c.heure}
Nom : ${c.nom}
WhatsApp : ${c.whatsapp}
Email : ${c.email||"Non renseigne"}
Ville : ${c.ville}
Type : ${traduireType(c.type)}
Couleur : ${c.couleur||"Non renseigne"}
Style : ${traduireStyle(c.style)}
Logo : ${traduireLogo(c.logo)}
Facebook : ${c.facebook||"Non renseigne"}
TikTok : ${c.tiktok||"Non renseigne"}
Instagram : ${c.instagram||"Non renseigne"}
WhatsApp Business : ${c.whatsappBusiness||"Non renseigne"}
Autre reseau : ${c.autreReseau||"Non renseigne"}
Budget : ${traduireBudget(c.budget)}
Delai : ${traduireDelai(c.delai)}
Commentaires : ${c.commentaires||"Aucun"}
Details : ${JSON.stringify(sp, null, 2)}
Mustchrist — +229 0152353448`;
    let blob = new Blob([contenu], {type: "text/plain"});
    let lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = "Commande-" + c.nom + "-" + c.numero + ".txt";
    lien.click();
  }, {onlyOnce: true});
}

window.telechargerCommande = telechargerCommande;

function supprimerCommande(key) {
  if (confirm("Voulez-vous vraiment supprimer cette commande ?")) {
    let commandeRef = ref(db, "commandes/" + key);
    remove(commandeRef).then(function() {
      alert("Commande supprimée !");
      afficherPageAdmin();
    });
  }
}

window.supprimerCommande = supprimerCommande;
