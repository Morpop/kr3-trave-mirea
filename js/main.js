/* ==========================================================================
   TraveMirea — Основной скрипт (js/main.js)
   Чистый JavaScript (Vanilla JS): доступное меню, модальные окна, фильтры,
   карусель отзывов, галерея, аккордеон, калькулятор бронирования и тема.
   ========================================================================== */

// 1. Доступное мобильное меню с поддержкой клавиатуры (Escape, Tab, aria-expanded)
const navToggler = document.querySelector("[data-nav-toggle]");
const navCollapse = document.querySelector("#mainNavbar");

if (navToggler && navCollapse && !window.bootstrap) {
  const closeNav = ({ restoreFocus = false } = {}) => {
    navCollapse.classList.remove("is-open");
    navToggler.setAttribute("aria-expanded", "false");
    navToggler.setAttribute("aria-label", "Открыть меню");
    if (restoreFocus) navToggler.focus();
  };

  const openNav = () => {
    navCollapse.classList.add("is-open");
    navToggler.setAttribute("aria-expanded", "true");
    navToggler.setAttribute("aria-label", "Закрыть меню");
  };

  navToggler.addEventListener("click", () => {
    const isExpanded = navToggler.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navCollapse.classList.contains("is-open")) {
      closeNav({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navCollapse.classList.contains("is-open") &&
      !navCollapse.contains(event.target) &&
      !navToggler.contains(event.target)
    ) {
      closeNav();
    }
  });
}

// 2. Плавный переключатель светлой/тёмной темы + Глобальный поиск + Личный кабинет в шапке
const themeToggleTarget = document.querySelector(".site-navbar .navbar-nav");

const SITE_TOURS_INDEX = [
  { id: "baikal", title: "Сердце Байкала и Ольхон", meta: "6 дней · Эко-отель 4*", price: "48 500 ₽", url: "product.html", keywords: "байкал ольхон озеро шаманка лед иркутск" },
  { id: "altai", title: "Золотое кольцо Алтая", meta: "7 дней · Горы и треккинг", price: "54 000 ₽", url: "catalog.html?q=Алтай", keywords: "алтай горы катунь чуйский тракт белуха" },
  { id: "sochi", title: "Сочи и Красная Поляна", meta: "5 дней · Море и Роза Хутор", price: "39 000 ₽", url: "order.html?tour=sochi", keywords: "сочи море красная поляна роза хутор пляж семья" },
  { id: "karelia", title: "Карелия: Рускеала и шхеры", meta: "4 дня · Озёра и каньон", price: "32 000 ₽", url: "order.html?tour=karelia", keywords: "карелия рускеала ладога шхеры лес водопады" },
  { id: "kamchatka", title: "Вулканы и океан Камчатки", meta: "8 дней · Тихий океан", price: "89 000 ₽", url: "order.html?tour=kamchatka", keywords: "камчатка вулканы океан гейзеры экспедиция" },
  { id: "calc", title: "Калькулятор и бронирование", meta: "Расчёт стоимости со скидкой", price: "Промокод MIREA10", url: "order.html", keywords: "калькулятор бронь цена скидка промокод заказать" },
  { id: "offices", title: "Офисы и контакты TraveMirea", meta: "Пр-т Вернадского, 78", price: "09:00–21:00", url: "contacts.html", keywords: "контакты офис телефон адрес москва вернадского" }
];

if (themeToggleTarget) {
  const ctaItem = themeToggleTarget.querySelector(".nav-item--cta");

  // 2.1. Глобальная поисковая строка в навигации
  const searchNavItem = document.createElement("li");
  searchNavItem.className = "nav-item";
  searchNavItem.innerHTML = `
    <div class="header-search" data-global-search>
      <label class="visually-hidden" for="globalSiteSearch">Поиск по сайту TraveMirea</label>
      <div class="header-search__box">
        <svg class="header-search__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
        <input class="header-search__input" type="search" id="globalSiteSearch" placeholder="Поиск туров..." autocomplete="off">
      </div>
      <div class="header-search__dropdown d-none" data-global-search-results role="listbox" aria-label="Результаты поиска по сайту"></div>
    </div>`;
  themeToggleTarget.insertBefore(searchNavItem, ctaItem || null);

  const globalSearchInput = searchNavItem.querySelector("#globalSiteSearch");
  const globalSearchResults = searchNavItem.querySelector("[data-global-search-results]");

  const renderGlobalSearch = (rawQuery) => {
    const q = rawQuery.trim().toLowerCase();
    if (!q) {
      globalSearchResults.classList.add("d-none");
      globalSearchResults.innerHTML = "";
      return;
    }

    const matches = SITE_TOURS_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q) ||
        item.keywords.includes(q)
    );

    if (matches.length === 0) {
      globalSearchResults.innerHTML = `<div class="p-2 small">Ничего не найдено. <a class="link-wave" href="catalog.html">Открыть каталог</a></div>`;
    } else {
      globalSearchResults.innerHTML = matches
        .map(
          (item) => `
          <a class="header-search__item" href="${item.url}" role="option">
            <div>
              <strong>${item.title}</strong>
              <small>${item.meta}</small>
            </div>
            <span class="header-search__price">${item.price}</span>
          </a>`
        )
        .join("");
    }
    globalSearchResults.classList.remove("d-none");
  };

  globalSearchInput.addEventListener("input", () => renderGlobalSearch(globalSearchInput.value));
  globalSearchInput.addEventListener("focus", () => {
    if (globalSearchInput.value.trim()) renderGlobalSearch(globalSearchInput.value);
  });
  document.addEventListener("click", (event) => {
    if (!searchNavItem.contains(event.target)) {
      globalSearchResults.classList.add("d-none");
    }
  });

  // 2.2. Кнопка «Личный кабинет» в навигации
  const cabinetNavItem = document.createElement("li");
  cabinetNavItem.className = "nav-item ms-lg-1";
  cabinetNavItem.innerHTML = `
    <button class="cabinet-btn" type="button" data-open-cabinet aria-label="Открыть личный кабинет туриста">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5"></path></svg>
      <span data-cabinet-btn-label>Кабинет</span>
    </button>`;
  themeToggleTarget.insertBefore(cabinetNavItem, ctaItem || null);

  // 2.3. Кнопка плавного переключения темы (View Transition API + CSS cubic-bezier)
  const themeItem = document.createElement("li");
  themeItem.className = "nav-item nav-item--theme";
  themeItem.innerHTML = `
    <button class="theme-toggle" type="button" aria-label="Включить тёмную тему" aria-pressed="false">
      <svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>
      <svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path></svg>
    </button>`;

  themeToggleTarget.insertBefore(themeItem, ctaItem || null);

  const themeButton = themeItem.querySelector(".theme-toggle");

  const syncThemeButton = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const actionLabel = isDark ? "Включить светлую тему" : "Включить тёмную тему";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", actionLabel);
    themeButton.setAttribute("title", actionLabel);
  };

  const applyThemeChange = (nextTheme) => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("travemirea-theme", nextTheme);
    syncThemeButton();
  };

  syncThemeButton();
  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      document.documentElement.classList.add("theme-transition");
      window.clearTimeout(window.__themeTransitionTimer);
      window.__themeTransitionTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 700);
    }

    if (!reducedMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(() => applyThemeChange(nextTheme));
    } else {
      applyThemeChange(nextTheme);
    }
  });
}

