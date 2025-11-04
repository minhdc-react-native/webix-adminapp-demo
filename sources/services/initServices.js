import { setApp } from "./serviceHelper";
import { plugins } from "webix-jet";
import { Lang } from "./lang";
import { Api } from "./api";
import { Session } from "./session";
import { DataCollection } from "./dataCollection";
export function initServices(app) {
    setApp(app);
    app.use(plugins.Locale);
    app.use(Api);
    app.use(Lang);
    app.use(Session);
    app.use(DataCollection);
}
