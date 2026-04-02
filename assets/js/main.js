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

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 70}ms`;
  observer.observe(item);
});

const content = window.SITE_CONTENT || {};

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

    if (repo.url) {
      const link = document.createElement("a");
      link.href = repo.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open Repository";
      article.appendChild(link);
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "button link-placeholder";
      placeholder.textContent = "Add Repository Link";
      article.appendChild(placeholder);
    }

    repoContainer.appendChild(article);
    observer.observe(article);
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

function renderAboutPage() {
  if (document.body.getAttribute("data-page") !== "about") {
    return;
  }

  const highlightsContainer = document.querySelector("[data-about='highlights']");
  const cardsContainer = document.querySelector("[data-about='cards']");
  const highlights = (content.about && content.about.highlights) || [];
  const cards = (content.about && content.about.cards) || [];

  if (highlightsContainer) {
    highlightsContainer.innerHTML = "";
    highlights.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      highlightsContainer.appendChild(li);
    });
  }

  if (cardsContainer) {
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
      observer.observe(article);
    });
  }
}

applyTextContent();
renderHomeRepositories();
renderFooterIcons();
renderAboutPage();
