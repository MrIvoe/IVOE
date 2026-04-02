const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  }
);

function observeRevealItem(item) {
  item.style.transitionDelay = `${revealCounter * 70}ms`;
  revealCounter += 1;
  observer.observe(item);
}

let revealCounter = 0;

revealItems.forEach((item) => {
  item.style.transitionDelay = `${revealCounter * 70}ms`;
  revealCounter += 1;
  observer.observe(item);
});

const content = window.SITE_CONTENT || {};
const pageContent = window.PAGE_CONTENT || {};

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

function applyTextContent() {
  const textNodes = document.querySelectorAll("[data-content]");
  textNodes.forEach((node) => {
    const path = node.getAttribute("data-content");
    if (!path) {
      return;
    }

    const value = getNestedValue(content, path);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
}

function applyPageTextContent() {
  const textNodes = document.querySelectorAll("[data-page-content]");
  textNodes.forEach((node) => {
    const path = node.getAttribute("data-page-content");
    if (!path) {
      return;
    }

    const value = getNestedValue(pageContent, path);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
}

function getIconUrl(item) {
  const hostRaw = item.site || item.url;
  if (!hostRaw) {
    return "";
  }

  let hostname = hostRaw;
  try {
    if (hostRaw.includes("http")) {
      hostname = new URL(hostRaw).hostname;
    }
  } catch (error) {
    hostname = hostRaw;
  }

  hostname = hostname.replace(/^www\./, "");
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
}

function createIconElement(item) {
  const icon = getIconUrl(item);

  if (item.url) {
    const anchor = document.createElement("a");
    anchor.className = "icon-link";
    anchor.href = item.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.title = item.name;
    anchor.setAttribute("aria-label", item.name);

    const img = document.createElement("img");
    img.src = icon;
    img.alt = `${item.name} icon`;
    img.loading = "lazy";

    anchor.appendChild(img);
    return anchor;
  }

  const disabled = document.createElement("span");
  disabled.className = "icon-link is-disabled";
  disabled.title = `${item.name} (add link in content.js)`;
  disabled.setAttribute("aria-label", `${item.name} placeholder`);

  const img = document.createElement("img");
  img.src = icon;
  img.alt = `${item.name} icon`;
  img.loading = "lazy";

  disabled.appendChild(img);
  return disabled;
}

function createActionElement(url, label, fallbackLabel) {
  if (url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = url.startsWith("http") ? "_blank" : "_self";
    if (link.target === "_blank") {
      link.rel = "noopener noreferrer";
    }
    link.textContent = label || fallbackLabel;
    return link;
  }

  const placeholder = document.createElement("span");
  placeholder.className = "button link-placeholder";
  placeholder.textContent = fallbackLabel;
  return placeholder;
}

function renderPanelItems() {
  const panelContainer = document.querySelector("[data-section='panel-items']");
  if (!panelContainer) {
    return;
  }

  const items = (pageContent.hero && pageContent.hero.panelItems) || [];
  panelContainer.innerHTML = "";

  items.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    panelContainer.appendChild(li);
  });
}

function renderHomeRepositories() {
  const repoContainer = document.querySelector("[data-home='repositories']");
  if (!repoContainer) {
    return;
  }

  const repositories = (content.links && content.links.repositories) || [];
  repoContainer.innerHTML = "";

  repositories.forEach((repo) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const heading = document.createElement("h3");
    heading.textContent = repo.name || "Repository";

    const text = document.createElement("p");
    text.textContent =
      repo.description || "Add a short repository summary in assets/js/content.js.";

    article.appendChild(heading);
    article.appendChild(text);
    article.appendChild(createActionElement(repo.url, repo.label, "Open Repository"));

    repoContainer.appendChild(article);
    observeRevealItem(article);
  });
}

function renderFooterIcons() {
  const socialContainer = document.querySelector("[data-links='social']");
  const donationContainer = document.querySelector("[data-links='donations']");

  if (!socialContainer && !donationContainer) {
    return;
  }

  const socials = (content.links && content.links.social) || [];
  const donations = (content.links && content.links.donations) || [];

  if (socialContainer) {
    socialContainer.innerHTML = "";
    socials.forEach((item) => {
      socialContainer.appendChild(createIconElement(item));
    });
  }

  if (donationContainer) {
    donationContainer.innerHTML = "";
    donations.forEach((item) => {
      donationContainer.appendChild(createIconElement(item));
    });
  }
}

function renderHomePage() {
  const cardsContainer = document.querySelector("[data-section='business-cards']");
  if (!cardsContainer) {
    return;
  }

  const cards = pageContent.businessCards || [];
  cardsContainer.innerHTML = "";

  cards.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.description;

    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(createActionElement(item.url, item.label, "Open Section"));
    cardsContainer.appendChild(article);
    observeRevealItem(article);
  });
}