// 3. Кнопка бронирования в четвёртой колонке Footer (по образцу референса)
document.querySelectorAll(".site-footer .footer-copy").forEach((copy) => {
  if (!copy.textContent.includes("Групповые туры") || copy.parentElement.querySelector(".footer-ticket")) return;

  const ticketLink = document.createElement("a");
  ticketLink.className = "btn btn-wave-primary footer-ticket";
  ticketLink.href = "order.html";
  ticketLink.textContent = "Подобрать тур";
  copy.insertAdjacentElement("afterend", ticketLink);
});

// 4. Кнопка «Наверх»
const scrollTopButton = document.createElement("button");
scrollTopButton.type = "button";
scrollTopButton.className = "scroll-top";
scrollTopButton.setAttribute("aria-label", "Вернуться наверх страницы");
scrollTopButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 11 6-6 6 6M6 19l6-6 6 6" /></svg>';
document.body.append(scrollTopButton);

const toggleScrollTopButton = () => {
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 360);
};

window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
toggleScrollTopButton();
scrollTopButton.addEventListener("click", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});

// 5. Доступные модальные окна (Focus Trap, клавиша Escape, возврат фокуса)
let activeModal = null;
let lastFocusedElement = null;

const getFocusableElements = (container) => {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )];
};

const openModal = (modal, triggerElement = null) => {
  if (!modal) return;
  if (window.bootstrap && window.bootstrap.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(modal).show();
    return;
  }
  lastFocusedElement = triggerElement || document.activeElement;
  activeModal = modal;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const focusables = getFocusableElements(modal);
  if (focusables.length > 0) {
    focusables[0].focus();
  }
};

const closeModal = (modal = activeModal) => {
  if (!modal) return;
  if (window.bootstrap && window.bootstrap.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(modal).hide();
    return;
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeModal = null;
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
};

document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (window.bootstrap && trigger.hasAttribute("data-bs-toggle")) return;
    const targetId = trigger.getAttribute("data-modal-open");
    const modal = document.getElementById(targetId);
    openModal(modal, trigger);
  });
});

