/* 1. Array mit Bilddaten für die Galerie, meine "Basisdaten" */

const images = [
    {id: "cherry-blossoms", url: "./img/cherry-blossoms.jpg", title: "Cherry Blossom", alt: "Kirschblüten am Baum"},
    {id: "coastal-path", url: "./img/coastal-path.jpg", title: "Coastal Path", alt: "Klippenpfad am Meer"},
    {id: "forest-road", url: "./img/forest-road.jpg", title: "Forest Road", alt: "Waldweg"},
    {id: "fox", url: "./img/fox.jpg", title: "Fox", alt: "Fuchs"},
    {id: "highland-cow", url: "./img/highland-coo.jpg", title: "Highland Cow", alt: "Highland Kuh"},
    {id: "lighthouse", url: "./img/lighthouse.jpg", title: "Lighthouse", alt: "Leuchtturm in Dänemark"},
    {id: "lynx", url: "./img/lynx.jpg", title: "Lynx", alt: "Luchs"},
    {id: "mountain-lake", url: "./img/mountain-lake.jpg", title: "Mountain Lake", alt: "Bergsee"},
    {id: "nightsky", url: "./img/nightsky.jpg", title: "Night Sky", alt: "Nachthimmel"},
    {id: "scotland", url: "./img/scotland.jpg", title: "Scotland", alt: "Highlands in Schottland"},
    {id: "sunset-beach", url: "./img/sunset-beach.jpg", title: "Sunset Beach", alt: "Sonnenuntergang an der Küste"},
    {id: "wave", url: "./img/wave.jpg", title: "Wave", alt: "Welle"}
];

/* Globale Variablen (Global Scope) für den Zugriff durch jede nachfolgende Funktion */

let shuffledImages = []; // Array für die zufällig angeordneten Bilder, quasi eine "softe Kopie" des originalen images-Arrays, das ich mischen kann, ohne die Originalreihenfolge zu verändern
let currentPhotoIndex = 0; // Index des aktuell angezeigten Fotos im Modal

function init() {
    shuffledImages = [...images].sort(() => 0.5 - Math.random()); // Bilder zufällig anordnen, indem ich eine Kopie des originalen images-Arrays erstelle und diese mische
    renderGallery();
    setupEventListeners();
}

function renderGallery() {
    document.getElementById("photo-grid").innerHTML = shuffledImages.map((img, index) => `
        <button class="photo-item" data-index="${index}" aria-label="Foto: ${img.title} anzeigen">
            <img src="${img.url}" alt="${img.alt}">
        </button>
    `).join(""); // HTML für jedes Foto generieren und in den photo-grid Container einfügen
}

/* Nachfolgend erstelle ich die Funktion für das Modal, das geöffnet wird, 
wenn ein Bild angeklickt wird. Diese Funktion erhält den Index des angeklickten Bildes als Parameter, 
damit ich die entsprechenden Daten aus dem shuffledImages-Array abrufen kann. */

function openModal(index) {
   currentPhotoIndex = index; // Aktuellen Index des angeklickten Fotos speichern, damit ich später zwischen den Fotos navigieren kann
   const modal = document.getElementById("photo-modal");
   const imgData = shuffledImages[currentPhotoIndex]; // Daten des angeklickten Fotos aus dem shuffledImages-Array abrufen

   document.getElementById("modal-img").src = imgData.url; // Bild-URL im Modal setzen
   document.getElementById("modal-img").alt = imgData.alt; // Alt-Text im Modal setzen
   document.getElementById("modal-caption").textContent = imgData.title; // Titel im Modal setzen
   document.getElementById("photo-counter").textContent = `${currentPhotoIndex + 1} / ${shuffledImages.length}`; // Fotocounter im Modal aktualisieren

    modal.showModal(); // Modal anzeigen
    document.querySelector(".close-modal").focus(); // Fokus auf den Schließen-Button setzen, damit Tastatur-User direkt eine Möglichkeit haben, das Modal zu schließen
    updateLikeStatus(); // Like-Status im Modal aktualisieren, damit der Nutzer sofort sieht, ob er das Foto bereits geliked hat oder nicht
}

