const views = [
  {src:"front.jpg", label:"FRONT"},
  {src:"right.jpg", label:"RIGHT SIDE"},
  {src:"back.jpg", label:"BACK"},
  {src:"left.jpg", label:"LEFT SIDE"},
  {src:"three-quarter.jpg", label:"FRONT 3/4"}
];

let index = 0;
let dragging = false;
let startX = 0;
let lastStepX = 0;

const image = document.getElementById("avatarImage");
const label = document.getElementById("viewLabel");
const viewer = document.getElementById("viewer");
const dots = document.getElementById("dots");

views.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `View ${i + 1}`);
  dot.addEventListener("click", () => setView(i));
  dots.appendChild(dot);
});

function setView(next){
  index = (next + views.length) % views.length;
  image.style.opacity = "0.25";
  setTimeout(() => {
    image.src = views[index].src;
    image.alt = `TacoCat ${views[index].label.toLowerCase()} view`;
    label.textContent = views[index].label;
    [...dots.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
    image.style.opacity = "1";
  }, 80);
}

function rotate(direction){ setView(index + direction); }

document.getElementById("rotateLeft").addEventListener("click", () => rotate(-1));
document.getElementById("rotateRight").addEventListener("click", () => rotate(1));

function pointerStart(x){
  dragging = true;
  startX = x;
  lastStepX = x;
}

function pointerMove(x){
  if(!dragging) return;
  const delta = x - lastStepX;
  if(Math.abs(delta) >= 55){
    rotate(delta < 0 ? 1 : -1);
    lastStepX = x;
  }
}

function pointerEnd(){ dragging = false; }

viewer.addEventListener("pointerdown", e => {
  viewer.setPointerCapture(e.pointerId);
  pointerStart(e.clientX);
});
viewer.addEventListener("pointermove", e => pointerMove(e.clientX));
viewer.addEventListener("pointerup", pointerEnd);
viewer.addEventListener("pointercancel", pointerEnd);

document.getElementById("saveView").addEventListener("click", async () => {
  const response = await fetch(views[index].src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tacocat-${views[index].label.toLowerCase().replaceAll(" ","-")}.jpg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelectorAll(".segmented button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  });
});
document.querySelectorAll(".swatch").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  });
});
document.querySelectorAll(".option").forEach(button => {
  button.addEventListener("click", () => {
    const group = button.parentElement.querySelectorAll(".option");
    group.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  });
});
