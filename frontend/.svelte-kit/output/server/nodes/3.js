

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/account/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.QshvH4Lw.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/index.OK4Beg-z.js","_app/immutable/chunks/navigation.YInfb9RU.js","_app/immutable/chunks/singletons.Z_Dh2hys.js","_app/immutable/chunks/account.O0lOx3M-.js"];
export const stylesheets = ["_app/immutable/assets/3.YS9SnsOC.css"];
export const fonts = [];
