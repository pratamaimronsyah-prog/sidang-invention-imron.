const slides = [...document.querySelectorAll(".slide")];
const counter = document.getElementById("counter");
const progress = document.getElementById("progress-bar");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const fullscreenButton = document.getElementById("fullscreen");

let current = 0;
let busy = false;

function showSlide(index) {
  if (busy || index === current) return;

  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  if (nextIndex === current) return;

  busy = true;

  const oldSlide = slides[current];
  const newSlide = slides[nextIndex];

  oldSlide.classList.remove("active", "exit-left");
  if (nextIndex > current) {
    oldSlide.classList.add("exit-left");
  }

  newSlide.classList.remove("exit-left");
  newSlide.classList.add("active");

  current = nextIndex;

  counter.textContent =
    String(current + 1).padStart(2, "0") +
    " / " +
    String(slides.length).padStart(2, "0");

  progress.style.width =
    ((current + 1) / slides.length * 100) + "%";

  prevButton.disabled = current === 0;
  nextButton.disabled = current === slides.length - 1;

  window.setTimeout(() => {
    oldSlide.classList.remove("exit-left");
    busy = false;
  }, 650);
}

prevButton.addEventListener("click", () => showSlide(current - 1));
nextButton.addEventListener("click", () => showSlide(current + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    showSlide(current + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showSlide(current - 1);
  }

  if (event.key.toLowerCase() === "f") {
    toggleFullscreen();
  }

  if (event.key === "Home") showSlide(0);
  if (event.key === "End") showSlide(slides.length - 1);
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

fullscreenButton.addEventListener("click", toggleFullscreen);

let touchStartX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(distance) > 70) {
    showSlide(current + (distance < 0 ? 1 : -1));
  }
}, { passive: true });

showSlide(0);
counter.textContent = "01 / " + String(slides.length).padStart(2, "0");
progress.style.width = (100 / slides.length) + "%";
prevButton.disabled = true;
