(() => {
  "use strict";

  const orangeViews = [
    { file: "front.jpg", label: "FRONT VIEW", alt: "Orange TacoCat front view" },
    { file: "three-quarter.jpg", label: "THREE-QUARTER VIEW", alt: "Orange TacoCat three-quarter view" },
    { file: "right.jpg", label: "RIGHT VIEW", alt: "Orange TacoCat right side view" },
    { file: "back.jpg", label: "BACK VIEW", alt: "Orange TacoCat back view" },
    { file: "left.jpg", label: "LEFT VIEW", alt: "Orange TacoCat left side view" }
  ];

  const grayFront = {
    file: "male-gray-front.png",
    label: "GRAY FRONT VIEW",
    alt: "Gray TacoCat front view"
  };

  const image = document.getElementById("avatarImage");
  const label = document.getElementById("viewLabel");
  const dots = document.getElementById("viewDots");
  const viewer = document.getElementById("viewer");
  const toast = document.getElementById("toast");

  let current = 0;
  let selectedFur = "orange";
  let touchStartX = null;
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function changeImage(view) {
    image.classList.add("switching");
    setTimeout(() => {
      image.src = view.file;
      image.alt = view.alt;
      label.textContent = view.label;
      image.classList.remove("switching");
    }, 110);
  }

  function renderDots() {
    dots.innerHTML = "";

    if (selectedFur === "gray") {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "view-dot active";
      dot.setAttribute("aria-label", "Gray front view");
      dots.appendChild(dot);
      return;
    }

    orangeViews.forEach((view, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `view-dot${index === current ? " active" : ""}`;
      dot.setAttribute("aria-label", `Show ${view.label.toLowerCase()}`);
      dot.addEventListener("click", () => setView(index));
      dots.appendChild(dot);
    });
  }

  function showCurrentFur() {
    if (selectedFur === "gray") {
      current = 0;
      changeImage(grayFront);
    } else {
      changeImage(orangeViews[current]);
    }
    renderDots();
  }

  function setView(index) {
    if (selectedFur === "gray") {
      showToast("Gray rotation will be added after this color test");
      return;
    }
    current = (index + orangeViews.length) % orangeViews.length;
    showCurrentFur();
  }

  function rotate(direction) {
    setView(current + direction);
  }

  document.getElementById("rotateLeft").addEventListener("click", () => rotate(-1));
  document.getElementById("rotateRight").addEventListener("click", () => rotate(1));

  document.getElementById("randomView").addEventListener("click", () => {
    if (selectedFur === "gray") {
      showToast("Only the gray front view exists right now");
      return;
    }
    let next = current;
    while (next === current) next = Math.floor(Math.random() * orangeViews.length);
    setView(next);
  });

  document.getElementById("saveView").addEventListener("click", async () => {
    const activeView = selectedFur === "gray" ? grayFront : orangeViews[current];

    try {
      const response = await fetch(activeView.file);
      if (!response.ok) throw new Error("Image unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `TacoCat-${selectedFur}-${activeView.label.toLowerCase().replaceAll(" ", "-")}.${activeView.file.endsWith(".png") ? "png" : "jpg"}`;
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
      const value = button.dataset.value;

      document.querySelectorAll(`[data-group="${group}"]`)
        .forEach(item => item.classList.remove("active"));

      button.classList.add("active");

      if (group === "fur") {
        if (value === "orange") {
          selectedFur = "orange";
          showCurrentFur();
          showToast("Orange fur selected");
          return;
        }

        if (value === "gray") {
          selectedFur = "gray";
          showCurrentFur();
          showToast("Gray fur selected");
          return;
        }

        showToast(`${button.getAttribute("aria-label") || value} coming next`);
        return;
      }

      if (group === "appearance") {
        showToast(`${button.textContent.trim()} selected`);
        return;
      }

      showToast("Visual layer coming in the next build");
    });
  });

  image.addEventListener("error", () => {
    image.alt = "This TacoCat image could not be loaded";
    showToast("Image file missing or named incorrectly");
  });

  renderDots();
})();