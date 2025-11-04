import "regenerator-runtime/runtime";
import "./styles/custom/custom";
import "./styles/app.css";
import "./webix/components";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import { initServices } from "./services/initServices";
import { VcStorage } from "./services/storage";
import { getService } from "./services/serviceHelper";

export default class InventoryApp extends JetApp {
	constructor(config) {
		const token = VcStorage.getToken();
		super(webix.extend({
			id: APPNAME,
			version: VERSION,
			// start: token ? "/main" : "/login",
			start: "/login",
			router: HashRouter, // hoặc EmptyRouter nếu bạn không muốn dùng hash
			debug: !PRODUCTION,
		}, config, true));
		initServices(this);
		this.initDataApp();
	}

	initDataApp() {
		const lang = getService('lang');
		lang.getDataLang();
		const session = getService('session');
		session.init();
	}
}