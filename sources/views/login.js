import { JetView } from "webix-jet";
import LoadingView from "./loading";
import { VcStorage } from "../api/storage";
import LangVi from "../locales/vi";
import LangEn from "../locales/en";
export default class LoginView extends JetView {

    constructor(config) {
        super(config);
        this.locale = this.app.getService("locale");
    }

    config() {
        const currentLang = VcStorage.getLang();
        return {
            css: "login-page",
            rows: [
                {
                    view: "toolbar",
                    css: "login-toolbar",
                    padding: 20,
                    cols: [
                        { template: "<div class='login-logo'>🧩 MyApp</div>", borderless: true, autoheight: true },
                        {},
                        {
                            view: "segmented",
                            options: [
                                { id: "vi", value: "🇻🇳 Tiếng Việt" },
                                { id: "en", value: "🇬🇧 English" },
                            ],
                            value: currentLang,
                            width: 250,
                            on: {
                                onChange: (lang) => this.changeLang(lang),
                            },
                        },
                    ],
                },
                {
                    cols: [
                        {},
                        {
                            cols: [
                                {},
                                {
                                    rows: [
                                        {},
                                        {
                                            width: 400,
                                            // padding: 40,
                                            borderless: true,
                                            css: { "border-radius": '10px' },
                                            rows: [
                                                { template: (`<div class='login-title template_center'>${this._('login.login')}</div>`), borderless: true, height: 50 },
                                                {
                                                    view: "form",
                                                    localId: "loginForm",
                                                    elements: [
                                                        { view: "text", name: "username", label: this._("login.username"), on: { onBlur: () => this.onBlurUserName() }, required: true },
                                                        { view: "password", name: "pass", label: this._("login.pass"), required: true },
                                                        {
                                                            localId: "idOrgUnit", view: "gridcombo", name: 'dvcs', label: this._("login.org.unit"),
                                                            columns: [
                                                                { id: 'id', header: this._('DVCS_ID'), width: 100 },
                                                                { id: 'value', header: this._('TEN_V'), width: 500 }
                                                            ]
                                                        },
                                                        {
                                                            localId: "idOrgUnitSearch", view: "gridsearch", icon: 'wxi-plus', name: 'dvcs1', label: this._("login.org.unit"),
                                                            columns: [
                                                                { id: 'id', header: this._('DVCS_ID'), width: 100 },
                                                                { id: 'value', header: this._('TEN_V'), width: 500 }
                                                            ],
                                                            url: { link: '/System/GetDvcsByUser', filterKey: 'username' }
                                                        },
                                                        {
                                                            view: "checkbox",
                                                            name: "remember",
                                                            label: this._('login.remember'),
                                                            labelPosition: 'left'
                                                        },
                                                        {
                                                            view: "button",
                                                            value: this._('login.login'),
                                                            type: "form",
                                                            css: "webix_primary",
                                                            click: () => this.doLogin(),
                                                        },
                                                        {
                                                            cols: [
                                                                {
                                                                    view: "button",
                                                                    value: this._('login.forgot.pass'),
                                                                    css: "webix_transparent",
                                                                },
                                                                {
                                                                    view: "button",
                                                                    value: this._('login.register'),
                                                                    css: "webix_transparent",
                                                                },
                                                            ]
                                                        }
                                                    ],
                                                },
                                            ],
                                        },
                                        {}
                                    ]
                                },
                                {}
                            ]
                        },
                    ],
                },
                {
                    height: 40,
                    template: (`<div class="template_center">© ${(new Date()).getFullYear()} VACOM.,JSC — All rights reserved.</div>`),
                    borderless: true,
                },
            ],
        };
    }

    _(key) {
        return this.locale._(key);
    }

    init(view) {
        this.loading = this.ui(LoadingView);
        const form = this.$$("loginForm");
        const storageValue = VcStorage.getInfoLogin();
        const defaultValue = storageValue ? JSON.parse(storageValue) : {
            username: '',
            pass: '',
            dvcs: '',
            remember: false

        };
        form.setValues(defaultValue);
        if (defaultValue.username !== '') this.onBlurUserName();
    }

    async onBlurUserName() {
        const { username } = this.$$("loginForm").getValues();
        const [data, error] = await apiClient.get("/System/GetDvcsByUser", { params: { username: username }, showLoading: false });
        const orgUnit = this.$$("idOrgUnit");
        if (orgUnit) {
            const grid = orgUnit.getPopup().getBody();
            grid.clearAll();
            grid.parse(data);
        }
    }

    async doLogin() {
        this.loading.showLoading("...");
        try {
            const data = this.$$("loginForm").getValues();
            // await apiClient.post("/api/auth/login", data);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            VcStorage.setInfoLogin(JSON.stringify(data));
            // this.app.show("/app-list");
        } catch (e) {
            webix.message({ type: "error", text: "Đăng nhập thất bại" });
        } finally {
            this.loading.hideLoading();
        }
    }

    async changeLang(lang) {
        this.loading.showLoading("...");
        let fixData = {};
        const [data, error] = await apiClient.get("/System/GetLanguagesByMa", { params: { lang: lang }, showLoading: false });
        data.forEach((item) => {
            fixData[item.KEY_LANG] = item.VALUES_LANG;
        });
        const allDataLang = Object.assign({}, fixData, lang === "vi" ? LangVi : LangEn);
        VcStorage.setLang(lang);
        VcStorage.getLangData(JSON.stringify(allDataLang));
        this.locale.setLang(lang);
        this.locale.setLangData(lang, allDataLang);
        this.loading.hideLoading();
    }
}
