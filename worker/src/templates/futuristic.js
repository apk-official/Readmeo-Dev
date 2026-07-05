// Futuristic template: cyberpunk HUD. Drifting-particle canvas hero, scan-line
// card hovers, circuit SVG, corner brackets, SYS:: section labels.
// Converted from the Futuristic design.
//
// Own dark cyberpunk palette; scheme controls the primary accent (cyan).
// Particles are a lightweight vanilla canvas loop (no library), paused when
// the tab is hidden and disabled under prefers-reduced-motion.

import { esc, faviconHref, metaTags } from "./_helpers.js";

// Futuristic accent options.
export const accents = {
  cyan: "#00F5FF",
  green: "#00FF88",
  magenta: "#FF00E5",
  amber: "#FFB000",
  violet: "#9D5CFF",
};
export const SIGNATURE_ACCENT = "cyan";

export function render(content, scheme, meta = {}) {
  const accentKey = (meta.accent && accents[meta.accent]) ? meta.accent : SIGNATURE_ACCENT;
  const a = accents[accentKey];
  const a2 = "#00FF88"; // secondary accent stays green (unless primary is green)
  const accent2 = accentKey === "green" ? accents.cyan : a2;
  const url = meta.url || "";
  const t = content.section_titles || {};
  const title = {
    about: t.about || "About",
    projects: t.projects || "Projects",
    stack: t.stack || "Stack",
    experience: t.experience || "Experience",
    contact: t.contact || "Contact",
  };

  // rgba helper from hex
  const rgba = (hex, alpha) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  };

  const nameId = content.identity.name.split(" ").map((w) => w[0]).join("").slice(0, 1).toUpperCase();

  // Nav: About, Projects, Contact.
  const navItems = [];
  if (content.about) navItems.push([title.about, "#about"]);
  if (content.projects?.length) navItems.push([title.projects, "#projects"]);
  if (content.contacts?.length) navItems.push([title.contact, "#contact"]);
  const navLinks = navItems.map(([label, href]) =>
    `<a href="${href}" class="navlink" style="font-family:'JetBrains Mono',monospace;color:var(--fg-muted);text-decoration:none;font-size:12px;letter-spacing:1px;text-transform:uppercase;">${esc(label)}</a>`
  ).join("");

  // Projects: featured (full width) + grid.
  const projects = (content.projects || []).slice(0, 3);
  const projectCards = projects.map((p, i) => {
    const featured = i === 0;
    const primaryUrl = p.primary_link === "live" ? (p.live_url || p.repo_url) : (p.repo_url || p.live_url);
    const badge = p.repo_url ? "CODE" : "LIVE";
    const tagColor = featured ? a : accent2;
    return `
    <a href="${esc(primaryUrl || "#")}" class="pcard" style="${featured ? "grid-column:1/-1;" : ""}border:1px solid var(--border);background:var(--card-bg);padding:${featured ? "26px 30px" : "24px 28px"};text-decoration:none;display:block;position:relative;overflow:hidden;">
      <div class="scanline"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;">
        <div style="flex:1;min-width:0;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--fg-muted);margin-bottom:8px;letter-spacing:1px;">// ${featured ? "FEATURED" : String(i + 1).padStart(2, "0")}</div>
          <h3 style="font-size:${featured ? "20px" : "18px"};font-weight:600;margin:0 0 10px;color:var(--fg);">${esc(p.title)}</h3>
          ${p.description ? `<p style="font-size:13.5px;color:rgba(221,240,255,0.6);line-height:1.7;margin:0;max-width:440px;">${esc(p.description)}</p>` : ""}
        </div>
        ${featured ? `<div style="flex-shrink:0;width:52px;height:52px;border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;color:var(--accent);">${esc(nameId)}</div>` : ""}
      </div>
      ${p.tags?.length ? `<div style="display:flex;gap:6px;margin-top:16px;flex-wrap:wrap;position:relative;">${p.tags.slice(0, featured ? 4 : 2).map((tag) => `<span style="border:1px solid ${rgba(tagColor, 0.2)};color:${tagColor};padding:3px 10px;font-family:'JetBrains Mono',monospace;font-size:11px;">${esc(tag)}</span>`).join("")}</div>` : ""}
    </a>`;
  }).join("");

  // Stack chips.
  const stackChips = (content.stack || []).map((s, i) => {
    const col = i % 3 === 2 ? accent2 : a;
    return `<span class="chip" style="border:1px solid var(--border);color:var(--fg-muted);padding:6px 14px;font-family:'JetBrains Mono',monospace;font-size:12px;transition:all .15s;" data-col="${col}">${esc(s.name)}</span>`;
  }).join("");

  // Experience timeline.
  const exp = content.experience || [];
  const experienceRows = exp.map((e, i) => {
    const isLast = i === exp.length - 1;
    const dotColor = i % 2 === 0 ? a : accent2;
    return `
    <div style="display:flex;align-items:flex-start;gap:0;padding-bottom:${isLast ? "0" : "32px"};position:relative;">
      <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;margin-right:24px;width:16px;">
        <div style="width:12px;height:12px;border-radius:50%;background:${dotColor};box-shadow:0 0 12px ${rgba(dotColor, 0.6)};flex-shrink:0;"></div>
        ${isLast ? "" : `<div style="width:1px;flex:1;background:linear-gradient(to bottom,${rgba(dotColor, 0.4)},${rgba(dotColor, 0.05)});min-height:60px;margin-top:4px;"></div>`}
      </div>
      <div class="xpcard" style="flex:1;border:1px solid var(--border);background:var(--card-bg);padding:20px 24px;transition:border-color .2s;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:16px;">
          <h3 style="font-size:15.5px;font-weight:600;margin:0;color:var(--fg);">${esc(e.role)}</h3>
          ${e.period ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--accent);white-space:nowrap;">${esc(e.period)}</span>` : ""}
        </div>
        ${e.organisation ? `<p style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${accent2};margin:0 0 10px;">${esc(e.organisation)}</p>` : ""}
        ${e.description ? `<p style="font-size:13px;color:rgba(221,240,255,0.6);line-height:1.75;margin:0;">${esc(e.description)}</p>` : ""}
      </div>
    </div>`;
  }).join("");

  // Contact buttons (contacts only).
  const contactButtons = (content.contacts || []).map((ct) =>
    `<a href="${esc(ct.value)}" class="pcard" style="border:1px solid var(--accent);background:var(--card-bg);color:var(--accent);padding:14px 26px;text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;"><span class="scanline"></span><span style="position:relative;">${esc(ct.label)} →</span></a>`
  ).join("");

  const footerSocials = (content.socials || []).map((s) =>
    `<a href="${esc(s.url)}" class="navlink" style="font-family:'JetBrains Mono',monospace;color:var(--fg-muted);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;">${esc(s.platform)}</a>`
  ).join("");

  const sysLabel = (label) => `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">[ SYS::${esc(label.toUpperCase())} ]</div>`;

  const corners = `
    <div style="position:absolute;top:0;left:0;width:20px;height:20px;border-top:2px solid var(--accent);border-left:2px solid var(--accent);"></div>
    <div style="position:absolute;top:0;right:0;width:20px;height:20px;border-top:2px solid var(--accent);border-right:2px solid var(--accent);"></div>
    <div style="position:absolute;bottom:0;left:0;width:20px;height:20px;border-bottom:2px solid var(--accent);border-left:2px solid var(--accent);"></div>
    <div style="position:absolute;bottom:0;right:0;width:20px;height:20px;border-bottom:2px solid var(--accent);border-right:2px solid var(--accent);"></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, a)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:#050A0F; --fg:#DDF0FF; --fg-muted:rgba(221,240,255,0.42);
    --border:${rgba(a, 0.13)}; --card-bg:${rgba(a, 0.03)};
    --accent:${a}; --accent-2:${accent2}; --glow:0 0 18px ${rgba(a, 0.18)};
  }
  * { box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:'Space Grotesk',sans-serif; }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes scanMove { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes tracePulse { 0%,100%{stroke-dashoffset:400;opacity:0.15} 50%{stroke-dashoffset:0;opacity:0.4} }
  @keyframes nodePulse { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.6)} }
  .navlink:hover { color:var(--accent) !important; }
  section { scroll-margin-top:56px; }
  /* Scan-line sweep on hover */
  .pcard { transition:border-color .2s, box-shadow .2s; }
  .pcard:hover { border-color:var(--accent); box-shadow:var(--glow); }
  .scanline { position:absolute; top:0; left:0; right:0; height:40%; background:linear-gradient(to bottom, ${rgba(a, 0.12)}, transparent); transform:translateY(-100%); pointer-events:none; }
  .pcard:hover .scanline { animation:cardScan 0.7s ease-out; }
  @keyframes cardScan { 0%{transform:translateY(-100%)} 100%{transform:translateY(260%)} }
  .xpcard:hover { border-color:var(--accent); }
  .chip:hover { border-color:var(--accent); color:var(--accent); box-shadow:0 0 10px ${rgba(a, 0.1)}; }
  @media (prefers-reduced-motion: reduce) {
    #particles { display:none; }
    .scanline, .pcard:hover .scanline { animation:none; display:none; }
  }
  @media (max-width:700px) {
    .navlink { display:none; }
    .about-grid { grid-template-columns:1fr !important; gap:24px !important; }
    .proj-grid { grid-template-columns:1fr !important; }
    .pcard[data-featured] { grid-column:auto !important; }
  }
</style>
</head>
<body>

<div style="position:fixed;inset:0;pointer-events:none;z-index:999;overflow:hidden;">
  <div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${rgba(a, 0.07)},transparent);animation:scanMove 10s linear infinite;"></div>
</div>

<nav style="position:sticky;top:0;z-index:100;background:rgba(5,10,15,0.92);border-bottom:1px solid var(--border);backdrop-filter:blur(10px);padding:0 clamp(24px,6vw,72px);display:flex;align-items:center;justify-content:space-between;height:54px;">
  <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--accent);letter-spacing:2px;">${esc(content.identity.name.split(" ")[0].toUpperCase())}${content.identity.name.split(" ")[1] ? "." + content.identity.name.split(" ")[1].toUpperCase() : ""}</span>
  <div style="display:flex;gap:24px;align-items:center;">${navLinks}</div>
</nav>

<section style="position:relative;min-height:88vh;display:flex;align-items:center;padding:80px clamp(24px,6vw,72px);overflow:hidden;">
  <canvas id="particles" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></canvas>
  <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;">
    <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;">
      <path d="M 0 120 H 150 V 240 H 300 V 120 H 600 V 240 H 750 V 360 H 1200" stroke="${rgba(a, 0.22)}" stroke-width="1.5" fill="none" stroke-dasharray="400" style="animation:tracePulse 7s ease-in-out infinite;"></path>
      <path d="M 0 480 H 300 V 360 H 600 V 480 H 900 V 360 H 1200" stroke="${rgba(accent2, 0.18)}" stroke-width="1.5" fill="none" stroke-dasharray="300" style="animation:tracePulse 9s 2s ease-in-out infinite;"></path>
      <circle cx="150" cy="120" r="3" fill="${a}" style="animation:nodePulse 2.2s ease-in-out infinite;transform-origin:150px 120px;"></circle>
      <circle cx="600" cy="240" r="4" fill="${a}" style="animation:nodePulse 3.1s .6s ease-in-out infinite;transform-origin:600px 240px;"></circle>
      <circle cx="750" cy="360" r="3" fill="${accent2}" style="animation:nodePulse 2.8s .3s ease-in-out infinite;transform-origin:750px 360px;"></circle>
      <path d="M 24 24 L 24 64 M 24 24 L 64 24" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"></path>
      <path d="M 1176 24 L 1176 64 M 1176 24 L 1136 24" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"></path>
      <path d="M 24 576 L 24 536 M 24 576 L 64 576" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"></path>
      <path d="M 1176 576 L 1176 536 M 1176 576 L 1136 576" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.35"></path>
    </svg>
  </div>
  <div style="position:relative;z-index:1;max-width:680px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
      <span style="display:inline-block;width:28px;height:1px;background:var(--accent);"></span>
      // Hello, I'm
    </div>
    <h1 style="font-family:'JetBrains Mono',monospace;font-size:clamp(34px,6vw,66px);font-weight:700;letter-spacing:-2px;margin:0 0 10px;color:var(--fg);line-height:1.0;">${esc(content.identity.name)}<span style="color:var(--accent);animation:blink 1.1s step-end infinite;">_</span></h1>
    ${content.identity.tagline ? `<p style="font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--accent-2);margin:0 0 32px;letter-spacing:0.5px;">&gt; ${esc(content.identity.tagline)}</p>` : ""}
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      ${content.contacts?.length ? `<a href="#contact" style="background:var(--accent);color:#050A0F;padding:11px 24px;text-decoration:none;font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:0.5px;text-transform:uppercase;box-shadow:0 0 20px ${rgba(a, 0.25)};">INIT_CONTACT</a>` : ""}
      ${projects.length ? `<a href="#projects" style="border:1px solid var(--border);color:var(--accent);padding:11px 24px;text-decoration:none;font-size:13px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:0.5px;text-transform:uppercase;">VIEW_WORK</a>` : ""}
    </div>
  </div>
</section>

${content.about ? `<section id="about" style="max-width:1000px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
  <div style="border:1px solid var(--border);background:var(--card-bg);padding:32px 36px;position:relative;">
    ${corners}
    ${sysLabel(title.about)}
    <p style="font-size:15px;color:rgba(221,240,255,0.7);line-height:1.8;margin:0;max-width:640px;">${esc(content.about)}</p>
  </div>
</section>` : ""}

${projects.length ? `<section id="projects" style="max-width:1000px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
  ${sysLabel(title.projects)}
  <div class="proj-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${projectCards}</div>
</section>` : ""}

${content.stack?.length ? `<section id="stack" style="max-width:1000px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
  ${sysLabel(title.stack)}
  <div style="border:1px solid var(--border);background:var(--card-bg);padding:24px 28px;">
    <div style="display:flex;flex-wrap:wrap;gap:8px;">${stackChips}</div>
  </div>
</section>` : ""}

${exp.length ? `<section id="experience" style="max-width:1000px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
  ${sysLabel(title.experience)}
  <div style="display:flex;flex-direction:column;">${experienceRows}</div>
</section>` : ""}

${content.contacts?.length ? `<section id="contact" style="max-width:1000px;margin:0 auto;padding:0 clamp(24px,6vw,72px) 60px;">
  ${sysLabel(title.contact)}
  <div style="display:flex;flex-wrap:wrap;gap:12px;">${contactButtons}</div>
</section>` : ""}

<footer style="border-top:1px solid var(--border);padding:24px clamp(24px,6vw,72px);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;max-width:1000px;margin:0 auto;">
  <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--fg-muted);letter-spacing:1px;">${esc(content.identity.name.toUpperCase())} © 2026</span>
  <div style="display:flex;gap:20px;">${footerSocials}</div>
</footer>

<script>
  (function(){
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var COLOR = '${a}';
    function size(){
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    size();
    var count = Math.min(48, Math.floor(W / 26));
    for (var i=0;i<count;i++){
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6+0.6
      });
    }
    function hexToRgb(h){ var n=parseInt(h.slice(1),16); return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255); }
    var rgb = hexToRgb(COLOR);
    var running = true;
    function draw(){
      if (!running) return;
      ctx.clearRect(0,0,W,H);
      for (var i=0;i<particles.length;i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>W) p.vx*=-1;
        if (p.y<0||p.y>H) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba('+rgb+',0.5)';
        ctx.fill();
        // connect nearby
        for (var j=i+1;j<particles.length;j++){
          var q = particles[j];
          var dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
          if (d<110){
            ctx.beginPath();
            ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
            ctx.strokeStyle = 'rgba('+rgb+','+(0.12*(1-d/110))+')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
    document.addEventListener('visibilitychange', function(){
      running = !document.hidden;
      if (running) draw();
    });
    var rt;
    window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(size,200); });
  })();
</script>
</body>
</html>`;
}