document.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    if (window.bootstrap && closeBtn.hasAttribute("data-bs-dismiss")) return;
    const modal = closeBtn.closest(".modal");
    closeModal(modal);
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal(activeModal);
    return;
  }

  if (event.key === "Tab") {
    const focusables = getFocusableElements(activeModal);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// 6. Валидация быстрой заявки в модальном окне
document.querySelectorAll(".quick-order-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const alertBox = form.querySelector(".alert");
    if (alertBox) alertBox.classList.remove("d-none");
    form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;
  });
});

// 7. Избранные туры (localStorage) + Фильтр, живой поиск и сортировка в каталоге (catalog.html)
const FAVORITES_KEY = "travemirea-favorites";

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveFavorites = (favs) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
};

const syncFavoriteButtons = () => {
  const favs = getFavorites();
  document.querySelectorAll("[data-fav-btn]").forEach((btn) => {
    const id = btn.dataset.favBtn;
    const isFav = favs.includes(id);
    btn.classList.toggle("is-favorite", isFav);
    btn.setAttribute("aria-pressed", String(isFav));
  });
  document.querySelectorAll("[data-fav-count]").forEach((counter) => {
    counter.textContent = String(favs.length);
  });
};

document.addEventListener("click", (event) => {
  const favBtn = event.target.closest("[data-fav-btn]");
  if (!favBtn) return;
  const tourId = favBtn.dataset.favBtn;
  const favs = getFavorites();
  const nextFavs = favs.includes(tourId)
    ? favs.filter((id) => id !== tourId)
    : [...favs, tourId];
  saveFavorites(nextFavs);
  syncFavoriteButtons();
  if (typeof window.__applyCatalogState === "function") {
    window.__applyCatalogState();
  }
});

syncFavoriteButtons();

const zoneFilter = document.querySelector("[data-zone-filter]");
const zoneGrid = document.querySelector("[data-zone-grid]");
const searchInput = document.querySelector("#tourSearchInput");
const sortSelect = document.querySelector("#tourSortSelect");
const emptyNotice = document.querySelector("#catalogEmptyNotice");

if (zoneFilter && zoneGrid) {
  const filterButtons = [...zoneFilter.querySelectorAll("[data-filter]")];
  const zoneCards = [...zoneGrid.querySelectorAll(".zone-card-wrap[data-moods]")];
  const promoCard = zoneGrid.querySelector("[data-promo-card]");
  const initialOrder = [...zoneCards];
  let activeFilter = "all";

  const applyCatalogState = () => {
    const favs = getFavorites();
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const sortBy = sortSelect ? sortSelect.value : "default";

    // Сортировка карточек
    const sorted = [...initialOrder];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    } else if (sortBy === "days-asc") {
      sorted.sort((a, b) => Number(a.dataset.days) - Number(b.dataset.days));
    }

    sorted.forEach((card) => zoneGrid.insertBefore(card, promoCard || null));

    // Фильтрация по категории, избранному и поисковой строке
    let visibleCount = 0;
    zoneCards.forEach((card) => {
      const moods = card.dataset.moods.split(" ");
      const tourId = card.dataset.tourId;
      const text = card.textContent.toLowerCase();

      const matchesMood =
        activeFilter === "all" ||
        (activeFilter === "favorites" ? favs.includes(tourId) : moods.includes(activeFilter));
      const matchesQuery = !query || text.includes(query);

      const isVisible = matchesMood && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyNotice) {
      emptyNotice.classList.toggle("d-none", visibleCount > 0);
    }

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  window.__applyCatalogState = applyCatalogState;

  zoneFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    applyCatalogState();
  });

  if (searchInput) searchInput.addEventListener("input", applyCatalogState);
  if (sortSelect) sortSelect.addEventListener("change", applyCatalogState);

  applyCatalogState();
}

// 8. Карусель отзывов на главной странице (index.html)
const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  let currentIndex = 0;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });
  };

  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1);
    }
  });
}

// 9. Горизонтальная фотогалерея и модальное окно просмотра (product.html)
const photoGallery = document.querySelector("[data-photo-gallery]");
const photoModal = document.querySelector("#photoModal");

