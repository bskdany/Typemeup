import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: "@media only screen and (max-width: 767px){#keyboardWrapper.svelte-1ocwun8{display:none}}",
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
    $$rendered = `${`${``}`}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