function closeModal() {
    const modal = document.getElementById("photo-modal");
    modal.close(); // Modal schließen
}

/**
 * @param {number} direction - Richtung der Navigation, entweder -1 für vorheriges Foto oder 1 für nächstes Foto
 */

function changePhoto(direction){
    currentPhotoIndex = (currentPhotoIndex + direction + shuffledImages.length) % shuffledImages.length; // Berechnung des neuen Index unter Berücksichtigung der Array-Länge
    openModal(currentPhotoIndex); // Modal mit dem neuen Foto öffnen
}

function updateLikeStatus() {
    const heartIcon = document.getElementById("heart-icon");
    const likeBtn = document.getElementById("like-btn");
    const currentImgData = shuffledImages[currentPhotoIndex];
    const likes = JSON.parse(localStorage.getItem("fotogram_likes")) || {}; // Objekt aus localStorage abrufen oder leeres Objekt erstellen, wenn keine Daten vorhanden sind

    if (likes[currentImgData.id]) {
        heartIcon.classList.add("liked"); // Herz-Icon als "geliked" markieren
        likeBtn.setAttribute("aria-label", "Gefällt mir nicht mehr"); // ARIA-Label aktualisieren, um den neuen Status widerzuspiegeln
        likeBtn.setAttribute("aria-pressed", "true"); // ARIA-Pressed-Attribut setzen, um den aktiven Zustand anzuzeigen
    } else {
        heartIcon.classList.remove("liked"); // Herz-Icon als "nicht geliked" markieren
        likeBtn.setAttribute("aria-label", "Gefällt mir"); // ARIA-Label aktualisieren, um den neuen Status widerzuspiegeln
        likeBtn.setAttribute("aria-pressed", "false"); // ARIA-Pressed-Attribut setzen, um den inaktiven Zustand anzuzeigen
    }
}

function toggleLike() {
    const currentImg = shuffledImages[currentPhotoIndex];

    let likes = JSON.parse(localStorage.getItem("fotogram_likes")) || {}; // Objekt aus localStorage abrufen oder leeres Objekt erstellen, wenn keine Daten vorhanden sind

    if (likes[currentImg.id]) {
        delete likes[currentImg.id]; // Like entfernen, wenn bereits geliked
    } else {
        likes[currentImg.id] = true; // Like hinzufügen, wenn noch nicht geliked
    }

    localStorage.setItem("fotogram_likes", JSON.stringify(likes)); // Aktualisiertes Objekt zurück in localStorage speichern

    updateLikeStatus(); // Like-Status im Modal aktualisieren
}

function setupEventListeners() {
    const modal = document.getElementById("photo-modal");
    const photoGrid = document.getElementById("photo-grid");

    photoGrid.addEventListener("click", (event) => {
        const photoItem = event.target.closest(".photo-item"); 
        if (photoItem) {
            const index = parseInt(photoItem.getAttribute("data-index")); // Index des angeklickten Fotos aus dem data-Attribut abrufen
            openModal(index); // Modal mit dem entsprechenden Foto öffnen
        }
    });

    document.querySelector(".close-modal").addEventListener("click", () => modal.close()); // Event-Listener für den Schließen-Button im Modal
    document.getElementById("prev-photo").addEventListener("click", () => changePhoto(-1)); // Event-Listener für den "Vorheriges Foto"-Button
    document.getElementById("next-photo").addEventListener("click", () => changePhoto(1)); // Event-Listener für den "Nächstes Foto"-Button
    document.getElementById("like-btn").addEventListener("click", toggleLike); // Event-Listener für den Like-Button

    modal.addEventListener("click", (event) => {
        if (event.target === modal) { // Modal schließen, wenn außerhalb des Inhalts geklickt wird
            modal.close();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (modal.open) { // Nur Tastatur-Shortcuts aktivieren, wenn das Modal geöffnet ist
            if (event.key === "ArrowLeft") {
                changePhoto(-1); // Vorheriges Foto anzeigen
            } else if (event.key === "ArrowRight") {
                changePhoto(1); // Nächstes Foto anzeigen
            } 
        }
});
}


init(); // Initialisierungsfunktion aufrufen, um die Galerie zu starten 