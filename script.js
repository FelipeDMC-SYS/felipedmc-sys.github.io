// ===== BUSCADOR EN LA PÁGINA =====
(function () {
  const input = document.getElementById('page-search');
  const controls = document.getElementById('search-controls');
  const countEl = document.getElementById('search-count');
  const prevBtn = document.getElementById('search-prev');
  const nextBtn = document.getElementById('search-next');
  const closeBtn = document.getElementById('search-close');

  if (!input) return;

  let matches = [];
  let current = -1;

  // Quitar todos los resaltados
  function clearHighlights() {
    document.querySelectorAll('mark.search-highlight').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    matches = [];
    current = -1;
    controls.hidden = true;
  }

  // Resaltar todas las coincidencias
  function highlight(query) {
    clearHighlights();
    if (!query || query.length < 2) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Ignorar scripts, estilos y el propio buscador
          if (
            node.parentElement.closest('script, style, .search-box, .nav, .policy-modal')
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const text = node.textContent;
      if (!regex.test(text)) return;

      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        // Texto antes
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        // Resaltado
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = match[0];
        frag.appendChild(mark);
        matches.push(mark);

        lastIndex = regex.lastIndex;
      }
      // Texto después
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(frag, node);
    });

    if (matches.length > 0) {
      controls.hidden = false;
      current = 0;
      updateCurrent();
    } else {
      countEl.textContent = '0 resultados';
      controls.hidden = false;
    }
  }

  function updateCurrent() {
    matches.forEach((m, i) => m.classList.toggle('current', i === current));
    countEl.textContent = `${current + 1} / ${matches.length}`;

    // Hacer scroll hasta el resultado actual
    matches[current].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  // Eventos
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      highlight(input.value.trim());
    }, 250);
  });

  nextBtn.addEventListener('click', () => {
    if (matches.length === 0) return;
    current = (current + 1) % matches.length;
    updateCurrent();
  });

  prevBtn.addEventListener('click', () => {
    if (matches.length === 0) return;
    current = (current - 1 + matches.length) % matches.length;
    updateCurrent();
  });

  closeBtn.addEventListener('click', () => {
    input.value = '';
    clearHighlights();
    input.focus();
  });

  // Tecla Escape para limpiar
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      clearHighlights();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      nextBtn.click();
    }
  });
})();

// ---- WhatsApp button: opens chat with a pre-filled message ----
(function () {
  var phone = "523313999062";
  var message = "¡Hola! Gracias por su atención ✨ Vengo desde la página web de Studio Fairy y me gustaría agendar mi cita de valoración de hairstroke.";
  var whatsappUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
  document.getElementById("whatsapp-btn").setAttribute("href", whatsappUrl);
})();

// ---- Per-service "Agendar cita" buttons: pre-fill WhatsApp with the service name ----
(function () {
  var phone = "523313999062";
  var buttons = document.querySelectorAll(".service-book");

  buttons.forEach(function (btn) {
    var service = btn.getAttribute("data-service") || "";
    var message = "¡Hola! Vengo desde la página web de Studio Fairy y me gustaría agendar una cita para: " + service + ".";
    btn.setAttribute("href", "https://wa.me/" + phone + "?text=" + encodeURIComponent(message));
    // don't let the click also toggle the accordion panel closed/open
    btn.addEventListener("click", function (e) { e.stopPropagation(); });
  });
})();

// ---- Maps link: opens the business address in Google Maps ----
(function () {
  var address = "Juan Valle Nte 23, La Cadena, 48570 Tenamaxtlán, Jal.";
  var mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
  document.getElementById("maps-link").setAttribute("href", mapsUrl);
})();

// ---- Cursor glow: a soft spotlight that follows the mouse ----
(function () {
  var glow = document.getElementById("cursor-glow");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!glow || !canHover || reducedMotion) return;

  window.addEventListener("pointermove", function (e) {
    glow.style.setProperty("--x", e.clientX + "px");
    glow.style.setProperty("--y", e.clientY + "px");
    glow.classList.add("active");
  });

  document.documentElement.addEventListener("mouseleave", function () {
    glow.classList.remove("active");
  });
})();

// ---- Click burst: sparkles that scatter from where you click ----
(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  function spawnBurst(x, y) {
    var ring = document.createElement("div");
    ring.className = "click-burst";
    ring.style.left = x + "px";
    ring.style.top = y + "px";
    document.body.appendChild(ring);
    ring.addEventListener("animationend", function () { ring.remove(); });

    var count = 6;
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      var dist = 36 + Math.random() * 24;
      var sparkle = document.createElement("span");
      sparkle.className = "click-sparkle";
      sparkle.textContent = "✨";
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      sparkle.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      sparkle.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend", function () { this.remove(); });
    }
  }

  document.addEventListener("click", function (e) {
    spawnBurst(e.clientX, e.clientY);
  });
})();




// ---- Category tabs: switch which services-group is visible ----
(function () {
  var tabs = document.querySelectorAll(".category-tab");
  var groups = document.querySelectorAll(".services-group");
 
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var category = tab.getAttribute("data-category");
 
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
 
      groups.forEach(function (group) {
        var isMatch = group.getAttribute("data-category") === category;
        group.classList.toggle("active", isMatch);
 
        // close any open accordion inside the group you're leaving
        if (!isMatch) {
          group.querySelectorAll(".service.open").forEach(function (service) {
            service.classList.remove("open");
            service.querySelector(".service-toggle").setAttribute("aria-expanded", "false");
            service.querySelector(".service-panel").style.maxHeight = null;
          });
        }
      });
    });
  });
})();






// ---- Services accordion: click a service to expand its details ----
(function () {
  var services = document.querySelectorAll(".service");

  services.forEach(function (service) {
    var toggle = service.querySelector(".service-toggle");
    var panel = service.querySelector(".service-panel");

    toggle.addEventListener("click", function () {
      var isOpen = service.classList.contains("open");

      // close any other open service first
      services.forEach(function (other) {
        if (other !== service && other.classList.contains("open")) {
          other.classList.remove("open");
          other.querySelector(".service-toggle").setAttribute("aria-expanded", "false");
          other.querySelector(".service-panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        service.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        service.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();

// ---- Mandatory policies modal ----
(function () {
  var modal = document.getElementById("policy-modal");
  var checkbox = document.getElementById("policy-checkbox");
  var continueBtn = document.getElementById("policy-continue");
  var openLink = document.getElementById("open-policies");
  var STORAGE_KEY = "fairyPoliciesAccepted";

  if (!modal || !checkbox || !continueBtn) return;

  function openModal() {
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  var accepted = false;
  try { accepted = localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) { accepted = false; }

  if (!accepted) openModal();

  checkbox.addEventListener("change", function () {
    continueBtn.disabled = !checkbox.checked;
  });

  continueBtn.addEventListener("click", function () {
    if (!checkbox.checked) return;
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch (e) {}
    closeModal();
  });

  if (openLink) {
    openLink.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  }
})();

// ---- Scroll-triggered fade + slide-up reveal for each section ----
(function () {
  var items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
})();