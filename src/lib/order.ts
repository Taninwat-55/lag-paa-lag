// The order form: sizes follow the chosen cake, "Order this one" buttons fill
// it in, and submitting shows a summary instead of sending anything.

type Cake = { name: string; sizes: { serves: number; price: number }[] };

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmt = new Intl.NumberFormat("da-DK");
const longDate = (s: string) =>
  new Date(`${s}T12:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export function initOrder(section: HTMLElement | null) {
  if (!section) return;
  const form = section.querySelector<HTMLFormElement>(".form")!;
  const done = section.querySelector<HTMLElement>(".done")!;
  const cakes: Cake[] = JSON.parse(form.dataset.cakes ?? "[]");
  const notice = Number(form.dataset.notice ?? 3);
  const $ = <T extends HTMLElement>(id: string) => section.querySelector<T>(`#${id}`)!;
  const cake = $<HTMLSelectElement>("f-cake"), size = $<HTMLSelectElement>("f-size");
  const piped = $<HTMLInputElement>("f-piped"), date = $<HTMLInputElement>("f-date");
  const name = $<HTMLInputElement>("f-name"), contact = $<HTMLInputElement>("f-contact");

  // the earliest day is counted from today in the visitor's browser, not from the build
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + notice);
  date.min = iso(earliest);

  const fillSizes = (pick?: number) => {
    const c = cakes[Number(cake.value)];
    size.replaceChildren(new Option(c ? "Choose a size" : "Choose a cake first", ""));
    c?.sizes.forEach(s => size.add(new Option(`Serves ${s.serves} · ${fmt.format(s.price)} kr.`, String(s.serves))));
    if (pick && c?.sizes.some(s => s.serves === pick)) size.value = String(pick);
  };
  cake.addEventListener("change", () => fillSizes());

  // buttons elsewhere on the page that start an order
  document.querySelectorAll<HTMLElement>("[data-order-cake]").forEach(b =>
    b.addEventListener("click", () => {
      cake.value = b.dataset.orderCake ?? "";
      fillSizes(Number(b.dataset.orderServes) || undefined);
      if (b.dataset.orderPiped !== undefined) piped.value = b.dataset.orderPiped;
      show(form);
    }),
  );

  const err = (el: HTMLInputElement | HTMLSelectElement, msg: string) => {
    const box = section.querySelector<HTMLElement>(`#e-${el.id.slice(2)}`)!;
    box.textContent = msg;
    el.setAttribute("aria-invalid", String(Boolean(msg)));
    return !msg;
  };

  const check = () => {
    const c = contact.value.trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
    const phone = c.replace(/[\s+\-()]/g, "").match(/^\d{8,12}$/);
    const results = [
      err(cake, cake.value ? "" : "Choose which cake you want."),
      err(size, size.value ? "" : "Choose how many people it should serve."),
      err(piped, piped.value.trim().length > 16 ? "Keep the name to 16 letters so it fits on the cake." : ""),
      err(date, !date.value ? "Choose the day you’ll collect it."
        : date.value < date.min ? `We need ${notice} days. The earliest is ${longDate(date.min)}.` : ""),
      err(name, name.value.trim() ? "" : "Tell us your name so we know whose cake it is."),
      err(contact, !c ? "Add a phone number or an email."
        : email || phone ? "" : "That doesn’t look like a phone number (8 digits) or an email address."),
    ];
    return results.every(Boolean);
  };

  // re-check a field as soon as it's fixed, never while the visitor is still typing a first time
  [cake, size, piped, date, name, contact].forEach(el =>
    el.addEventListener("change", () => { if (el.getAttribute("aria-invalid") === "true") check(); }),
  );

  function show(which: HTMLElement) {
    form.hidden = which !== form;
    done.hidden = which !== done;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!check()) {
      section.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const c = cakes[Number(cake.value)];
    const s = c.sizes.find(x => String(x.serves) === size.value)!;
    const set = (k: string, v: string) => { done.querySelector(`[data-done="${k}"]`)!.textContent = v; };
    set("name", name.value.trim());
    set("cake", c.name);
    set("serves", String(s.serves));
    set("piped", piped.value.trim());
    set("date", longDate(date.value));
    set("price", `${fmt.format(s.price)} kr.`);
    (done.querySelector('[data-done-row="piped"]') as HTMLElement).hidden = !piped.value.trim();
    show(done);
    done.focus();
  });

  done.querySelector("[data-again]")!.addEventListener("click", () => {
    form.reset();
    fillSizes();
    [cake, size, piped, date, name, contact].forEach(el => err(el, ""));
    show(form);
    cake.focus();
  });
}
