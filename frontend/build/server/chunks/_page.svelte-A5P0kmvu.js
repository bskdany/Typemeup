import { c as create_ssr_component } from './ssr-mdArggYB.js';

/* empty css                  */
const fingerToKeyMap = {
  0: ["q", "a"],
  1: ["w", "s", "d"],
  2: ["e", "d", "x"],
  3: ["r", "f", "c", "t", "g", "v"],
  4: ["space"],
  // what a waste right? considering its the main typing finger on the smartphone
  5: ["space"],
  6: ["y", "h", "b", "u", "j", "n", "m"],
  7: ["i", "k", ","],
  8: ["o", "l", "."],
  9: ["p", ";", "/", "backspace"]
};
function reverseFingerToKeyMap() {
  let keyToFingerIndex = {};
  for (const [finger, keys] of Object.entries(fingerToKeyMap)) {
    for (const key of keys) {
      keyToFingerIndex[key] = finger;
    }
  }
  return keyToFingerIndex;
}
reverseFingerToKeyMap();
const css = {
  code: "#profilePage.svelte-po10zr{position:absolute;right:30px;top:30px}@media only screen and (max-width: 767px){#keyboardWrapper.svelte-po10zr{display:none}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<button id="profilePage" class="svelte-po10zr" data-svelte-h="svelte-11oz6oe">Profile</button> ${`${``}`}`;
  } while (!$$settled);
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-A5P0kmvu.js.map
