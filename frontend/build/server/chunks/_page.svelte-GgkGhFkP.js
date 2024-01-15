import { c as create_ssr_component, b as subscribe, e as escape } from './ssr-mdArggYB.js';
import { p as page } from './stores-wTL6RyOH.js';

const css = {
  code: "#homepage.svelte-1k4k26u{position:absolute;left:30px;top:30px}#logout.svelte-1k4k26u{position:absolute;right:30px;top:30px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let result;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css);
  result = $page.data.message;
  $$unsubscribe_page();
  return `<button id="homepage" class="svelte-1k4k26u" data-svelte-h="svelte-4j9wjq">Home</button> <div>${escape(result)}</div> <button id="logout" class="svelte-1k4k26u" data-svelte-h="svelte-1ogrzdc">Logout</button>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-GgkGhFkP.js.map
