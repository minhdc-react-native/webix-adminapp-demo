import "regenerator-runtime/runtime";
import "./styles/custom/custom";
import "./styles/app.css";
import "./webix/components";
import "./api/apiClient";
import LangVi from "./locales/vi";
import LangEn from "./locales/en";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import { VcStorage } from "./api/storage";

export default class InventoryApp extends JetApp {
	constructor(config) {
		super(webix.extend({
			id: APPNAME,
			version: VERSION,
			start: "/login",
			router: HashRouter, // hoặc EmptyRouter nếu bạn không muốn dùng hash
			debug: !PRODUCTION,
		}, config, true));
		this.use(plugins.Locale);
	}
}