/**
 * Splits an element's text into word / char spans and returns a restore function.
 * The original child nodes are put back untouched, so React's references stay valid.
 * Only one experiment may own an element at a time (data-fx-split-owner).
 */
export function splitText(el: HTMLElement, owner: string, mode: 'chars' | 'words') {
  if (el.dataset.fxSplitOwner && el.dataset.fxSplitOwner !== owner) return null;
  const original = Array.from(el.childNodes);
  const text = el.textContent ?? '';
  const hadLabel = el.hasAttribute('aria-label');
  if (!hadLabel) el.setAttribute('aria-label', text);
  el.dataset.fxSplitOwner = owner;

  const frag = document.createDocumentFragment();
  const words = text.split(/(\s+)/);
  const units: HTMLSpanElement[] = [];
  words.forEach((w) => {
    if (/^\s+$/.test(w)) {
      frag.appendChild(document.createTextNode(' '));
      return;
    }
    if (!w) return;
    const word = document.createElement('span');
    word.className = 'fx-word';
    word.setAttribute('aria-hidden', 'true');
    if (mode === 'words') {
      const inner = document.createElement('span');
      inner.className = 'fx-unit';
      inner.textContent = w;
      word.appendChild(inner);
      units.push(inner);
    } else {
      for (const ch of w) {
        const c = document.createElement('span');
        c.className = 'fx-unit fx-char';
        c.textContent = ch;
        word.appendChild(c);
        units.push(c);
      }
    }
    frag.appendChild(word);
  });
  el.replaceChildren(frag);

  return {
    units,
    restore() {
      el.replaceChildren(...original);
      if (!hadLabel) el.removeAttribute('aria-label');
      delete el.dataset.fxSplitOwner;
    },
  };
}
