// One scrubbed timeline: each layer lands at its own fraction of the track,
// its receipt line appears with it, and the total follows. The last stretch
// holds the finished cake and brings in "Order this cake".

declare global { interface Window { gsap?: any; ScrollTrigger?: any } }

const END = 0.86;   // where the last layer is finished; the rest holds the cake
const LAND = 0.07;  // how long one layer takes to land, as a share of the track

export function initBuild(section: HTMLElement | null) {
  const { gsap, ScrollTrigger } = window;
  if (!section || !gsap || !ScrollTrigger) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion");

  const stage = section.querySelector<HTMLElement>(".stage")!;
  const lines = [...section.querySelectorAll<HTMLLIElement>(".lines li")];
  const prices = lines.map(li => Number(li.dataset.price ?? 0));
  const totalEl = section.querySelector<HTMLElement>(".total")!;
  const end = section.querySelector<HTMLElement>(".end")!;
  const layer = (id: string) => section.querySelector<SVGGElement>(`.layer[data-layer="${id}"]`)!;
  const at = lines.map((_, i) => (i / lines.length) * END + 0.03);

  const fmt = new Intl.NumberFormat("da-DK");
  let shown = -1;
  const sync = (p: number) => {
    let n = -1;
    at.forEach((a, i) => { if (p >= a + LAND * 0.6) n = i; });
    if (n === shown) return;
    shown = n;
    const sum = prices.slice(0, n + 1).reduce((s, x) => s + x, 0);
    totalEl.textContent = `${fmt.format(sum)} kr.`;
    lines.forEach((li, i) => li.classList.toggle("now", i === n && p < END));
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section, start: "top top", end: "+=320%",
      pin: stage, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st: any) => sync(st.progress),
    },
  });

  // the layers that drop: fall, squash a little on landing, settle
  ["sponge", "jam", "cream", "sponge2"].forEach((id, i) => {
    const g = layer(id);
    gsap.set(g, { transformOrigin: "50% 100%" });
    // a short, solid drop: it appears at once just above the stack, then falls
    tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: LAND * 0.08 }, at[i])
      .fromTo(g, { y: -70 }, { y: 0, duration: LAND * 0.75, ease: "power2.in" }, at[i])
      .to(g, { scaleY: 0.94, duration: LAND * 0.12, ease: "power1.out" }, at[i] + LAND * 0.75)
      .to(g, { scaleY: 1, duration: LAND * 0.13, ease: "power1.inOut" }, at[i] + LAND * 0.87);
  });

  // marzipan is laid on from the top and falls down the sides
  const mz = layer("marzipan");
  tl.fromTo(section.querySelector(".mz-curtain"), { attr: { height: 0 } }, { attr: { height: 300 }, duration: LAND, ease: "power1.inOut" }, at[4])
    .fromTo(mz, { y: -14 }, { y: 0, duration: LAND, ease: "power1.out" }, at[4]);

  // raspberries drop in one by one, pistachio scattered over them
  const berries = layer("berries");
  tl.fromTo(berries.querySelectorAll(".berry"), { y: -90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: LAND * 0.35, stagger: LAND * 0.07, ease: "power2.in" }, at[5])
    .fromTo(berries.querySelectorAll(".f-pistachio"), { autoAlpha: 0 }, { autoAlpha: 1, duration: LAND * 0.3, stagger: LAND * 0.02 }, at[5] + LAND * 0.4);

  // the flags go in, then the name is piped left to right
  const name = layer("name");
  tl.fromTo(name.querySelectorAll(".flag"), { y: -50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: LAND * 0.4, stagger: LAND * 0.15, ease: "power2.out" }, at[6])
    .fromTo(section.querySelector(".name-curtain"), { attr: { width: 0 } }, { attr: { width: 320 }, duration: LAND * 1.1 }, at[6] + LAND * 0.3);

  // receipt lines print as their layer lands
  lines.forEach((li, i) => {
    tl.fromTo(li, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: LAND * 0.4, ease: "power1.out" }, at[i] + LAND * 0.55);
  });

  // the end: the finished cake holds, and the order button arrives
  tl.fromTo(end, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: "power1.out" }, END + 0.01)
    .to({}, { duration: 1 - END - 0.06 }, END + 0.06);

  sync(0);
}
