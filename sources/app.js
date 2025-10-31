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
		this.getDataApp();
	}
	async getDataApp() {
		const lang = VcStorage.getLang();
		const langData = VcStorage.getLangData();
		let fixData = {};
		if (!langData) {
			const [data, error] = await apiClient.get("/System/GetLanguagesByMa", { params: { lang: lang }, showLoading: false });
			data.forEach((item) => {
				fixData[item.KEY_LANG] = item.VALUES_LANG;
			});
			VcStorage.getLangData(JSON.stringify(fixData));
		} else {
			fixData = JSON.parse(langData);
		}
		const allDataLang = Object.assign({}, fixData, lang === "vi" ? LangVi : LangEn);
		const locale = this.getService("locale");
		locale.setLangData(lang, fixData);
		locale.setLang(lang);
		const token = VcStorage.getToken();
		if (token) {
			this.show("/app-list");
		} else {
			this.show("/login");
		}
	}
}