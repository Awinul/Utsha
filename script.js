// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

/* === Starfield Animation === */
(() => {
  const canvas = document.getElementById("space");
  const ctx = canvas.getContext("2d");
  const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  let W = 0, H = 0;

  const near = [], far = [];
  const NEAR_MAX = 140, FAR_MAX = 200;
  const comets = [];
  let lastComet = 0;
  const COMET_COOLDOWN = 5200;

  function resize(){
    W = window.innerWidth * DPR;
    H = window.innerHeight * DPR;
    canvas.width = W; canvas.height = H;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    near.length = 0; far.length = 0;
    for(let i=0;i<NEAR_MAX;i++) near.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.6+.6, tw:Math.random()*6.28, sp:.06+Math.random()* .10});
    for(let i=0;i<FAR_MAX;i++) far.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2+.3, tw:Math.random()*6.28, sp:.02+Math.random()* .05});
  }
  window.addEventListener("resize", resize);
  resize();

  function drawLayer(stars, speed){
    const w = W / DPR, h = H / DPR;
    for(const s of stars){
      const tw = 0.55 + 0.45 * Math.sin(s.tw + performance.now()*0.0012);
      const hue = 210 + Math.sin(s.tw*3 + performance.now()*0.0006)*35;
      ctx.fillStyle = `hsla(${hue}, 80%, 85%, ${0.25 + tw*0.45})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      s.x += speed * s.sp;
      if (s.x > w + 3) s.x = -3;
    }
  }

  function maybeComet(){
    const now = performance.now();
    if (now - lastComet < COMET_COOLDOWN) return;
    if (Math.random() < 0.45){
      const fromLeft = Math.random() < 0.5;
      const w = W / DPR, h = H / DPR;
      const startX = fromLeft ? -100 : w + 100;
      const endX = fromLeft ? w + 140 : -140;
      const startY = Math.random()* (h*0.6) + h*0.1;
      const endY = startY + (Math.random()*140 - 70);
      const steps = 150 + Math.random()*90;
      comets.push({x:startX, y:startY, vx:(endX-startX)/steps, vy:(endY-startY)/steps, life:1});
      lastComet = now;
    }
  }

  function drawComets(){
    for(let i=comets.length-1;i>=0;i--){
      const c = comets[i];
      c.x += c.vx; c.y += c.vy; c.life *= 0.985;
      const tail = 22;
      const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*tail, c.y - c.vy*tail);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx*tail, c.y - c.vy*tail); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.98)";
      ctx.beginPath(); ctx.arc(c.x, c.y, 1.7, 0, Math.PI*2); ctx.fill();
      if (c.life < 0.12) comets.splice(i,1);
    }
  }

  function frame(){
    const w = W / DPR, h = H / DPR;
    ctx.fillStyle = "rgba(6,12,22,0.22)";
    ctx.fillRect(0,0,w,h);
    drawLayer(far, 0.03);
    drawLayer(near, 0.07);
    maybeComet();
    drawComets();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
// ===== About section "See More / See Less" toggle =====
const aboutText = document.getElementById("about-text");
const toggleBtn = document.getElementById("toggle-about");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    aboutText.classList.toggle("expanded");
    toggleBtn.textContent = aboutText.classList.contains("expanded")
      ? "See Less"
      : "See More";
  });
}