// Futuristic 404: glitching 404, HUD SYS::ERROR card, circuit background.
export function notFound(scheme) {
  const a = "#00F5FF", a2 = "#00FF88";
  const rgba = (hex, al) => { const n=parseInt(hex.slice(1),16); return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${al})`; };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — route not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root { --bg:#050A0F; --fg:#DDF0FF; --fg-muted:rgba(221,240,255,0.42); --border:${rgba(a,0.13)}; --card-bg:${rgba(a,0.03)}; --accent:${a}; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; background:var(--bg); color:var(--fg); font-family:'Space Grotesk',sans-serif; display:flex; align-items:center; justify-content:center; padding:40px; overflow:hidden; }
  @keyframes scanMove { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes glitch { 0%,88%,100%{transform:translate(0);opacity:1} 90%{transform:translate(-4px,2px);opacity:0.8} 92%{transform:translate(4px,-2px)} 94%{transform:translate(-2px,0)} }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
</style>
</head>
<body>
  <div style="position:fixed;inset:0;pointer-events:none;overflow:hidden;"><div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${rgba(a,0.07)},transparent);animation:scanMove 8s linear infinite;"></div></div>
  <div style="max-width:640px;width:100%;text-align:center;">
    <h1 style="font-family:'JetBrains Mono',monospace;font-size:clamp(90px,20vw,180px);font-weight:700;letter-spacing:-6px;margin:0 0 24px;color:var(--fg);line-height:0.9;animation:glitch 4s infinite;">404</h1>
    <div style="border:1px solid var(--border);background:var(--card-bg);padding:28px 32px;position:relative;text-align:left;margin-bottom:28px;">
      <div style="position:absolute;top:0;left:0;width:18px;height:18px;border-top:2px solid var(--accent);border-left:2px solid var(--accent);"></div>
      <div style="position:absolute;top:0;right:0;width:18px;height:18px;border-top:2px solid var(--accent);border-right:2px solid var(--accent);"></div>
      <div style="position:absolute;bottom:0;left:0;width:18px;height:18px;border-bottom:2px solid var(--accent);border-left:2px solid var(--accent);"></div>
      <div style="position:absolute;bottom:0;right:0;width:18px;height:18px;border-bottom:2px solid var(--accent);border-right:2px solid var(--accent);"></div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;text-align:center;">[ SYS::ERROR ]</div>
      <p style="font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(221,240,255,0.6);line-height:1.8;margin:0;text-align:center;">The route you requested could not be resolved. The node may have been decommissioned or the path was never initialized.</p>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--fg-muted);margin-bottom:24px;letter-spacing:1px;">ERR_ROUTE_NOT_FOUND · 0x00000404</div>
    <a href="/" style="background:var(--accent);color:#050A0F;padding:13px 32px;text-decoration:none;font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase;box-shadow:0 0 24px ${rgba(a,0.3)};display:inline-block;">INIT_HOME</a>
  </div>
</body>
</html>`;
}