if (photoGallery) {
  const gallerySection = photoGallery.closest("[data-photo-gallery-section]") || photoGallery;
  const previousButton = gallerySection.querySelector("[data-gallery-prev]");
  const nextButton = gallerySection.querySelector("[data-gallery-next]");

  const getScrollStep = () => {
    const firstCard = photoGallery.querySelector(".photo-gallery__item");
    const gap = Number.parseFloat(getComputedStyle(photoGallery).gap) || 0;
    return firstCard ? firstCard.getBoundingClientRect().width + gap : photoGallery.clientWidth * 0.8;
  };

  const updateGalleryControls = () => {
    if (!previousButton || !nextButton) return;
    const maxScroll = photoGallery.scrollWidth - photoGallery.clientWidth;
    previousButton.disabled = photoGallery.scrollLeft <= 2;
    nextButton.disabled = photoGallery.scrollLeft >= maxScroll - 2;
  };

  const scrollGallery = (direction, { immediate = false } = {}) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxScroll = photoGallery.scrollWidth - photoGallery.clientWidth;
    const nextPosition = Math.min(maxScroll, Math.max(0, photoGallery.scrollLeft + direction * getScrollStep()));
    photoGallery.scrollTo({ left: nextPosition, behavior: immediate || reducedMotion ? "auto" : "smooth" });
  };

  if (previousButton) previousButton.addEventListener("click", () => scrollGallery(-1));
  if (nextButton) nextButton.addEventListener("click", () => scrollGallery(1));
  photoGallery.addEventListener("scroll", updateGalleryControls, { passive: true });
  gallerySection.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollGallery(event.key === "ArrowLeft" ? -1 : 1, { immediate: true });
  });
  window.addEventListener("resize", updateGalleryControls);
  updateGalleryControls();

  photoGallery.querySelectorAll("[data-gallery-item]").forEach((item) => {
    item.addEventListener("click", () => {
      if (!photoModal) return;
      const image = photoModal.querySelector(".gallery-modal-image");
      const caption = photoModal.querySelector(".gallery-modal-caption");
      const title = photoModal.querySelector(".modal-title");
      if (image) {
        image.src = item.dataset.image;
        image.alt = item.dataset.alt;
      }
      if (title) title.textContent = item.dataset.title;
      if (caption) caption.textContent = item.dataset.caption;
      openModal(photoModal, item);
    });
  });
}

// 10. Калькулятор стоимости бронирования и форма заказа (order.html)
const orderForm = document.querySelector("#orderForm");

