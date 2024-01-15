import { c as create_ssr_component, d as add_attribute, e as escape, v as validate_component } from "../../../chunks/ssr.js";
const css$1 = {
  code: "#loginWrapper.svelte-2i6ygm{display:flex;flex-direction:column;gap:10px;width:min-content\n    }input.svelte-2i6ygm{border:solid transparent;padding:10px;border-radius:10px;background-color:#2c2e31;color:white}#errorMessage.svelte-2i6ygm{margin-top:10px;color:rgb(215, 61, 61);height:1rem}",
  map: null
};
const LoginToAccount = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let username = "";
  let password = "";
  let errorMessage = "";
  $$result.css.add(css$1);
  return `<div id="loginWrapper" class="svelte-2i6ygm"><input placeholder="username" class="svelte-2i6ygm"${add_attribute("value", username, 0)}> <input type="password" placeholder="password" class="svelte-2i6ygm"${add_attribute("value", password, 0)}> <button data-svelte-h="svelte-1gf1pps">Login</button></div> <div id="errorMessage" class="svelte-2i6ygm">${escape(errorMessage)}</div>`;
});
const css = {
  code: "#homepage.svelte-1gpn727{position:absolute;left:30px;top:30px}.switchLoginMode.svelte-1gpn727{margin-top:30px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<button id="homepage" class="svelte-1gpn727" data-svelte-h="svelte-4j9wjq">Home</button> ${`${validate_component(LoginToAccount, "LoginToAccount").$$render($$result, {}, {}, {})} <button class="switchLoginMode svelte-1gpn727" data-svelte-h="svelte-onyz8e">Register account instead</button>`}`;
});
export {
  Page as default
};
