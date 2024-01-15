import { r as redirect } from './index-8pACjapJ.js';

const baseUrl = "http://mustafar:3000";
async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    const message = await response.json();
    if (!message) {
      throw new Error(response.statusText);
    } else {
      throw new Error(message.error);
    }
  }
  return response.json();
}
async function accessRestriced() {
  const fetchOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const result = await fetchData("/", fetchOptions);
  return result;
}
const load = async ({ parent, data }) => {
  try {
    const result = await accessRestriced();
    return result;
  } catch (error) {
    redirect(301, "/account");
  }
};

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-GgkGhFkP.js')).default;
const universal_id = "src/routes/profile/+page.ts";
const imports = ["_app/immutable/nodes/4.F3ZbjJKj.js","_app/immutable/chunks/singletons.Z_Dh2hys.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/control.pJ1mnnAb.js","_app/immutable/chunks/account.O0lOx3M-.js","_app/immutable/chunks/index.OK4Beg-z.js","_app/immutable/chunks/navigation.YInfb9RU.js","_app/immutable/chunks/stores.70PHTsTf.js"];
const stylesheets = ["_app/immutable/assets/4.eyAtdPUJ.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=4-GITIPzzx.js.map
