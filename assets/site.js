const ENDPOINTS = {
  content: "data/content.json",
  sessionizeLive: "https://sessionize.com/api/speaker/json/3vmqc4qxf0",
  sessionizeFallback: "data/sessionize-fallback.json",
  githubProfile: "https://api.github.com/users/nicolaparo",
  githubRepos: "https://api.github.com/users/nicolaparo/repos?per_page=100&sort=updated"
};

const UI_TEXT = {
  en: {
    navProjects: "Projects",
    navSkills: "Skills",
    navSessions: "Sessions",
    navEvents: "Events",
    navContact: "Contact",
    heroEyebrow: "Building software at the edge of cloud and AI",
    ctaTalks: "View talks",
    ctaProjects: "Explore projects",
    highlightsTitle: "Technology Focus",
    projectsTitle: "Featured Projects",
    projectsSubtitle: "Live projects from GitHub, focused on current work.",
    skillsTitle: "Skills and Stack",
    skillsSubtitle: "Hands-on experience across architecture, coding, and delivery.",
    sessionsTitle: "Latest Sessions",
    sessionsSubtitle: "Auto-loaded from Sessionize.",
    eventsTitle: "Events Timeline",
    eventsSubtitle: "Recent and upcoming conferences.",
    newsTitle: "News and Updates",
    newsSubtitle: "What I am currently exploring and sharing.",
    contactTitle: "Let us build something meaningful",
    contactText: "Open to technical conversations, speaking opportunities, and collaborative product ideas.",
    footerText: "Data source status:",
    talksLive: "Live data from Sessionize",
    talksFallback: "Showing fallback data while Sessionize is unavailable",
    talksError: "Unable to load Sessionize data right now.",
    updatedAt: "Updated",
    upcoming: "Upcoming",
    recent: "Recent",
    repo: "Repository",
    demo: "Live demo",
    noDescription: "Description will be updated soon.",
    by: "by",
    readMore: "Read more",
    codeSubtitle: "Live JSON payload that powers this website.",
    githubLive: "Projects loaded from public GitHub profile",
    githubFallback: "Showing curated project fallback"
  },
  it: {
    navProjects: "Progetti",
    navSkills: "Competenze",
    navSessions: "Sessioni",
    navEvents: "Eventi",
    navContact: "Contatti",
    heroEyebrow: "Software all avanguardia tra cloud e AI",
    ctaTalks: "Vai ai talk",
    ctaProjects: "Scopri i progetti",
    highlightsTitle: "Focus Tecnologico",
    projectsTitle: "Progetti in Evidenza",
    projectsSubtitle: "Progetti live da GitHub, con focus sulle attivita recenti.",
    skillsTitle: "Competenze e Stack",
    skillsSubtitle: "Esperienza concreta su architettura, sviluppo e delivery.",
    sessionsTitle: "Sessioni Recenti",
    sessionsSubtitle: "Caricate automaticamente da Sessionize.",
    eventsTitle: "Timeline Eventi",
    eventsSubtitle: "Conferenze recenti e imminenti.",
    newsTitle: "News e Aggiornamenti",
    newsSubtitle: "Cosa sto esplorando e condividendo in questo periodo.",
    contactTitle: "Costruiamo qualcosa di utile",
    contactText: "Disponibile per confronti tecnici, opportunita come speaker e nuove idee di prodotto.",
    footerText: "Stato origine dati:",
    talksLive: "Dati live da Sessionize",
    talksFallback: "Visualizzazione fallback: Sessionize non disponibile",
    talksError: "Impossibile caricare Sessionize in questo momento.",
    updatedAt: "Aggiornato",
    upcoming: "In arrivo",
    recent: "Recenti",
    repo: "Repository",
    demo: "Demo live",
    noDescription: "Descrizione in aggiornamento.",
    by: "di",
    readMore: "Approfondisci",
    codeSubtitle: "Payload JSON live che alimenta questo sito.",
    githubLive: "Progetti caricati dal profilo GitHub pubblico",
    githubFallback: "Visualizzazione fallback dei progetti curati"
  }
};

const state = {
  mode: "en",
  lang: "en",
  content: null,
  sessionize: null,
  sessionizeSource: "none",
  githubCache: new Map(),
  githubProfile: null,
  githubRepos: []
};

const q = (selector) => document.querySelector(selector);

