/* ============================================================
   SolarCORE Docs — shared behaviour for every page.

   TO ADD A PAGE: create the .html file (copy any page), then add it
   to NAV below. The sidebar, previous/next links and the page order
   all come from this one list.
   ============================================================ */

var NAV = [
  { title: "Getting started", items: [
    ["index.html", "Introduction"],
    ["features.html", "Features"],
    ["installation.html", "Installation"],
    ["configuration.html", "Configuration"]
  ]},
  { title: "User guide", items: [
    ["guide-administrator.html", "Administrator"],
    ["guide-technician.html", "Technician"],
    ["guide-client.html", "Client"]
  ]},
  { title: "Using SolarCORE", items: [
    ["map.html", "The map"],
    ["import-export.html", "Import and export"],
    ["analytics.html", "Analytics and notifications"],
    ["assistant.html", "AI assistant"]
  ]},
  { title: "Operations", items: [
    ["deployment.html", "Deployment and backups"],
    ["security.html", "Security"],
    ["troubleshooting.html", "Troubleshooting and FAQ"]
  ]},
  { title: "About", items: [
    ["credits.html", "Team and credits"]
  ]}
];

(function () {
  "use strict";

  var here = location.pathname.split("/").pop() || "index.html";
  var flat = [];
  NAV.forEach(function (g) { g.items.forEach(function (it) { flat.push(it); }); });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- Sidebar ---------- */
  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    var html = '<input type="search" class="sidebar__search" id="nav-filter" placeholder="Filter pages…" aria-label="Filter pages">';
    NAV.forEach(function (g) {
      html += '<div class="nav-group"><p class="nav-group__title">' + esc(g.title) + "</p><ul>";
      g.items.forEach(function (it) {
        var cur = it[0] === here ? ' aria-current="page"' : "";
        html += '<li><a href="' + it[0] + '"' + cur + ">" + esc(it[1]) + "</a></li>";
      });
      html += "</ul></div>";
    });
    html += '<p class="nav-empty" id="nav-empty" hidden>No page matches.</p>';
    sidebar.innerHTML = html;

    var filter = document.getElementById("nav-filter");
    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      var any = false;
      sidebar.querySelectorAll(".nav-group").forEach(function (group) {
        var shown = 0;
        group.querySelectorAll("li").forEach(function (li) {
          var hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
          li.hidden = !hit;
          if (hit) shown++;
        });
        group.hidden = shown === 0;
        if (shown) any = true;
      });
      document.getElementById("nav-empty").hidden = any;
    });
  }

  /* ---------- Phone menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var scrim = document.createElement("div");
  scrim.className = "scrim";
  document.body.appendChild(scrim);
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("nav-open"));
  });
  scrim.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById("theme-btn");
  function currentTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("sc-docs-theme", next); } catch (e) { /* private mode */ }
  });

  /* ---------- Heading ids and anchors ---------- */
  var doc = document.querySelector(".doc");
  var used = {};
  if (doc) {
    doc.querySelectorAll("h2, h3").forEach(function (h) {
      if (!h.id) {
        var base = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
        var id = base, n = 2;
        while (used[id] || document.getElementById(id)) id = base + "-" + n++;
        h.id = id;
      }
      used[h.id] = true;
      var a = document.createElement("a");
      a.className = "anchor";
      a.href = "#" + h.id;
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "#";
      h.appendChild(a);
    });

    // Ids above are added after the page loads, so a link to page.html#section
    // may have arrived before its target existed: scroll there now.
    if (location.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }

  /* ---------- On this page ---------- */
  var toc = document.getElementById("toc");
  if (toc && doc) {
    var heads = doc.querySelectorAll("h2");
    if (heads.length > 1) {
      var t = '<p class="toc__title">On this page</p><ul>';
      heads.forEach(function (h) {
        var label = h.firstChild ? h.firstChild.textContent : h.textContent;
        t += '<li><a href="#' + h.id + '">' + esc(label.trim()) + "</a></li>";
      });
      toc.innerHTML = t + "</ul>";
      var links = toc.querySelectorAll("a");
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            links.forEach(function (l) {
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id);
            });
          });
        }, { rootMargin: "-70px 0px -70% 0px" });
        heads.forEach(function (h) { obs.observe(h); });
      }
    }
  }

  /* ---------- Copy buttons on code blocks ---------- */
  document.querySelectorAll(".doc pre").forEach(function (pre) {
    var wrap = pre.parentElement;
    if (!wrap.classList.contains("codeblock")) {
      wrap = document.createElement("div");
      wrap.className = "codeblock";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
    }
    if (pre.dataset.label) {
      var lab = document.createElement("span");
      lab.className = "codeblock__label";
      lab.textContent = pre.dataset.label;
      wrap.appendChild(lab);
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var text = pre.innerText.replace(/\n$/, "");
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("is-done");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("is-done"); }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    wrap.appendChild(btn);
  });

  /* ---------- Wrap tables so they scroll on phones ---------- */
  document.querySelectorAll(".doc table").forEach(function (t) {
    if (t.parentElement.classList.contains("table-wrap")) return;
    var w = document.createElement("div");
    w.className = "table-wrap";
    t.parentNode.insertBefore(w, t);
    w.appendChild(t);
  });

  /* ---------- Previous / next ---------- */
  var pager = document.getElementById("pager");
  var idx = -1;
  flat.forEach(function (it, i) { if (it[0] === here) idx = i; });
  if (pager && idx !== -1) {
    var p = "";
    if (idx > 0) p += '<a class="prev" href="' + flat[idx - 1][0] + '"><small>Previous</small><span>← ' + esc(flat[idx - 1][1]) + "</span></a>";
    if (idx < flat.length - 1) p += '<a class="next" href="' + flat[idx + 1][0] + '"><small>Next</small><span>' + esc(flat[idx + 1][1]) + " →</span></a>";
    pager.innerHTML = p;
  }
})();