if (orderForm) {
  const tourSelect = orderForm.querySelector("#tourSelect");
  const adultsInput = orderForm.querySelector("#adultsCount");
  const childrenInput = orderForm.querySelector("#childrenCount");
  const comfortSelect = orderForm.querySelector("#comfortSelect");
  const tariffSelect = orderForm.querySelector("#tariffSelect");
  const addonInputs = [...orderForm.querySelectorAll("[data-addon-price]")];

  const basePriceEl = document.querySelector("#calcBasePrice");
  const addonsPriceEl = document.querySelector("#calcAddonsPrice");
  const discountPriceEl = document.querySelector("#calcDiscountPrice");
  const totalPriceEl = document.querySelector("#calcTotalPrice");
  const promoInput = orderForm.querySelector("#promoCodeInput");
  const applyPromoBtn = orderForm.querySelector("#applyPromoBtn");
  const promoStatusText = orderForm.querySelector("#promoStatusText");

  const PROMO_CODES = {
    MIREA10: { type: "percent", value: 0.1, label: "Промокод MIREA10 применён: дополнительная скидка 10%!" },
    LETO2026: { type: "percent", value: 0.07, label: "Промокод LETO2026 применён: дополнительная скидка 7%!" },
    BAIKAL5: { type: "fixed", value: 5000, label: "Промокод BAIKAL5 применён: скидка 5 000 ₽!" }
  };

  let activePromo = null;

  // Поддержка предвыбора тура через GET-параметр ?tour=sochi
  const params = new URLSearchParams(window.location.search);
  const preselectedTour = params.get("tour");
  if (preselectedTour && tourSelect && [...tourSelect.options].some((opt) => opt.value === preselectedTour)) {
    tourSelect.value = preselectedTour;
  }

  const formatRub = (value) => `${Math.round(value).toLocaleString("ru-RU")} ₽`;

  const updateTourCalculation = () => {
    if (!tourSelect || !adultsInput || !childrenInput || !comfortSelect || !tariffSelect) return;

    const selectedTourOption = tourSelect.options[tourSelect.selectedIndex];
    const tourPrice = Number(selectedTourOption.dataset.price) || 48500;
    const adults = Math.max(1, Number(adultsInput.value) || 1);
    const children = Math.max(0, Number(childrenInput.value) || 0);

    const selectedComfortOption = comfortSelect.options[comfortSelect.selectedIndex];
    const comfortMultiplier = Number(selectedComfortOption.dataset.multiplier) || 1;

    // Базовая цена участников (детям скидка 30%)
    const baseParticipantsCost = tourPrice * adults + tourPrice * 0.7 * children;
    const comfortExtraCost = baseParticipantsCost * (comfortMultiplier - 1);

    // Доп. опции
    const addonsCost = addonInputs.reduce((sum, checkbox) => {
      return checkbox.checked ? sum + (Number(checkbox.dataset.addonPrice) || 0) : sum;
    }, 0);

    const subtotal = baseParticipantsCost + comfortExtraCost + addonsCost;

    // Расчёт скидки по тарифу или группе (от 3 человек — минимум 10%)
    let discountRate = 0;
    if (tariffSelect.value === "corporate") {
      discountRate = 0.12;
    } else if (tariffSelect.value === "family" || adults + children >= 3) {
      discountRate = 0.1;
    }

    let discountAmount = subtotal * discountRate;

    // Дополнительная скидка по промокоду
    if (activePromo) {
      if (activePromo.type === "percent") {
        discountAmount += (subtotal - discountAmount) * activePromo.value;
      } else if (activePromo.type === "fixed") {
        discountAmount += activePromo.value;
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (basePriceEl) basePriceEl.textContent = formatRub(baseParticipantsCost);
    if (addonsPriceEl) addonsPriceEl.textContent = `+${formatRub(comfortExtraCost + addonsCost)}`;
    if (discountPriceEl) {
      discountPriceEl.textContent = discountAmount > 0 ? `−${formatRub(discountAmount)}` : "0 ₽";
    }
    if (totalPriceEl) totalPriceEl.textContent = formatRub(finalTotal);
  };

  if (applyPromoBtn && promoInput && promoStatusText) {
    const handleApplyPromo = () => {
      const code = promoInput.value.trim().toUpperCase();
      promoStatusText.classList.remove("promo-status--ok", "promo-status--err");
      if (!code) {
        activePromo = null;
        promoStatusText.textContent = "Доступные промокоды: MIREA10 (-10%), LETO2026 (-7%), BAIKAL5 (-5 000 ₽).";
        updateTourCalculation();
        return;
      }
      if (PROMO_CODES[code]) {
        activePromo = PROMO_CODES[code];
        promoStatusText.textContent = activePromo.label;
        promoStatusText.classList.add("promo-status--ok");
      } else {
        activePromo = null;
        promoStatusText.textContent = "Промокод не найден. Попробуйте MIREA10, LETO2026 или BAIKAL5.";
        promoStatusText.classList.add("promo-status--err");
      }
      updateTourCalculation();
    };

    applyPromoBtn.addEventListener("click", handleApplyPromo);
    promoInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleApplyPromo();
      }
    });
  }

  orderForm.addEventListener("input", updateTourCalculation);
  orderForm.addEventListener("change", updateTourCalculation);
  updateTourCalculation();

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!orderForm.checkValidity()) {
      orderForm.classList.add("was-validated");
      const firstInvalid = orderForm.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Сохраняем заявку в Личный кабинет туриста (localStorage)
    const selectedTourOption = tourSelect.options[tourSelect.selectedIndex];
    const bookingItem = {
      id: Date.now(),
      tourTitle: selectedTourOption ? selectedTourOption.text.split(" (")[0] : "Сердце Байкала",
      date: orderForm.querySelector("#visitDate")?.value || "По согласованию",
      guests: `${adultsInput.value} взр.${Number(childrenInput.value) > 0 ? ` + ${childrenInput.value} дет.` : ""}`,
      total: totalPriceEl ? totalPriceEl.textContent : "48 500 ₽",
      status: "Подтверждается менеджером"
    };
    try {
      const existingBookings = JSON.parse(localStorage.getItem("travemirea-bookings") || "[]");
      localStorage.setItem("travemirea-bookings", JSON.stringify([bookingItem, ...existingBookings]));
    } catch {
      // ignore storage errors
    }

    const successAlert = document.querySelector("#orderSuccess");
    if (successAlert) successAlert.classList.remove("d-none");
    orderForm.reset();
    orderForm.classList.remove("was-validated");
    updateTourCalculation();
    if (typeof window.__renderCabinetModal === "function") {
      window.__renderCabinetModal();
    }
  });
}

// 11. Интерактивный чек-лист сбора вещей в поездку (product.html)
const packingSection = document.querySelector("[data-packing-checklist]");

if (packingSection) {
  const PACKING_KEY = "travemirea-packing-baikal";
  const checkboxes = [...packingSection.querySelectorAll("[data-pack-item]")];
  const progressBar = document.querySelector("#checklistProgressBar");
  const progressText = document.querySelector("#checklistProgressText");

  let savedItems = [];
  try {
    savedItems = JSON.parse(localStorage.getItem(PACKING_KEY) || "[]");
  } catch {
    savedItems = [];
  }

  const updatePackingState = () => {
    const checkedIds = [];
    checkboxes.forEach((cb) => {
      const id = cb.dataset.packItem;
      const label = cb.closest(".checklist-item");
      if (cb.checked) checkedIds.push(id);
      if (label) label.classList.toggle("is-checked", cb.checked);
    });

    localStorage.setItem(PACKING_KEY, JSON.stringify(checkedIds));

    const total = checkboxes.length;
    const done = checkedIds.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `Собрано: ${done} из ${total} (${percent}%)`;
  };

  checkboxes.forEach((cb) => {
    cb.checked = savedItems.includes(cb.dataset.packItem);
    cb.addEventListener("change", updatePackingState);
  });

  updatePackingState();
}