function renderAboutPage() {
  const cardsContainer = document.querySelector("[data-about='cards']");
  if (!cardsContainer) {
    return;
  }

  const cards = pageContent.cards || [];
  cardsContainer.innerHTML = "";

  cards.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.text;

    article.appendChild(title);
    article.appendChild(text);
    cardsContainer.appendChild(article);
    observeRevealItem(article);
  });
}

function renderEmptyCard(container, message) {
  const notice = document.createElement("article");
  notice.className = "card";
  const p = document.createElement("p");
  p.textContent = message;
  notice.appendChild(p);
  container.appendChild(notice);
}

function renderShopPage() {
  const productsContainer = document.querySelector("[data-section='products']");
  if (!productsContainer) {
    return;
  }

  const products = pageContent.products || [];
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    renderEmptyCard(productsContainer, "No products listed yet. Add items in assets/js/content-shop.js.");
    return;
  }

  products.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const text = document.createElement("p");
    text.textContent = `${item.price}. ${item.description}`;

    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(createActionElement(item.url, item.label, "Coming Soon"));
    productsContainer.appendChild(article);
    observeRevealItem(article);
  });
}

function renderHomesPage() {
  const listingsContainer = document.querySelector("[data-section='listings']");
  if (!listingsContainer) {
    return;
  }

  const listings = pageContent.listings || [];
  listingsContainer.innerHTML = "";

  if (listings.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "5");
    cell.style.textAlign = "center";
    cell.style.padding = "24px";
    cell.style.color = "var(--muted)";
    cell.textContent = "No active listings at this time.";
    row.appendChild(cell);
    listingsContainer.appendChild(row);
    return;
  }

  listings.forEach((item) => {
    const row = document.createElement("tr");

    const address = document.createElement("td");
    address.textContent = item.address;

    const price = document.createElement("td");
    price.textContent = item.price;

    const details = document.createElement("td");
    details.textContent = item.details;

    const status = document.createElement("td");
    status.textContent = item.status;

    const action = document.createElement("td");
    action.appendChild(createActionElement(item.url, item.label, "Add Listing Link"));

    row.appendChild(address);
    row.appendChild(price);
    row.appendChild(details);
    row.appendChild(status);
    row.appendChild(action);
    listingsContainer.appendChild(row);
  });
}

function renderSmogPage() {
  const vehiclesContainer = document.querySelector("[data-section='vehicles']");
  const customerContainer = document.querySelector("[data-section='customer-info']");

  if (vehiclesContainer) {
    const vehicles = pageContent.vehicles || [];
    vehiclesContainer.innerHTML = "";

    vehicles.forEach((item) => {
      const article = document.createElement("article");
      article.className = "card reveal";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const text = document.createElement("p");
      text.textContent = item.description;

      article.appendChild(title);
      article.appendChild(text);
      vehiclesContainer.appendChild(article);
      observeRevealItem(article);
    });
  }

  if (customerContainer) {
    const infoCards = pageContent.customerInfo || [];
    customerContainer.innerHTML = "";

    infoCards.forEach((item) => {
      const article = document.createElement("article");
      article.className = "card reveal";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const text = document.createElement("p");
      text.textContent = item.text;

      article.appendChild(title);
      article.appendChild(text);
      article.appendChild(createActionElement(item.url, item.label, "More Info"));
      customerContainer.appendChild(article);
      observeRevealItem(article);
    });
  }
}

function renderDonationPage() {
  const infoContainer = document.querySelector("[data-section='donation-info']");
  if (!infoContainer) {
    return;
  }

  const cards = pageContent.infoCards || [];
  infoContainer.innerHTML = "";

  cards.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const text = document.createElement("p");
    text.textContent = item.text;

    article.appendChild(title);
    article.appendChild(text);
    infoContainer.appendChild(article);
    observeRevealItem(article);
  });
}

function dispatchPageRenderer() {
  const page = document.body.getAttribute("data-page");

  switch (page) {
    case "home":
      renderHomeRepositories();
      renderHomePage();
      break;
    case "about":
      renderAboutPage();
      break;
    case "shop":
      renderShopPage();
      break;
    case "homes":
      renderHomesPage();
      break;
    case "smog":
      renderSmogPage();
      break;
    case "donation":
      renderDonationPage();
      break;
    default:
      renderHomeRepositories();
      break;
  }
}

applyTextContent();
applyPageTextContent();
renderPanelItems();
renderFooterIcons();
dispatchPageRenderer();