function modeFromBrowser() {
  const stored = localStorage.getItem("np-mode");
  if (stored === "en" || stored === "code") {
    return stored;
  }

  // Backward compatibility for previous "it" mode.
  if (stored === "it") {
    return "en";
  }

  return "en";
}

function t(key) {
  return UI_TEXT[state.lang][key] || key;
}

function tr(item) {
  if (!item) {
    return "";
  }

  if (typeof item === "string") {
    return item;
  }

  return item[state.lang] || item.en || "";
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  const locale = state.lang === "it" ? "it-IT" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function setText(selector, value) {
  const element = q(selector);
  if (element) {
    element.textContent = value;
  }
}

function updateI18nLabels() {
  state.lang = "en";
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });

  q("#mode-human")?.classList.toggle("is-active", state.mode === "en");
  q("#mode-code")?.classList.toggle("is-active", state.mode === "code");
}

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

function buildJsonNode(payload) {
  const pre = createElement("pre", "json-inline");
  pre.textContent = JSON.stringify(payload, null, 2);
  return pre;
}

function renderProfile() {
  const profile = state.content.profile;
  const speaker = state.sessionize?.speaker || {};

  const heroTagline = q("#hero-tagline");
  const heroBio = q("#hero-bio");

  if (state.mode === "code") {
    if (heroTagline) {
      heroTagline.classList.add("json-inline");
      heroTagline.textContent = JSON.stringify({
        tagline: speaker.tagline || tr(profile.tagline)
      }, null, 2);
    }

    if (heroBio) {
      heroBio.classList.add("json-inline");
      heroBio.textContent = JSON.stringify({
        bio: speaker.bio || tr(profile.bio),
        profile: speaker.speakerProfileUrl || profile.sessionizeProfile
      }, null, 2);
    }
  } else {
    heroTagline?.classList.remove("json-inline");
    heroBio?.classList.remove("json-inline");
    setText("#hero-tagline", speaker.tagline || tr(profile.tagline));
    setText("#hero-bio", speaker.bio || tr(profile.bio));
  }

  setText("#hero-name", profile.name);

  const sessionizeLink = q("#sessionize-link");
  if (sessionizeLink) {
    sessionizeLink.href = speaker.speakerProfileUrl || profile.sessionizeProfile;
  }

  const heroImage = q("#hero-image");
  if (heroImage && (speaker.photoLargeUrl || speaker.photoUrl)) {
    heroImage.src = speaker.photoLargeUrl || speaker.photoUrl;
  }

  const social = q("#social-links");
  social.innerHTML = "";
  profile.social.forEach((item) => {
    const li = document.createElement("li");
    const link = createElement("a", "", item.label);
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    li.appendChild(link);
    social.appendChild(li);
  });

  const linkedin = profile.social.find((s) => s.label.toLowerCase().includes("linkedin"));
  const github = profile.social.find((s) => s.label.toLowerCase().includes("github"));
  if (linkedin) {
    q("#linkedin-link").href = linkedin.url;
  }
  if (github) {
    q("#github-link").href = github.url;
  }
}

function renderHighlights() {
  const container = q("#highlight-cards");
  container.innerHTML = "";

  state.content.highlights.forEach((entry) => {
    const card = createElement("article", "card");
    if (state.mode === "code") {
      card.appendChild(buildJsonNode(entry));
    } else {
      card.appendChild(createElement("h3", "", tr(entry.title)));
      card.appendChild(createElement("p", "", tr(entry.text)));
    }
    container.appendChild(card);
  });
}

async function fetchGithubRepo(repo) {
  if (!repo || !repo.includes("/")) {
    return null;
  }

  if (state.githubCache.has(repo)) {
    return state.githubCache.get(repo);
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      state.githubCache.set(repo, null);
      return null;
    }

    const data = await response.json();
    const normalized = {
      stars: data.stargazers_count,
      language: data.language,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url
    };
    state.githubCache.set(repo, normalized);
    return normalized;
  } catch {
    state.githubCache.set(repo, null);
    return null;
  }
}

