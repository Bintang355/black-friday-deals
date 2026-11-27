// Bargain Burrow — view renderers: one deal card and one deal detail page.
// All prices are computed from the deal's price/was pair, never typed twice.
import { CHECKED_LABEL } from "./data.js";

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

// Whole-percent discount, rounded: (was - price) / was.
export function pctOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saved(d) {
  return d.was - d.price;
}

export const VERDICT_LABELS = {
  "new-low": "NEW LOW",
  strong: "STRONG DEAL",
  good: "GOOD DEAL",
  routine: "ROUTINE SALE",
};

export function verdictLabel(v) {
  return VERDICT_LABELS[v] || v.toUpperCase();
}

export function cardHTML(d) {
  const pct = pctOff(d);
  return `<article class="card">
    <div class="card-top"><span class="store-badge">${esc(d.store)}</span><span class="cat-tag">${esc(d.category)}</span></div>
    <h3 class="card-title"><a href="#/deal/${d.id}">${esc(d.title)}</a></h3>
    <p class="prices"><span class="price">${money(d.price)}</span><span class="was">${money(d.was)}</span><span class="pct-badge">-${pct}%</span></p>
    <p class="badges"><span class="verdict verdict-${d.verdict}">${verdictLabel(d.verdict)}</span><span class="save">Save ${money(saved(d))}</span></p>
    <p class="meta">Checked ${CHECKED_LABEL} &middot; ${esc(d.source)}</p>
    <a class="cta" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a>
  </article>`;
}

export function detailHTML(d) {
  const pct = pctOff(d);
  return `<div class="detail">
    <p><a class="back" href="#/">&larr; All deals</a></p>
    <div class="detail-top"><span class="store-badge">${esc(d.store)}</span><span class="cat-tag">${esc(d.category)}</span><span class="verdict verdict-${d.verdict}">${verdictLabel(d.verdict)}</span></div>
    <h2 class="detail-title">${esc(d.title)}</h2>
    <p class="detail-prices"><span class="price big">${money(d.price)}</span><span class="was big">${money(d.was)}</span><span class="pct-badge big">-${pct}%</span><span class="save big">Save ${money(saved(d))}</span></p>
    <p class="evidence"><strong>Why this verdict:</strong> ${esc(d.verdictNote)}</p>
    ${d.crossNote ? `<p class="cross-note">${esc(d.crossNote)}</p>` : ""}
    <p class="meta">Checked ${CHECKED_LABEL} &middot; Source: ${esc(d.source)}</p>
    <p><a class="cta big" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} &rarr;</a></p>
  </div>`;
}
