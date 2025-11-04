import { JetView, plugins } from "webix-jet";
import { getService } from "../services/serviceHelper";
import { KEY_DATA_CONNECTION } from "../constant/constant";

export default class TopView extends JetView {
	constructor(config) {
		super(config);
		this.lang = getService("lang");
		this.session = getService("session");
		this.dataCollection = getService('dataCollection');
	}

	config() {
		const sidebar = {
			localId: "sidebar",
			view: "sidebar", css: "webix_light", width: 150, collapsed: true, position: "left",
			data: [
				{ id: "dash", value: "Dashboard", icon: "mdi mdi-view-dashboard" },
				{ id: "charts", value: "Charts", icon: "mdi mdi-chart-areaspline" },
				{ id: "tables", value: "Tables", icon: "mdi mdi-table" },
				{ id: "forms", value: "Forms", icon: "mdi mdi-format-line-style" },
				{ id: "sheet", value: "Spreadsheet", icon: "mdi mdi-table-large" },
				{ id: "kanban", value: "Kanban", icon: "mdi mdi-view-column" },
				{ id: "pivot", value: "Pivot", icon: "mdi mdi-layers" },
				{ id: "files", value: "File Manager", icon: "mdi mdi-folder-star" }
			]
		};

		const toolbar = {
			view: "toolbar",
			padding: 9, height: 58,
			cols: [
				{
					localId: "toggleButton",
					height: 59,
					view: "icon",
					icon: "mdi mdi-menu",
					click: () => this.toggleSidebar()
				},
				{
					template: "<div class='login-logo'></div>", borderless: true, width: 130
				},
				{
					view: 'richselect',
					options: this.session._listYear,
					width: 80,
					value: this.session._currentYear
				},
				{
					template: `<image class="mainphoto" src="data/images/morgan_yu.jpg">
					<span class="webix_icon mdi mdi-circle status green"></span>`,
					width: 60, css: "avatar", borderless: true
				},
				{
					borderless: true,
					template: (`
						<div style="line-height:1.4;">
							<div style="font-weight:bold; font-size:15px;">${this.session._company.TEN_DVCS}</div>
							<div style="font-size:13px; color:#666;">MST: ${this.session._company.MS_THUE}</div>
						</div>
					`)
				},
				{},
				{ view: "icon", icon: "mdi mdi-bell", badge: "5" },
				{ view: "icon", icon: "mdi mdi-settings" },
			]
		};

		return {
			type: "clean", rows: [
				toolbar,
				{ cols: [sidebar, { $subview: true }] }
			]
		};
	}

	init() {
		this.use(plugins.Menu, "sidebar");
	}

	_(key) {
		return this.lang.locale._(key);
	}

	toggleSidebar() {
		const sidebar = this.$$("sidebar");
		if (!sidebar) return;
		sidebar.toggle();
		const button = this.$$("toggleButton");

		if (sidebar.config.collapsed) {
			button.define("icon", "mdi mdi-menu");
		} else {
			button.define("icon", "mdi mdi-backburger");
		}
		button.resize();
		button.refresh();
	}
}