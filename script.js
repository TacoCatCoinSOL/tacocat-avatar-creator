(() => {
  "use strict";

  const views = [
    { file: "front.jpg", label: "FRONT VIEW", alt: "TacoCat front view" },
    { file: "three-quarter.jpg", label: "THREE-QUARTER VIEW", alt: "TacoCat three-quarter view" },
    { file: "right.jpg", label: "RIGHT VIEW", alt: "TacoCat right side view" },
    { file: "back.jpg", label: "BACK VIEW", alt: "TacoCat back view" },
    { file: "left.jpg", label: "LEFT VIEW", alt: "TacoCat left side view" }
  ];

  const image = document.getElementById("avatarImage");
  const label = document.getElementById("viewLabel");
  const dots = document.getElementById("viewDots");
  const viewer = document.getElementById("viewer");
  const toast = document.getElementById("toast");
  let current = 0;
  let touchStartX = null;
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function renderDots() {
    dots.innerHTML = "";
    views.forEach((view, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `view-dot${index === current ? " active" : ""}`;
      dot.setAttribute("aria-label", `Show ${view.label.toLowerCase()}`);
      dot.addEventListener("click", () => setView(index));
      dots.appendChild(dot);
    });
  }

  function setView(index) {
    current = (index + views.length) % views.length;
    const view = views[current];
    image.classList.add("switching");
    window.setTimeout(() => {
      image.src = view.file;
      image.alt = view.alt;
      label.textContent = view.label;
      renderDots();
      image.classList.remove("switching");
    }, 110);
  }

  function rotate(direction) {
    setView(current + direction);
  }

  document.getElementById("rotateLeft").addEventListener("click", () => rotate(-1));
  document.getElementById("rotateRight").addEventListener("click", () => rotate(1));
  document.getElementById("randomView").addEventListener("click", () => {
    let next = current;
    while (next === current) next = Math.floor(Math.random() * views.length);
    setView(next);
  });

  document.getElementById("saveView").addEventListener("click", async () => {
    try {
      const response = await fetch(views[current].file);
      if (!response.ok) throw new Error("Image unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `TacoCat-${views[current].label.toLowerCase().replaceAll(" ", "-")}.jpg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      showToast("TacoCat view saved");
    } catch (error) {
      showToast("Hold the image to save it");
    }
  });

  viewer.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  viewer.addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const difference = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(difference) > 45) rotate(difference < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") rotate(-1);
    if (event.key === "ArrowRight") rotate(1);
  });

  document.querySelectorAll("[data-group]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const group = button.dataset.group;
      document.querySelectorAll(`[data-group="${group}"]`).forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      if (group !== "appearance") {
        showToast("Visual layer coming in the next build");
      } else {
        showToast(`${button.textContent.trim()} selected`);
      }
    });
  });

  image.addEventListener("error", () => {
    image.alt = "This TacoCat view could not be loaded";
    showToast("One image file is missing");
  });

  renderDots();
})();
