// Terminal template: an interactive fake terminal. Boot sequence, collapsible
// `ls -la` project rows, `tree skills/`, `git log` experience, and a working
// command bar at the bottom. Converted from the Terminal design.
//
// Own palette (dark terminal); scheme controls only the primary accent.
// Interactivity (collapse rows, command bar) is vanilla JS on the static page.

import { esc, faviconHref, metaTags } from "./_helpers.js";

export function render(content, scheme, meta = {}) {
  const accent = scheme.colors.accent;
  const url = meta.url || "";
  const t = content.section_titles || {};

  // Terminal palette (fixed).
  const c = {
    bg: "#0A0E17", bar: "#0D1220", border: "#1A2538", borderDim: "#141F2E",
    card: "#0D1220", cardDeep: "#090D14",
    green: "#4ADE80", blue: "#60A5FA", yellow: "#FBBF24", pink: "#F472B6",
    fg: "#F1F5F9", text: "#CBD5E1", muted: "#64748B",
    dim: "#334155", dimmer: "#2D3F55", dimmest: "#1E2D42",
  };

  const user = (content.identity.name || "user").toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, "");
  const host = `${user}@portfolio`;

  const prompt = (cmd) =>
    `<span style="color:${c.green};">${esc(host)}</span><span style="color:${c.dim};">:</span><span style="color:${c.blue};">~</span><span style="color:${c.text};">$ </span><span style="color:${c.yellow};">${esc(cmd)}</span>`;

  // ── projects: collapsible ls -la rows ──
  const projects = (content.projects || []).slice(0, 3);
  const dirName = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "/";
  const projectRows = projects.map((p, i) => {
    const tagColor = [c.green, c.blue, c.pink][i % 3];
    const rgba = ["rgba(74,222,128,0.2)", "rgba(96,165,250,0.2)", "rgba(244,114,182,0.2)"][i % 3];
    const links = [
      p.repo_url ? `<a href="${esc(p.repo_url)}" style="color:${c.blue};font-size:11px;text-decoration:none;">→ code</a>` : "",
      p.live_url ? `<a href="${esc(p.live_url)}" style="color:${c.blue};font-size:11px;text-decoration:none;">→ live</a>` : "",
    ].filter(Boolean).join("");
    return `
      <div style="border:1px solid ${c.border};background:${c.card};overflow:hidden;">
        <div class="prow" data-p="${i}" style="padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:12px;flex-wrap:nowrap;transition:background .15s;">
          <span style="color:${c.dimmer};font-size:11px;flex-shrink:0;white-space:nowrap;">drwxr-xr-x</span>
          <span style="color:${c.blue};font-size:13px;font-weight:500;white-space:nowrap;min-width:110px;">${esc(dirName(p.title))}</span>
          <span style="color:#94A3B8;font-size:12px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(p.description || p.title)}</span>
          ${i === 0 ? `<span style="color:${c.green};font-size:10px;border:1px solid rgba(74,222,128,0.25);padding:1px 7px;flex-shrink:0;white-space:nowrap;">FEATURED</span>` : ""}
          <span class="parrow" data-p="${i}" style="color:${c.dimmer};font-size:12px;flex-shrink:0;width:14px;text-align:center;">▸</span>
        </div>
        <div class="pbody" data-p="${i}" style="display:none;padding:16px 20px;border-top:1px solid ${c.border};background:${c.cardDeep};">
          ${p.description ? `<div style="font-size:12px;color:#94A3B8;line-height:1.85;margin-bottom:12px;">${esc(p.description)}</div>` : ""}
          ${p.tags?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${p.tags.slice(0, 6).map((tag) => `<span style="border:1px solid ${rgba};color:${tagColor};font-size:10px;padding:2px 8px;">${esc(tag)}</span>`).join("")}</div>` : ""}
          ${links ? `<div style="display:flex;gap:20px;">${links}</div>` : ""}
        </div>
      </div>`;
  }).join("");

  // ── skills: tree grouped by category ──
  const stackByCat = {};
  (content.stack || []).forEach((s) => {
    const cat = s.category || "tools";
    (stackByCat[cat] ||= []).push(s.name);
  });
  const cats = Object.keys(stackByCat);
  const catColors = [c.blue, c.green, c.pink, c.yellow, "#94A3B8"];
  const skillsTree = cats.map((cat, i) => {
    const last = i === cats.length - 1;
    const color = catColors[i % catColors.length];
    const items = stackByCat[cat].map((n) => `<span style="color:${color};">${esc(n)}</span>`).join(`<span style="color:${c.dimmest};">·</span>`);
    return `<div style="display:flex;gap:16px;align-items:baseline;flex-wrap:wrap;">
      <span style="color:${c.dim};flex-shrink:0;">${last ? "└──" : "├──"} ${esc(cat)}/</span>
      <span style="display:flex;gap:10px;flex-wrap:wrap;align-items:baseline;">${items}</span>
    </div>`;
  }).join("");
  const totalPkgs = (content.stack || []).length;

  // ── experience: git log timeline ──
  const exp = content.experience || [];
  const hashes = ["a3f8c2d", "7b2e1f4", "2d9a8b3", "9c1e5a2", "4f7d8b1"];
  const dotColors = [c.green, c.blue, c.pink];
  const experienceRows = exp.map((e, i) => {
    const isLast = i === exp.length - 1;
    const faded = isLast && exp.length > 2;
    const dotColor = dotColors[i % dotColors.length];
    return `<div style="display:flex;gap:16px;padding-bottom:${isLast ? "0" : "28px"};${faded ? "opacity:0.55;" : ""}">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:16px;">
        <div style="width:10px;height:10px;border-radius:50%;${faded ? `border:1.5px solid ${c.dimmer};background:transparent;` : `background:${dotColor};box-shadow:0 0 8px ${dotColor}55;`}flex-shrink:0;margin-top:3px;"></div>
        ${isLast ? "" : `<div style="width:1px;flex:1;min-height:52px;background:linear-gradient(to bottom,${dotColor}40,${dotColor}08);margin-top:4px;"></div>`}
      </div>
      <div style="flex:1;">
        <div style="font-size:11px;color:${c.dim};margin-bottom:5px;"><span style="color:${faded ? c.dimmer : c.yellow};">${hashes[i % hashes.length]}</span>${i === 0 ? " (HEAD → main)" : ""}${e.period ? ` · ${esc(e.period)}` : ""}</div>
        <div style="font-size:14px;font-weight:500;color:${faded ? "#94A3B8" : c.fg};margin-bottom:3px;">${esc(e.role)}${e.organisation ? ` @ ${esc(e.organisation)}` : ""}</div>
        ${e.description ? `<div style="font-size:12px;color:${c.muted};line-height:1.85;">${esc(e.description)}</div>` : ""}
      </div>
    </div>`;
  }).join("");

  // ── contact: key-value ──
  const allContacts = [
    ...(content.contacts || []).map((ct) => [ct.label.toLowerCase(), ct.label, ct.value]),
    ...(content.socials || []).map((s) => [s.platform.toLowerCase(), s.platform, s.url]),
  ];
  const contactRows = allContacts.map(([key, , val]) =>
    `<span style="color:${c.dim};">[${esc(key)}]</span><a href="${esc(val)}" style="color:${c.blue};text-decoration:none;">${esc(val.replace(/^(https?:\/\/|mailto:|tel:)/, ""))}</a>`
  ).join("");

  const dashDivider = `<div style="border-top:1px dashed ${c.borderDim};margin-bottom:56px;"></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.identity.name)}</title>