// 12. Доступный аккордеон FAQ (order.html)
document.querySelectorAll("[data-accordion-trigger]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("aria-controls");
    const panel = document.getElementById(targetId);
    if (!panel) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    panel.classList.toggle("show", !isExpanded);
  });
});

// 13. Личный кабинет туриста (модальное окно с профилем, бронями и избранным)
const CABINET_USER_KEY = "travemirea-user-profile";
const CABINET_BOOKINGS_KEY = "travemirea-bookings";

const getCabinetUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(CABINET_USER_KEY)) || {
        name: "Иван Петров",
        email: "ivan@example.ru",
        phone: "+7 (999) 123-45-67"
      }
    );
  } catch {
    return { name: "Иван Петров", email: "ivan@example.ru", phone: "+7 (999) 123-45-67" };
  }
};

const getCabinetBookings = () => {
  try {
    const list = JSON.parse(localStorage.getItem(CABINET_BOOKINGS_KEY));
    if (Array.isArray(list) && list.length > 0) return list;
  } catch {
    // ignore
  }
  return [
    {
      id: 101,
      tourTitle: "Сердце Байкала и Ольхон",
      date: "15.07.2026",
      guests: "2 взр.",
      total: "88 920 ₽",
      status: "Бронь активна · Оплачено 20%"
    }
  ];
};

const cabinetModal = document.createElement("div");
cabinetModal.className = "modal";
cabinetModal.id = "userCabinetModal";
cabinetModal.tabIndex = -1;
cabinetModal.setAttribute("role", "dialog");
cabinetModal.setAttribute("aria-modal", "true");
cabinetModal.setAttribute("aria-labelledby", "userCabinetModalTitle");
cabinetModal.setAttribute("aria-hidden", "true");
cabinetModal.innerHTML = `
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title fs-4" id="userCabinetModalTitle">Личный кабинет</h2>
        <button type="button" class="modal-close-btn" data-cabinet-close aria-label="Закрыть личный кабинет">×</button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <strong class="d-block fs-5" id="cabinetGreetingName">Иван Петров</strong>
          <span class="small" id="cabinetGreetingEmail">ivan@example.ru</span>
        </div>

        <div class="cabinet-tabs" role="tablist" aria-label="Разделы личного кабинета">
          <button class="cabinet-tab is-active" type="button" data-cabinet-tab="profile" role="tab" aria-selected="true">Профиль</button>
          <button class="cabinet-tab" type="button" data-cabinet-tab="bookings" role="tab" aria-selected="false">Мои поездки</button>
          <button class="cabinet-tab" type="button" data-cabinet-tab="favs" role="tab" aria-selected="false">Избранное</button>
        </div>

        <div data-cabinet-pane="profile">
          <form id="cabinetProfileForm">
            <div class="mb-3">
              <label class="form-label" for="cabinetInputName">Ваше имя</label>
              <input class="form-control" id="cabinetInputName" required>
            </div>
            <div class="mb-3">
              <label class="form-label" for="cabinetInputEmail">E-mail</label>
              <input class="form-control" type="email" id="cabinetInputEmail" required>
            </div>
            <div class="mb-3">
              <label class="form-label" for="cabinetInputPhone">Телефон</label>
              <input class="form-control" type="tel" id="cabinetInputPhone" required>
            </div>
            <button class="btn btn-wave-primary w-100" type="submit">Сохранить данные профиля</button>
            <div class="alert alert-success d-none mt-3 mb-0" id="cabinetSaveAlert" role="status">Профиль успешно обновлён!</div>
          </form>
        </div>

        <div class="d-none" data-cabinet-pane="bookings" id="cabinetBookingsPane"></div>
        <div class="d-none" data-cabinet-pane="favs" id="cabinetFavsPane"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-wave-outline" data-cabinet-close>Выйти из кабинета</button>
      </div>
    </div>
  </div>`;
document.body.append(cabinetModal);

const closeCabinetModal = () => {
  if (window.bootstrap && window.bootstrap.Modal) {
    const inst = window.bootstrap.Modal.getInstance(cabinetModal);
    if (inst) inst.hide();
  }
  cabinetModal.classList.remove("is-open", "show");
  cabinetModal.style.display = "";
  cabinetModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
};

const openCabinetModal = () => {
  renderCabinetModal();
  cabinetModal.classList.add("is-open", "show");
  cabinetModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const firstInput = cabinetModal.querySelector("button, input");
  if (firstInput) firstInput.focus();
};

