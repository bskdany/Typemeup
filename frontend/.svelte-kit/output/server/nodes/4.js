import * as universal from '../entries/pages/profile/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/profile/+page.ts";
export const imports = ["_app/immutable/nodes/4.F3ZbjJKj.js","_app/immutable/chunks/singletons.Z_Dh2hys.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/control.pJ1mnnAb.js","_app/immutable/chunks/account.O0lOx3M-.js","_app/immutable/chunks/index.OK4Beg-z.js","_app/immutable/chunks/navigation.YInfb9RU.js","_app/immutable/chunks/stores.70PHTsTf.js"];
export const stylesheets = ["_app/immutable/assets/4.eyAtdPUJ.css"];
export const fonts = [];