<link rel="icon" href="${faviconHref(content, accent)}">
${metaTags(content, url)}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  html { scroll-behavior:smooth; }
  body { margin:0; background:${c.bg}; padding-bottom:58px; }
  * { box-sizing:border-box; }
  ::selection { background:rgba(74,222,128,0.22); }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:${c.bg}; }
  ::-webkit-scrollbar-thumb { background:${c.border}; border-radius:3px; }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
  @keyframes revealDown { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
  input::placeholder { color:${c.dim}; }
  .prow:hover { background:#0F1929; }
  section { scroll-margin-top:52px; }
  .navlink:hover { background:#111D2E; }
</style>
</head>
<body>

<div style="position:sticky;top:0;z-index:100;background:${c.bar};border-bottom:1px solid ${c.border};height:40px;display:flex;align-items:center;padding:0 18px;font-family:'JetBrains Mono',monospace;">
  <div style="display:flex;gap:6px;margin-right:14px;flex-shrink:0;">
    <div style="width:11px;height:11px;border-radius:50%;background:#FF5F56;"></div>
    <div style="width:11px;height:11px;border-radius:50%;background:#FFBD2E;"></div>
    <div style="width:11px;height:11px;border-radius:50%;background:#27C93F;"></div>
  </div>
  <span style="font-size:12px;color:${c.dimmer};margin-right:auto;">${esc(host)}: <span style="color:${c.blue};">~</span></span>
  <div style="display:flex;align-items:stretch;height:40px;">
    <a href="#about" class="navlink" style="display:flex;align-items:center;padding:0 14px;color:${c.green};font-size:11px;text-decoration:none;border-left:1px solid ${c.border};">whoami</a>
    <a href="#projects" class="navlink" style="display:flex;align-items:center;padding:0 14px;color:${c.yellow};font-size:11px;text-decoration:none;border-left:1px solid ${c.border};">ls</a>
    <a href="#contact" class="navlink" style="display:flex;align-items:center;padding:0 14px;color:#94A3B8;font-size:11px;text-decoration:none;border-left:1px solid ${c.border};">contact</a>
  </div>
</div>

<div style="max-width:860px;margin:0 auto;padding:40px clamp(16px,4vw,40px) 20px;font-family:'JetBrains Mono',monospace;color:${c.text};">

  <section style="margin-bottom:64px;">
    <div style="font-size:13px;margin-bottom:24px;">${prompt("./portfolio --init")}</div>
    <div style="display:flex;flex-direction:column;gap:3px;font-size:12px;margin-bottom:20px;">
      <div><span style="color:${c.dimmest};">[</span><span style="color:${c.green};"> OK </span><span style="color:${c.dimmest};">]</span><span style="color:${c.dimmer};"> Loaded </span><span style="color:${c.yellow};">${projects.length}</span><span style="color:${c.dimmer};"> projects · </span><span style="color:${c.blue};">${totalPkgs}</span><span style="color:${c.dimmer};"> skills · </span><span style="color:${c.pink};">${exp.length}</span><span style="color:${c.dimmer};"> roles</span></div>
      <div><span style="color:${c.dimmest};">[</span><span style="color:${c.green};"> OK </span><span style="color:${c.dimmest};">]</span><span style="color:${c.dimmer};"> Status: </span><span style="color:${c.green};">open_to_opportunities</span></div>
    </div>
    <div style="border:1px solid ${c.border};background:${c.card};padding:28px 32px;margin-bottom:24px;">
      <div style="font-size:clamp(34px,5.5vw,58px);font-weight:700;color:${c.fg};letter-spacing:-1.5px;line-height:1;margin-bottom:10px;">${(() => {
        const words = esc(content.identity.name).split(" ");
        const last = words.pop();
        const lead = words.length ? words.join(" ") + " " : "";
        return `${lead}<span style="white-space:nowrap;">${last}<span style="display:inline-block;width:0.5em;height:1em;background:${c.green};margin-left:6px;vertical-align:text-bottom;animation:blink 1.1s step-end infinite;"></span></span>`;
      })()}</div>
      ${content.identity.tagline ? `<div style="font-size:13px;color:${c.green};margin-bottom:4px;">&gt; ${esc(content.identity.tagline)}</div>` : ""}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${allContacts.length ? `<a href="#contact" style="border:1px solid ${c.green};color:${c.green};padding:8px 20px;font-size:12px;text-decoration:none;">$ send_email</a>` : ""}
      ${projects.length ? `<a href="#projects" style="border:1px solid ${c.border};color:${c.dim};padding:8px 20px;font-size:12px;text-decoration:none;">$ ls projects/</a>` : ""}
    </div>
  </section>

  ${dashDivider}

  ${content.about ? `<section id="about" style="margin-bottom:64px;">
    <div style="font-size:13px;margin-bottom:18px;">${prompt("whoami")}</div>
    <div style="border-left:2px solid ${c.border};padding-left:20px;">
      <div style="font-size:12px;color:${c.muted};line-height:1.95;max-width:540px;">
        ${esc(content.about).split(". ").filter(Boolean).map((line) => `<span style="color:${c.dimmest};"># </span>${esc(line)}${line.endsWith(".") ? "" : "."}`).join("<br>")}
      </div>
    </div>
  </section>${dashDivider}` : ""}

  ${projects.length ? `<section id="projects" style="margin-bottom:64px;">
    <div style="font-size:13px;margin-bottom:18px;">${prompt("ls -la projects/")}</div>
    <div style="font-size:11px;color:${c.dimmest};margin-bottom:10px;">total ${projects.length} &nbsp;·&nbsp; sorted by date desc</div>
    <div style="display:flex;flex-direction:column;gap:2px;">${projectRows}</div>
  </section>${dashDivider}` : ""}

  ${content.stack?.length ? `<section id="skills" style="margin-bottom:64px;">
    <div style="font-size:13px;margin-bottom:18px;">${prompt("tree skills/")}</div>
    <div style="font-size:12px;line-height:2.1;padding-left:4px;">
      <div style="color:${c.yellow};">skills/</div>
      ${skillsTree}
      <div style="color:${c.dimmest};font-size:11px;margin-top:4px;line-height:1;">${cats.length} directories &nbsp;·&nbsp; ${totalPkgs} packages</div>
    </div>
  </section>${dashDivider}` : ""}

  ${exp.length ? `<section id="experience" style="margin-bottom:64px;">
    <div style="font-size:13px;margin-bottom:18px;">${prompt('git log --format="%h %s" career.git')}</div>
    <div style="display:flex;flex-direction:column;padding-left:4px;">${experienceRows}</div>
  </section>${dashDivider}` : ""}

  ${allContacts.length ? `<section id="contact" style="margin-bottom:40px;">
    <div style="font-size:13px;margin-bottom:18px;">${prompt("contact --info")}</div>
    <div style="border-left:2px solid ${c.border};padding-left:20px;">
      <div style="display:grid;grid-template-columns:max-content 1fr;gap:6px 24px;font-size:12px;line-height:2;">${contactRows}</div>
    </div>
  </section>` : ""}

  <div style="font-size:13px;color:${c.border};padding-bottom:12px;">
    <span style="color:${c.green};">${esc(host)}</span><span style="color:${c.dimmest};">:</span><span style="color:#1E4080;">~</span><span style="color:${c.dimmest};">$ </span><span style="animation:blink 1.1s step-end infinite;color:${c.dim};">█</span>
  </div>

</div>

<div style="position:fixed;bottom:0;left:0;right:0;background:${c.bar};border-top:1px solid ${c.border};font-family:'JetBrains Mono',monospace;z-index:200;">
  <div id="cmdout" style="display:none;padding:5px 18px;font-size:11px;border-bottom:1px solid ${c.borderDim};gap:14px;overflow:hidden;">
    <span id="cmdlast" style="flex-shrink:0;color:${c.dimmer};"></span>
    <span id="cmdresult"></span>
  </div>
  <div style="display:flex;align-items:center;padding:0 18px;height:40px;">
    <span style="color:${c.green};font-size:12px;white-space:nowrap;user-select:none;margin-right:4px;">${esc(host)}:~$</span>
    <input id="cmd" type="text" placeholder="type 'help' for available commands" style="flex:1;background:transparent;border:none;outline:none;color:${c.text};font-family:'JetBrains Mono',monospace;font-size:12px;padding:0 10px;caret-color:${c.green};" autocomplete="off" />
  </div>
</div>

<script>
  // Collapsible project rows.
  document.querySelectorAll('.prow').forEach(function(row){
    row.addEventListener('click', function(){
      var i = row.getAttribute('data-p');
      var body = document.querySelector('.pbody[data-p="'+i+'"]');
      var arrow = document.querySelector('.parrow[data-p="'+i+'"]');
      var open = body.style.display !== 'none';
      body.style.display = open ? 'none' : 'block';
      if (arrow) arrow.textContent = open ? '▸' : '▾';
    });
  });

  // Command bar.
  var navMap = {
    'whoami':'about','ls':'projects','ls projects':'projects','ls projects/':'projects',
    'ls -la':'projects','ls -la projects':'projects','ls -la projects/':'projects',
    'tree skills':'skills','tree skills/':'skills','skills':'skills',
    'git log':'experience','git log --oneline':'experience','contact':'contact','contact --info':'contact'
  };
  function showOut(cmd, result, color){
    document.getElementById('cmdout').style.display = 'flex';
    document.getElementById('cmdlast').textContent = '$ ' + cmd;
    var r = document.getElementById('cmdresult');
    r.textContent = result; r.style.color = color;
  }
  var input = document.getElementById('cmd');
  input.addEventListener('keydown', function(e){
    if (e.key !== 'Enter') return;
    var raw = input.value.trim(); var cmd = raw.toLowerCase();
    if (!cmd) return;
    input.value = '';
    if (cmd === 'clear') { document.getElementById('cmdout').style.display='none'; return; }
    if (cmd === 'help') { showOut(raw, "whoami · ls projects/ · tree skills/ · git log · contact · clear", '${c.yellow}'); return; }
    var target = navMap[cmd];
    if (target) {
      var el = document.getElementById(target);
      if (el) { var top = el.getBoundingClientRect().top + window.scrollY - 52; window.scrollTo({top:top,behavior:'smooth'}); }
      showOut(raw, '→ jumped to #' + target, '${c.green}');
    } else {
      showOut(raw, "command not found: " + raw + " — try 'help'", '#F87171');
    }
  });
</script>
</body>
</html>`;
}

// Terminal-styled 404 with FAIL output and interactive recovery input.
export function notFound(scheme) {
  const c = { bg: "#0A0E17", bar: "#0D1220", border: "#1A2538", green: "#4ADE80", blue: "#60A5FA", red: "#F87171", text: "#CBD5E1", dim: "#334155", dimmer: "#2D3F55", dimmest: "#1E2D42" };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — command not found</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  body { margin:0; background:${c.bg}; padding-bottom:58px; font-family:'JetBrains Mono',monospace; }
  * { box-sizing:border-box; }
  @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
</style>
</head>
<body>
<div style="position:sticky;top:0;background:${c.bar};border-bottom:1px solid ${c.border};height:40px;display:flex;align-items:center;padding:0 18px;">
  <div style="display:flex;gap:6px;"><div style="width:11px;height:11px;border-radius:50%;background:#FF5F56;"></div><div style="width:11px;height:11px;border-radius:50%;background:#FFBD2E;"></div><div style="width:11px;height:11px;border-radius:50%;background:#27C93F;"></div></div>
  <span style="font-size:12px;color:${c.dimmer};margin-left:14px;">user@portfolio: <span style="color:${c.red};">404</span></span>
</div>
<div style="max-width:860px;margin:0 auto;padding:40px clamp(16px,4vw,40px);color:${c.text};">
  <div style="font-size:13px;margin-bottom:20px;"><span style="color:${c.green};">user@portfolio</span><span style="color:${c.dim};">:</span><span style="color:${c.blue};">~</span><span style="color:${c.text};">$ cd /unknown/path</span></div>
  <div style="display:flex;flex-direction:column;gap:2px;font-size:12px;margin-bottom:32px;">
    <div><span style="color:${c.dimmest};">[</span><span style="color:${c.red};">FAIL</span><span style="color:${c.dimmest};">]</span><span style="color:${c.dimmer};"> bash: cd: /unknown/path: No such file or directory</span></div>
    <div><span style="color:${c.dimmest};">[</span><span style="color:${c.red};">FAIL</span><span style="color:${c.dimmest};">]</span><span style="color:${c.dimmer};"> HTTP 404 — route not found</span></div>
  </div>
  <div style="border:1px solid ${c.border};background:${c.bar};padding:36px 40px;margin-bottom:36px;">
    <div style="font-size:clamp(72px,14vw,130px);font-weight:700;color:#F1F5F9;letter-spacing:-4px;line-height:1;margin-bottom:12px;">404<span style="display:inline-block;width:0.4em;height:0.8em;background:${c.red};margin-left:6px;vertical-align:text-center;animation:blink 1.1s step-end infinite;"></span></div>
    <div style="font-size:14px;color:${c.red};margin-bottom:4px;">&gt; Error: page not found</div>
    <div style="font-size:12px;color:${c.dim};">&gt; The path you navigated to does not exist in the filesystem.</div>
  </div>
  <div style="border-left:2px solid ${c.border};padding-left:20px;">
    <div style="font-size:12px;"><span style="color:${c.dimmest};">drwxr-xr-x</span>  <a href="/" style="color:${c.green};text-decoration:none;font-weight:500;">home/</a>  <span style="color:${c.dim};">– return to the main page</span></div>
  </div>
</div>
</body>
</html>`;
}