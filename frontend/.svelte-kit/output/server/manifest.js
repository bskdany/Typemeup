export const manifest = (() => {
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
		client: {"start":"_app/immutable/entry/start.qgX-P3NU.js","app":"_app/immutable/entry/app.uLNtOEAd.js","imports":["_app/immutable/entry/start.qgX-P3NU.js","_app/immutable/chunks/scheduler.ej-FHh4R.js","_app/immutable/chunks/singletons.NClt3y1K.js","_app/immutable/chunks/index.C2mUCbkw.js","_app/immutable/entry/app.uLNtOEAd.js","_app/immutable/chunks/scheduler.ej-FHh4R.js","_app/immutable/chunks/index.T7VZsvJZ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
