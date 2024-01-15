const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.Pf0j_3Hr.js","app":"_app/immutable/entry/app.p9xS-vlt.js","imports":["_app/immutable/entry/start.Pf0j_3Hr.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/singletons.Z_Dh2hys.js","_app/immutable/chunks/control.pJ1mnnAb.js","_app/immutable/entry/app.p9xS-vlt.js","_app/immutable/chunks/scheduler.zQhsiUAY.js","_app/immutable/chunks/index.OK4Beg-z.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-JjlWQ8v9.js')),
			__memo(() => import('./chunks/1-K5Cm1Yag.js')),
			__memo(() => import('./chunks/2-8RGUoB_3.js')),
			__memo(() => import('./chunks/3-x3IEaJPq.js')),
			__memo(() => import('./chunks/4-GITIPzzx.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