async function renderProjects() {
  const container = q("#projects-grid");
  container.innerHTML = "";

  const activeGithubProjects = state.githubRepos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      description: {
        en: repo.description || "Active repository from my current GitHub work.",
        it: repo.description || "Repository attiva del mio lavoro attuale su GitHub."
      },
      repo: repo.full_name,
      stack: [repo.language || "Code", ...(repo.topics || []).slice(0, 4)],
      featured: true
    }));

  const projects = activeGithubProjects.length ? activeGithubProjects : state.content.projects.slice();
  const repoResults = await Promise.all(projects.map((project) => fetchGithubRepo(project.repo)));

  projects.forEach((project, index) => {
    const github = repoResults[index];

    const card = createElement("article", "card");
    if (state.mode === "code") {
      card.appendChild(buildJsonNode({ project, github: github || null }));
      container.appendChild(card);
      return;
    }

    const title = createElement("h3", "", project.name);
    card.appendChild(title);
    card.appendChild(createElement("p", "", tr(project.description) || t("noDescription")));

    const stackRow = createElement("div", "pill-row");
    (project.stack || []).forEach((tech) => {
      stackRow.appendChild(createElement("span", "pill", tech));
    });
    card.appendChild(stackRow);

    if (github) {
      const meta = createElement("div", "meta-line");
      if (typeof github.stars === "number") {
        meta.appendChild(createElement("span", "chip", `GitHub ★ ${github.stars}`));
      }
      if (github.language) {
        meta.appendChild(createElement("span", "chip", github.language));
      }
      if (github.updatedAt) {
        meta.appendChild(createElement("span", "chip", `${t("updatedAt")}: ${formatDate(github.updatedAt)}`));
      }
      card.appendChild(meta);
    }

    const links = createElement("div", "project-links");
    if (project.repo && github?.htmlUrl) {
      const repoLink = createElement("a", "", t("repo"));
      repoLink.href = github.htmlUrl;
      repoLink.target = "_blank";
      repoLink.rel = "noreferrer";
      links.appendChild(repoLink);
    }

    if (project.demo) {
      const demoLink = createElement("a", "", t("demo"));
      demoLink.href = project.demo;
      demoLink.target = "_blank";
      demoLink.rel = "noreferrer";
      links.appendChild(demoLink);
    }

    if (links.childNodes.length) {
      card.appendChild(links);
    }

    container.appendChild(card);
  });

  const subtitle = q("#projects-title")?.parentElement?.querySelector("p");
  if (subtitle) {
    subtitle.textContent = activeGithubProjects.length ? t("githubLive") : t("githubFallback");
  }
}

function renderSkills() {
  const container = q("#skills-grid");
  container.innerHTML = "";

  state.content.skills.forEach((skillBlock) => {
    const card = createElement("article", "skill-card");
    if (state.mode === "code") {
      card.appendChild(buildJsonNode(skillBlock));
    } else {
      card.appendChild(createElement("h3", "", tr(skillBlock.category)));

      const row = createElement("div", "pill-row");
      skillBlock.items.forEach((item) => {
        row.appendChild(createElement("span", "pill", item));
      });
      card.appendChild(row);
    }
    container.appendChild(card);
  });
}

function renderNews() {
  const container = q("#news-grid");
  container.innerHTML = "";

  state.content.news.forEach((item) => {
    const card = createElement("article", "card");
    if (state.mode === "code") {
      card.appendChild(buildJsonNode(item));
      container.appendChild(card);
      return;
    }

    card.appendChild(createElement("h3", "", tr(item.title)));
    card.appendChild(createElement("p", "", tr(item.text)));

    if (item.url) {
      const link = createElement("a", "", t("readMore"));
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.width = "fit-content";
      link.style.color = "var(--primary-strong)";
      link.style.textDecoration = "none";
      card.appendChild(link);
    }

    container.appendChild(card);
  });
}

function sortEvents(events) {
  return events
    .slice()
    .sort((a, b) => new Date(b.eventStartDate).getTime() - new Date(a.eventStartDate).getTime());
}

function renderSessions() {
  const sessions = (state.sessionize?.sessions || []).slice(0, 6);
  const grid = q("#sessions-grid");
  grid.innerHTML = "";

  sessions.forEach((session) => {
    const card = createElement("article", "card");
    if (state.mode === "code") {
      card.appendChild(buildJsonNode(session));
      grid.appendChild(card);
      return;
    }

    card.appendChild(createElement("h3", "", session.title));

    const description = (session.description || "").replace(/\s+/g, " ").trim();
    card.appendChild(createElement("p", "", description.slice(0, 210) + (description.length > 210 ? "..." : "")));

    const meta = createElement("div", "meta-line");
    if (session.language) {
      meta.appendChild(createElement("span", "chip", session.language));
    }
    card.appendChild(meta);

    if (session.sessionUrl) {
      const link = createElement("a", "", t("ctaTalks"));
      link.href = session.sessionUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.width = "fit-content";
      link.style.color = "var(--primary-strong)";
      link.style.textDecoration = "none";
      card.appendChild(link);
    }

    grid.appendChild(card);
  });

  const status = q("#sessions-status");
  status.className = "status " + (state.sessionizeSource === "live" ? "ok" : "error");
  status.textContent = state.sessionizeSource === "live" ? t("talksLive") : t("talksFallback");
}

