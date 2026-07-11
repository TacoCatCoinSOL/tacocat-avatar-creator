const state = {
  gender: "masculine",
  fur: "#d89a62",
  eyes: "#69d2ff",
  outfit: "Classic",
  accessory: "None"
};

const byId = (id) => document.getElementById(id);
const all = (selector) => [...document.querySelectorAll(selector)];

function setActive(buttons, activeButton) {
  buttons.forEach((button) => button.classList.remove("active"));
  activeButton.classList.add("active");
}

function updateAvatar() {
  ["head", "body", "leftEar", "rightEar"].forEach((id) => byId(id).setAttribute("fill", state.fur));
  ["leftEye", "rightEye"].forEach((id) => byId(id).setAttribute("fill", state.eyes));

  byId("feminineDetails").style.display = state.gender === "feminine" ? "block" : "none";

  ["Classic", "Hoodie", "Space"].forEach((name) => {
    byId(`outfit${name}`).style.display = state.outfit === name ? "block" : "none";
  });

  ["Glasses", "Headset", "Bandana"].forEach((name) => {
    byId(`accessory${name}`).style.display = state.accessory === name ? "block" : "none";
  });

  byId("lockedOverlay").style.display = state.accessory === "Chapter10" ? "block" : "none";
}

all("[data-gender]").forEach((button) => {
  button.addEventListener("click", () => {
    state.gender = button.dataset.gender;
    setActive(all("[data-gender]"), button);
    updateAvatar();
  });
});

all("#furSwatches .swatch").forEach((button) => {
  button.addEventListener("click", () => {
    state.fur = button.dataset.color;
    setActive(all("#furSwatches .swatch"), button);
    updateAvatar();
  });
});

all("#eyeSwatches .swatch").forEach((button) => {
  button.addEventListener("click", () => {
    state.eyes = button.dataset.color;
    setActive(all("#eyeSwatches .swatch"), button);
    updateAvatar();
  });
});

all("[data-outfit]").forEach((button) => {
  button.addEventListener("click", () => {
    state.outfit = button.dataset.outfit;
    setActive(all("[data-outfit]"), button);
    updateAvatar();
  });
});

all("[data-accessory]").forEach((button) => {
  button.addEventListener("click", () => {
    state.accessory = button.dataset.accessory;
    setActive(all("[data-accessory]"), button);
    updateAvatar();
  });
});

byId("randomizeBtn").addEventListener("click", () => {
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const genderButtons = all("[data-gender]");
  const furButtons = all("#furSwatches .swatch");
  const eyeButtons = all("#eyeSwatches .swatch");
  const outfitButtons = all("[data-outfit]");
  const accessoryButtons = all("[data-accessory]").filter((b) => b.dataset.accessory !== "Chapter10");

  const gender = pick(genderButtons);
  const fur = pick(furButtons);
  const eyes = pick(eyeButtons);
  const outfit = pick(outfitButtons);
  const accessory = pick(accessoryButtons);

  gender.click();
  fur.click();
  eyes.click();
  outfit.click();
  accessory.click();
});

byId("downloadBtn").addEventListener("click", () => {
  const svg = byId("avatarSvg");
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const serializer = new XMLSerializer();
  const svgText = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.download = "my-tacocat-avatar.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    alert("The image could not be saved on this browser.");
  };

  image.src = url;
});

updateAvatar();
