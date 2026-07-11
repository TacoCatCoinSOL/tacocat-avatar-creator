const state={gender:"masculine",fur:"#d9812f",stripe:"#8e451b",eyes:"#efa32e",outfit:"Explorer",accessory:"Classic"};
const $=id=>document.getElementById(id);
const $$=sel=>[...document.querySelectorAll(sel)];
function setActive(group,active){group.forEach(b=>b.classList.remove("active"));active.classList.add("active")}
function show(id,on){const el=$(id);if(el)el.style.display=on?"block":"none"}
function updateAvatar(){
  ["head","bodyBase","leftEar","rightEar","leftLeg","rightLeg","leftFoot","rightFoot"].forEach(id=>$(id).setAttribute("fill",state.fur));
  $("tail").setAttribute("stroke",state.fur);
  ["stripe1","stripe2","stripe3","cheekStripeL1","cheekStripeL2","cheekStripeR1","cheekStripeR2","tailStripe1","tailStripe2"].forEach(id=>$(id).setAttribute("stroke",state.stripe));
  $("leftEye").setAttribute("fill",state.eyes);
  $("rightEye").setAttribute("fill",state.eyes);
  show("feminineDetails",state.gender==="feminine");
  ["Explorer","Space","Hoodie"].forEach(name=>show(`outfit${name}`,state.outfit===name));
  show("glassesClassic",state.accessory==="Classic");
  show("headset",state.accessory==="Headset");
  show("crewCap",state.accessory==="Cap");
  show("legendaryTaco",state.accessory==="Taco");
}
$$("[data-gender]").forEach(btn=>btn.addEventListener("click",()=>{state.gender=btn.dataset.gender;setActive($$("[data-gender]"),btn);updateAvatar()}));
$$("#furSwatches .swatch").forEach(btn=>btn.addEventListener("click",()=>{state.fur=btn.dataset.color;state.stripe=btn.dataset.stripe;setActive($$("#furSwatches .swatch"),btn);updateAvatar()}));
$$("#eyeSwatches .swatch").forEach(btn=>btn.addEventListener("click",()=>{state.eyes=btn.dataset.color;setActive($$("#eyeSwatches .swatch"),btn);updateAvatar()}));
$$("[data-outfit]").forEach(btn=>btn.addEventListener("click",()=>{if(btn.dataset.outfit==="Locked"){alert("This outfit unlocks at Chapter 10.");return}state.outfit=btn.dataset.outfit;setActive($$("[data-outfit]"),btn);updateAvatar()}));
$$("[data-accessory]").forEach(btn=>btn.addEventListener("click",()=>{state.accessory=btn.dataset.accessory;setActive($$("[data-accessory]"),btn);updateAvatar()}));
$("randomizeBtn").addEventListener("click",()=>{
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  pick($$("[data-gender]")).click();
  pick($$("#furSwatches .swatch")).click();
  pick($$("#eyeSwatches .swatch")).click();
  pick($$("[data-outfit]").filter(b=>b.dataset.outfit!=="Locked")).click();
  pick($$("[data-accessory]")).click();
});
$("saveBtn").addEventListener("click",()=>{
  const clone=$("avatarSvg").cloneNode(true);
  clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
  const blob=new Blob([new XMLSerializer().serializeToString(clone)],{type:"image/svg+xml;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const img=new Image();
  img.onload=()=>{
    const canvas=document.createElement("canvas");canvas.width=1520;canvas.height=1520;
    canvas.getContext("2d").drawImage(img,0,0,1520,1520);
    URL.revokeObjectURL(url);
    const link=document.createElement("a");
    link.download="my-tacocat-v4.png";
    link.href=canvas.toDataURL("image/png");
    link.click();
  };
  img.src=url;
});
updateAvatar();