const renderCabinetModal = () => {
  const user = getCabinetUser();
  const bookings = getCabinetBookings();
  const favIds = getFavorites();

  const greetName = cabinetModal.querySelector("#cabinetGreetingName");
  const greetEmail = cabinetModal.querySelector("#cabinetGreetingEmail");
  const inputName = cabinetModal.querySelector("#cabinetInputName");
  const inputEmail = cabinetModal.querySelector("#cabinetInputEmail");
  const inputPhone = cabinetModal.querySelector("#cabinetInputPhone");
  const navLabel = document.querySelector("[data-cabinet-btn-label]");

  if (greetName) greetName.textContent = user.name;
  if (greetEmail) greetEmail.textContent = user.email;
  if (inputName) inputName.value = user.name;
  if (inputEmail) inputEmail.value = user.email;
  if (inputPhone) inputPhone.value = user.phone;
  if (navLabel) navLabel.textContent = "Кабинет";

  const bookingsPane = cabinetModal.querySelector("#cabinetBookingsPane");
  if (bookingsPane) {
    bookingsPane.innerHTML = bookings
      .map(
        (b) => `
        <div class="cabinet-card">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
            <strong>${b.tourTitle}</strong>
            <span class="badge badge-blue">${b.total}</span>
          </div>
          <p class="small mb-1">📅 Дата: ${b.date} · 👥 Туристы: ${b.guests}</p>
          <p class="small fw-bold mb-0">Статус: ${b.status}</p>
        </div>`
      )
      .join("");
  }

  const favsPane = cabinetModal.querySelector("#cabinetFavsPane");
  if (favsPane) {
    const favTours = SITE_TOURS_INDEX.filter((t) => favIds.includes(t.id));
    if (favTours.length === 0) {
      favsPane.innerHTML = `<p class="mb-0">В избранном пока нет туров. Нажмите на сердечко на любой карточке в <a class="link-wave" href="catalog.html">каталоге</a>.</p>`;
    } else {
      favsPane.innerHTML = favTours
        .map(
          (t) => `
          <div class="cabinet-card d-flex justify-content-between align-items-center gap-2">
            <div>
              <strong class="d-block">${t.title}</strong>
              <small>${t.meta} · ${t.price}</small>
            </div>
            <a class="btn btn-wave-outline btn-sm" href="${t.url}">Открыть</a>
          </div>`
        )
        .join("");
    }
  }
};

window.__renderCabinetModal = renderCabinetModal;
renderCabinetModal();

document.querySelectorAll("[data-open-cabinet]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openCabinetModal();
  });
});

cabinetModal.querySelectorAll("[data-cabinet-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeCabinetModal();
  });
});

cabinetModal.addEventListener("click", (event) => {
  if (event.target === cabinetModal) {
    closeCabinetModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cabinetModal.classList.contains("is-open")) {
    closeCabinetModal();
  }
});

cabinetModal.querySelectorAll("[data-cabinet-tab]").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const target = tabBtn.dataset.cabinetTab;
    cabinetModal.querySelectorAll("[data-cabinet-tab]").forEach((b) => {
      const active = b.dataset.cabinetTab === target;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
    cabinetModal.querySelectorAll("[data-cabinet-pane]").forEach((pane) => {
      pane.classList.toggle("d-none", pane.dataset.cabinetPane !== target);
    });
  });
});

const cabinetForm = cabinetModal.querySelector("#cabinetProfileForm");
if (cabinetForm) {
  cabinetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedUser = {
      name: cabinetModal.querySelector("#cabinetInputName").value.trim() || "Иван Петров",
      email: cabinetModal.querySelector("#cabinetInputEmail").value.trim() || "ivan@example.ru",
      phone: cabinetModal.querySelector("#cabinetInputPhone").value.trim() || "+7 (999) 123-45-67"
    };
    localStorage.setItem(CABINET_USER_KEY, JSON.stringify(updatedUser));
    renderCabinetModal();
    const alertEl = cabinetModal.querySelector("#cabinetSaveAlert");
    if (alertEl) {
      alertEl.classList.remove("d-none");
      setTimeout(() => alertEl.classList.add("d-none"), 2500);
    }
  });
}

