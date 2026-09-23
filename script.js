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
  var message = "¡Hola! ✨ Vengo desde la página web de Studio Fairy y me gustaría agendar mi cita de valoración de hairstroke.";
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


// ---- Service detail modal: procedure + materials per service ----
(function () {
  var serviceDetails = {
    "hairstroke": {
      title: "Hairstroke pelo a pelo",
      steps: [
        "Valoración de la forma de tu rostro y diseño de la ceja a lápiz.",
        "Limpieza y desinfección de la zona.",
        "Aplicación de anestesia tópica.",
        "Trazo hebra por hebra siguiendo el crecimiento natural del vello.",
        "Revisión final de simetría y retoques de color."
      ],
      materials: [
        "Pigmentos orgánicos certificados",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica",
        "Guantes y campo estéril"
      ]
    },
    "correccion": {
      title: "Corrección de trabajos previos",
      steps: [
        "Valoración del trabajo previo: forma, color y saturación.",
        "Determinación de si se necesita diluir o cubrir pigmento antes de corregir.",
        "Aplicación de anestesia tópica.",
        "Ajuste de forma y color con la técnica pelo a pelo.",
        "Indicaciones de cuidado específicas para piel ya trabajada."
      ],
      materials: [
        "Pigmentos orgánicos certificados",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica",
        "Guantes y campo estéril"
      ]
    },
    "retoque-anual": {
      title: "Retoque anual",
      steps: [
        "Revisión del estado actual del hairstroke.",
        "Aplicación de anestesia tópica si es necesario.",
        "Repaso de color y trazos donde el pigmento se haya aclarado.",
        "Ajustes menores de forma si el vello natural cambió."
      ],
      materials: [
        "Pigmentos orgánicos certificados",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica (si aplica)"
      ]
    },
    "valoracion-brows": {
      title: "Valoración sin costo (cejas)",
      steps: [
        "Revisión de tu piel y vello natural.",
        "Plática sobre tus expectativas y el resultado que buscas.",
        "Recomendación de la técnica más adecuada para tu caso.",
        "Sin aplicación de pigmento ni anestesia en esta cita."
      ],
      materials: [
        "Ninguno — es solo una revisión y plática"
      ]
    },
    "tattoo-lips": {
      title: "Tattoo lips",
      steps: [
        "Valoración de la forma natural de tu labio.",
        "Diseño del contorno deseado a lápiz.",
        "Aplicación de anestesia tópica.",
        "Pigmentación para dar color y efecto de mayor volumen.",
        "Indicaciones de cuidado para la cicatrización."
      ],
      materials: [
        "Pigmentos orgánicos certificados para labios",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica",
        "Guantes y campo estéril"
      ]
    },
    "contorno-labios": {
      title: "Contorno de labios",
      steps: [
        "Valoración de la simetría natural de tu labio.",
        "Diseño del nuevo contorno a lápiz.",
        "Aplicación de anestesia tópica.",
        "Delineado del borde para corregir asimetrías.",
        "Revisión final del resultado."
      ],
      materials: [
        "Pigmentos orgánicos certificados para labios",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica"
      ]
    },
    "retoque-lips": {
      title: "Retoque de tattoo lips",
      steps: [
        "Revisión del estado actual del pigmento.",
        "Aplicación de anestesia tópica si es necesario.",
        "Repaso de color e intensidad donde se haya desvanecido."
      ],
      materials: [
        "Pigmentos orgánicos certificados para labios",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica (si aplica)"
      ]
    },
    "valoracion-lips": {
      title: "Valoración sin costo (labios)",
      steps: [
        "Revisión de la forma natural de tus labios.",
        "Plática sobre tus expectativas y el resultado que buscas.",
        "Recomendación de la técnica más adecuada para tu caso."
      ],
      materials: [
        "Ninguno — es solo una revisión y plática"
      ]
    },
    "delineado-ojos": {
      title: "Delineado de ojos",
      steps: [
        "Valoración de la forma de tu ojo.",
        "Diseño de la línea deseada a lápiz.",
        "Aplicación de anestesia tópica.",
        "Micropigmentación de la línea de pestañas.",
        "Indicaciones de cuidado para la cicatrización."
      ],
      materials: [
        "Pigmentos orgánicos certificados",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica"
      ]
    },
    "pecas": {
      title: "Pecas naturales",
      steps: [
        "Plática sobre el patrón y densidad de pecas que buscas.",
        "Diseño del patrón a lápiz sobre tu piel.",
        "Aplicación de anestesia tópica si es necesario.",
        "Pigmentación punto por punto para un efecto natural."
      ],
      materials: [
        "Pigmentos orgánicos certificados",
        "Agujas y cartuchos desechables de un solo uso",
        "Anestesia tópica (si aplica)"
      ]
    },
    "valoracion-ojos": {
      title: "Valoración sin costo (ojos y pecas)",
      steps: [
        "Revisión de tu piel y la forma de tu ojo.",
        "Plática sobre tus expectativas y el resultado que buscas.",
        "Recomendación de la técnica más adecuada para tu caso."
      ],
      materials: [
        "Ninguno — es solo una revisión y plática"
      ]
    }
  };

  var modal = document.getElementById("detail-modal");
  var closeBtn = document.getElementById("detail-close");
  var titleEl = document.getElementById("detail-title");
  var stepsEl = document.getElementById("detail-steps");
  var materialsEl = document.getElementById("detail-materials");

  if (!modal) return;

  function openDetail(id) {
    var data = serviceDetails[id];
    if (!data) return;

    titleEl.textContent = data.title;
    stepsEl.innerHTML = data.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    materialsEl.innerHTML = data.materials.map(function (m) { return "<li>" + m + "</li>"; }).join("");

    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeDetail() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".service-detail").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // no togglear el acordeón
      openDetail(btn.getAttribute("data-detail"));
    });
  });

  closeBtn.addEventListener("click", closeDetail);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeDetail(); // clic afuera de la tarjeta cierra
  });
})();


// ---- Photo lightbox: click a service photo to see it enlarged ----
(function () {
  var lightbox = document.getElementById("photo-lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var closeBtn = document.getElementById("lightbox-close");

  if (!lightbox) return;

  function openLightbox(src, alt) {
    lightboxImg.setAttribute("src", src);
    lightboxImg.setAttribute("alt", alt || "");
    lightbox.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("modal-open");
    lightboxImg.setAttribute("src", "");
  }

  document.querySelectorAll(".photo-lightbox-trigger").forEach(function (photo) {
    photo.addEventListener("click", function (e) {
      e.stopPropagation(); // no togglear el acordeón ni abrir "Ver más"
      var img = photo.querySelector("img");
      if (img) openLightbox(img.getAttribute("src"), img.getAttribute("alt"));
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox(); // clic afuera de la foto cierra
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
})();