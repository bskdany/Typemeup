

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.XFgwstUh.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/index.OK4Beg-z.js"];
export const stylesheets = ["_app/immutable/assets/global.nzHaFFjm.css"];
export const fonts = [];