// 14. Виджет онлайн-чата с менеджером-консультантом
const chatWidget = document.createElement("aside");
chatWidget.className = "chat-widget";
chatWidget.setAttribute("aria-label", "Онлайн-чат с менеджером TraveMirea");
chatWidget.innerHTML = `
  <button class="chat-widget__toggle" type="button" data-chat-toggle aria-expanded="false" aria-controls="managerChatWindow">
    <span class="chat-widget__dot" aria-hidden="true"></span>
    <span>Чат с менеджером</span>
  </button>
  <div class="chat-widget__window" id="managerChatWindow" role="region" aria-label="Диалог с консультантом">
    <div class="chat-widget__head">
      <div>
        <strong>Анна · Менеджер TraveMirea</strong>
        <small>В сети · отвечает мгновенно</small>
      </div>
      <button class="chat-widget__close" type="button" data-chat-close aria-label="Свернуть чат">×</button>
    </div>
    <div class="chat-widget__messages" id="chatMessagesBox" aria-live="polite">
      <div class="chat-msg chat-msg--bot">Здравствуйте! 👋 Я помогу подобрать тур, рассчитать стоимость или проверить наличие мест на Байкал и Алтай.</div>
    </div>
    <div class="chat-widget__chips" aria-label="Быстрые вопросы менеджеру">
      <button class="chat-chip" type="button" data-chat-preset="Какие сейчас есть скидки на туры?">Скидки на туры</button>
      <button class="chat-chip" type="button" data-chat-preset="Что входит в тур на Байкал?">Про Байкал</button>
      <button class="chat-chip" type="button" data-chat-preset="Посоветуйте тур на море с семьёй">Тур на море</button>
    </div>
    <form class="chat-widget__form" id="chatWidgetForm">
      <label class="visually-hidden" for="chatWidgetInput">Сообщение менеджеру</label>
      <input class="form-control chat-widget__input" id="chatWidgetInput" type="text" placeholder="Напишите ваш вопрос..." autocomplete="off" required>
      <button class="btn btn-wave-primary chat-widget__send" type="submit">Отпр.</button>
    </form>
  </div>`;
document.body.append(chatWidget);

const chatToggleBtn = chatWidget.querySelector("[data-chat-toggle]");
const chatCloseBtn = chatWidget.querySelector("[data-chat-close]");
const chatWindow = chatWidget.querySelector("#managerChatWindow");
const chatMessagesBox = chatWidget.querySelector("#chatMessagesBox");
const chatForm = chatWidget.querySelector("#chatWidgetForm");
const chatInput = chatWidget.querySelector("#chatWidgetInput");

const getManagerReply = (text) => {
  const q = text.toLowerCase();
  if (q.includes("скидк") || q.includes("промокод") || q.includes("mirea")) {
    return "При бронировании от 3 человек или по семейному тарифу действует скидка 10%, а также доступны промокоды на странице расчёта стоимости.";
  }
  if (q.includes("байкал") || q.includes("ольхон")) {
    return "Гранд-тур «Сердце Байкала и Ольхон» длится 6 дней (от 48 500 ₽). Включены эко-отель 4*, катер по Малому морю, завтраки и гид.";
  }
  if (q.includes("мор") || q.includes("сочи") || q.includes("семь")) {
    return "Для семейного отдыха у моря рекомендуем тур «Сочи и Красная Поляна» на 5 дней от 39 000 ₽. Детям до 14 лет скидка 30%!";
  }
  if (q.includes("алтай") || q.includes("камчат") || q.includes("гор")) {
    return "Любителям гор подойдёт «Золотое кольцо Алтая» (7 дней, от 54 000 ₽) или экспедиция на Камчатку (8 дней, от 89 000 ₽).";
  }
  return "Спасибо за обращение! Я передала ваш вопрос старшему координатору. Оставьте телефон в форме бронирования или позвоните нам: 📞 +7 (495) 215-07-78.";
};

const appendChatMessage = (text, sender = "user") => {
  if (!chatMessagesBox) return;
  const bubble = document.createElement("div");
  bubble.className = `chat-msg chat-msg--${sender}`;
  bubble.textContent = text;
  chatMessagesBox.append(bubble);
  chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
};

const sendUserChatQuestion = (questionText) => {
  const trimmed = questionText.trim();
  if (!trimmed) return;
  appendChatMessage(trimmed, "user");
  setTimeout(() => {
    appendChatMessage(getManagerReply(trimmed), "bot");
  }, 420);
};

if (chatToggleBtn && chatWindow) {
  chatToggleBtn.addEventListener("click", () => {
    const isOpen = chatWindow.classList.toggle("is-open");
    chatToggleBtn.setAttribute("aria-expanded", String(isOpen));
    if (isOpen && chatInput) chatInput.focus();
  });
}

if (chatCloseBtn && chatWindow && chatToggleBtn) {
  chatCloseBtn.addEventListener("click", () => {
    chatWindow.classList.remove("is-open");
    chatToggleBtn.setAttribute("aria-expanded", "false");
    chatToggleBtn.focus();
  });
}

chatWidget.querySelectorAll("[data-chat-preset]").forEach((chip) => {
  chip.addEventListener("click", () => {
    sendUserChatQuestion(chip.getAttribute("data-chat-preset"));
  });
});

if (chatForm && chatInput) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendUserChatQuestion(chatInput.value);
    chatInput.value = "";
  });
}

// 12. Плавное появление элементов при скролле
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.dataset.visible = "";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  const revealTargets = document.querySelectorAll(
    ".reveal, .page-intro, main > section .alert, .zone-card, .product-image, .content-panel, .order-form, .order-aside, .accordion"
  );
  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
