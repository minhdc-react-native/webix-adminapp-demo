import "regenerator-runtime/runtime";
import "./styles/custom/custom";
import "./styles/app.css";
import "./webix/components";
import "./api/apiClient";
import { JetApp, EmptyRouter, HashRouter } from "webix-jet";
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
	}

	init() {
		const token = VcStorage.getToken();
		if (token) {
			this.show("/app-list");
		} else {
			this.show("/login");
		}
	}
}