function renderEvents() {
  const events = sortEvents(state.sessionize?.events || []).slice(0, 10);
  const container = q("#events-timeline");
  container.innerHTML = "";

  const now = Date.now();

  events.forEach((event) => {
    const item = createElement("article", "timeline-item");
    if (state.mode === "code") {
      item.appendChild(buildJsonNode(event));
      container.appendChild(item);
      return;
    }

    item.appendChild(createElement("h3", "", event.name));

    const dateText = `${formatDate(event.eventStartDate)} - ${formatDate(event.eventEndDate)}`;
    item.appendChild(createElement("p", "", dateText));

    if (event.location) {
      item.appendChild(createElement("p", "", event.location));
    }

    const badge = createElement(
      "span",
      "chip",
      new Date(event.eventStartDate).getTime() >= now ? t("upcoming") : t("recent")
    );
    item.appendChild(badge);

    if (event.website) {
      const link = createElement("a", "", event.website);
      link.href = event.website;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.display = "block";
      link.style.marginTop = "0.65rem";
      link.style.fontSize = "0.88rem";
      link.style.textDecoration = "none";
      link.style.color = "var(--primary-strong)";
      item.appendChild(link);
    }

    container.appendChild(item);
  });

  const status = q("#events-status");
  status.className = "status " + (state.sessionizeSource === "live" ? "ok" : "error");
  status.textContent = state.sessionizeSource === "live" ? t("talksLive") : t("talksFallback");
}

async function loadJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadSessionize() {
  try {
    const live = await loadJson(ENDPOINTS.sessionizeLive, 6000);
    state.sessionize = live;
    state.sessionizeSource = "live";
    return;
  } catch {
    try {
      const fallback = await loadJson(ENDPOINTS.sessionizeFallback, 4000);
      state.sessionize = fallback;
      state.sessionizeSource = "fallback";
      return;
    } catch {
      state.sessionize = { sessions: [], events: [] };
      state.sessionizeSource = "none";
    }
  }
}

async function loadGithub() {
  try {
    const [profile, repos] = await Promise.all([
      loadJson(ENDPOINTS.githubProfile, 5000),
      loadJson(ENDPOINTS.githubRepos, 5000)
    ]);
    state.githubProfile = profile;
    state.githubRepos = Array.isArray(repos) ? repos : [];
  } catch {
    state.githubProfile = null;
    state.githubRepos = [];
  }
}

function updateFooterStatus() {
  const now = new Date();
  const locale = state.lang === "it" ? "it-IT" : "en-US";
  const sourceText = state.sessionizeSource === "live" ? t("talksLive") : t("talksFallback");
  q("#last-sync").textContent = `${sourceText} - ${new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(now)}`;
}

async function renderAll() {
  updateI18nLabels();
  renderProfile();
  renderHighlights();
  await renderProjects();
  renderSkills();
  renderSessions();
  renderEvents();
  renderNews();
  updateFooterStatus();
}

async function init() {
  state.mode = modeFromBrowser();
  state.lang = "en";

  const setModeAndRender = async (mode) => {
    state.mode = mode;
    state.lang = "en";
    localStorage.setItem("np-mode", mode);
    await renderAll();
  };

  q("#mode-human")?.addEventListener("click", () => setModeAndRender("en"));
  q("#mode-code")?.addEventListener("click", () => setModeAndRender("code"));

  state.content = await loadJson(ENDPOINTS.content, 6000);
  await loadGithub();
  await loadSessionize();
  await renderAll();

  if (state.sessionizeSource !== "none") {
    const refreshDelay = 1000 * 60 * 30;
    setInterval(async () => {
      await loadSessionize();
      await renderAll();
    }, refreshDelay);
  } else {
    q("#sessions-status").className = "status error";
    q("#sessions-status").textContent = t("talksError");
    q("#events-status").className = "status error";
    q("#events-status").textContent = t("talksError");
  }
}

init().catch(() => {
  q("#sessions-status").className = "status error";
  q("#sessions-status").textContent = "Startup error";
  q("#events-status").className = "status error";
  q("#events-status").textContent = "Startup error";
});
