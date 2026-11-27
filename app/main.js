// Bargain Burrow — app state: search, filters, sort and hash routing.
// List view lives at #/ (optionally #/?cat=Audio), one deal at #/deal/<id>.
import { deals, CHECKED_LABEL } from "./data.js";
import { cardHTML, detailHTML, pctOff, saved, money } from "./views.js";

const view = document.getElementById("view");
const explainer = document.getElementById("explainer");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search");
const catEl = document.getElementById("category");
const storeEl = document.getElementById("store");
const discEl = document.getElementById("min-discount");
const sortEl = document.getElementById("sort");

const state = { q: "", cat: "All", store: "All", minDisc: 0, sort: "pct" };

function filteredDeals() {
  const q = state.q.trim().toLowerCase();
  const list = deals.filter((d) => {
    if (state.cat !== "All" && d.category !== state.cat) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (pctOff(d) < state.minDisc) return false;
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  if (state.sort === "pct") list.sort((a, b) => pctOff(b) - pctOff(a) || saved(b) - saved(a));
  else if (state.sort === "saved") list.sort((a, b) => saved(b) - saved(a));
  else list.sort((a, b) => a.price - b.price);
  return list;
}

function renderList() {
  const list = filteredDeals();
  countEl.textContent = `Showing ${list.length} of ${deals.length} deals`;
  view.innerHTML = list.length
    ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
    : `<div class="empty"><p>No deals match those filters.</p><button id="clear-filters" type="button">Clear filters</button></div>`;
  const clear = document.getElementById("clear-filters");
  if (clear) {
    clear.addEventListener("click", () => {
      state.q = ""; state.cat = "All"; state.store = "All"; state.minDisc = 0;
      searchEl.value = ""; catEl.value = "All"; storeEl.value = "All"; discEl.value = "0";
      renderList();
    });
  }
  explainer.hidden = false;
}

function renderDetail(id) {
  const d = deals.find((x) => x.id === id);
  if (!d) { renderList(); return; }
  countEl.textContent = `${d.title} · ${d.store}`;
  view.innerHTML = detailHTML(d);
  explainer.hidden = true;
}

function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) {
    renderDetail(hash.slice(7).split("?")[0]);
    return;
  }
  const qIndex = hash.indexOf("?");
  if (qIndex !== -1) {
    const cat = new URLSearchParams(hash.slice(qIndex + 1)).get("cat");
    if (cat) { state.cat = cat; catEl.value = cat; }
  }
  renderList();
}

function fillStats() {
  const totalSaved = deals.reduce((sum, d) => sum + saved(d), 0);
  const biggest = Math.max(...deals.map(pctOff));
  document.getElementById("stat-deals").textContent = String(deals.length);
  document.getElementById("stat-savings").textContent = money(totalSaved);
  document.getElementById("stat-biggest").textContent = biggest + "%";
  document.getElementById("stat-checked").textContent = CHECKED_LABEL;
}

searchEl.addEventListener("input", () => { state.q = searchEl.value; renderList(); });
catEl.addEventListener("change", () => { state.cat = catEl.value; renderList(); });
storeEl.addEventListener("change", () => { state.store = storeEl.value; renderList(); });
discEl.addEventListener("change", () => { state.minDisc = Number(discEl.value); renderList(); });
sortEl.addEventListener("change", () => { state.sort = sortEl.value; renderList(); });
window.addEventListener("hashchange", route);

fillStats();
route();
