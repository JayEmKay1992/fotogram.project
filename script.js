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

const shuffledImages = [...images].sort(() => 0.5 - Math.random());
let currentPhotoIndex = 0;

const photoGrid = document.getElementById("photo-grid");
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const photoCounter = document.getElementById("photo-counter");
const closeModal = document.querySelector(".close-modal");
const prevBtn = document.getElementById("prev-photo");
const nextBtn = document.getElementById("next-photo");
const likeBtn = document.getElementById("like-button");
const heartIcon = document.getElementById("heart-icon");

function renderGallery() {
    if (!photoGrid) {
        console.error("Photo grid element not found");
        return;
    }

    photoGrid.innerHTML = ""; // Clear existing content  

    shuffledImages.forEach((imgData, index) => {
        const item = document.createElement("div");
        item.classList.add("photo-item");

        item.tabIndex = 0; // Make div focusable for accessibility

        item.setAttribute("role", "button"); // Set role for screen readers
        item.setAttribute("aria-label", `Open photo: ${imgData.title}`); // Add aria-label for screen readers

        item.innerHTML = `
            <img src="${imgData.url}" alt="${imgData.alt}" title="${imgData.title}">
            `;  

        item.addEventListener("click", () => {
            currentPhotoIndex = index;
            openModal(imgData);
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Prevent default scroll behavior for space key
                currentPhotoIndex = index;
                openModal(imgData);
            }
        });

        photoGrid.appendChild(item);
    });
}

function openModal(imgData) {
    modal.style.display = "flex";
    const currentImgData = shuffledImages[currentPhotoIndex];
    modalImg.src = currentImgData.url;
    modalImg.alt = currentImgData.alt;
    modalCaption.textContent = currentImgData.title;

    photoCounter.textContent = `${currentPhotoIndex + 1} / ${shuffledImages.length}`;

    document.addEventListener("keydown", trapFocus);

    const closeModalBtn = modal.querySelector(".close-modal");
    closeModalBtn.tabIndex = 0; // Ensure close button is focusable
    closeModalBtn.focus(); // Set initial focus to close button

    updateLikeStatus();
}

function handleClose() {
    modal.style.display = "none";
    document.removeEventListener("keydown", trapFocus);

    const allItems = document.querySelectorAll(".photo-item");
    if (allItems[currentPhotoIndex]) {
        allItems[currentPhotoIndex].focus(); // Return focus to the last clicked photo
    }
}

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % shuffledImages.length;
    openModal();
    updateLikeStatus();
}

function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + shuffledImages.length) % shuffledImages.length;
    openModal();
    updateLikeStatus();
}

if (nextBtn) {nextBtn.addEventListener("click", showNextPhoto);} else {console.error("Next button not found");}
if (prevBtn) {prevBtn.addEventListener("click", showPrevPhoto);} else {console.error("Previous button not found");}

if (closeModal) {
    closeModal.addEventListener("click", handleClose);
} else {
    console.error("Close modal button not found");
}

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        handleClose();
    }
});

document.addEventListener("keydown", (event) => {
    if (modal.style.display === "flex") {
        if (event.key === "Escape") {
            handleClose();
        }

        if (event.key === "ArrowRight" && modal.style.display === "flex") {
            showNextPhoto();
        }

        if (event.key === "ArrowLeft" && modal.style.display === "flex") {
            showPrevPhoto();
        }
    }
});

const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(e) {
    if (e.key !== "Tab") return;

    const focusableContent = modal.querySelectorAll(focusableElementsSelector);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
        }
    } else {
        if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
        }
    }
}

function updateLikeStatus() {
    const currentImgData = shuffledImages[currentPhotoIndex];
    const likedImages = JSON.parse(localStorage.getItem("fotogram_likes") || "{}");

    if (likedImages[currentImgData.id]) {
        heartIcon.classList.add("liked");
    } else {
        heartIcon.classList.remove("liked");
    }
}

likeBtn.addEventListener("click", toggleLike);
likeBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent default scroll behavior for space key
        toggleLike();
    }
});

function toggleLike() {
    const currentImgData = shuffledImages[currentPhotoIndex];
    let likedImages = JSON.parse(localStorage.getItem("fotogram_likes") || "{}");

    if (likedImages[currentImgData.id]) {
        delete likedImages[currentImgData.id];
        heartIcon.classList.remove("liked");
    } else {
        likedImages[currentImgData.id] = true;
        heartIcon.classList.add("liked");
    }

    heartIcon.classList.add("animating");
    setTimeout(() => {  
        heartIcon.classList.remove("animating");
    }, 300);

    localStorage.setItem("fotogram_likes", JSON.stringify(likedImages));
}

renderGallery();