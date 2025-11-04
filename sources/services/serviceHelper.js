let app = null;

export function setApp(a) {
    app = a;
}

export function getService(name) {
    if (!app) throw new Error("App not initialized in ServiceHelper");
    return app.getService(name);
}
