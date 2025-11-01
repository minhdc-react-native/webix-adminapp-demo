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
                    paddingX: 20,
                    paddingY: 5,
                    cols: [
                        { template: "<div class='login-logo'></div>", borderless: true, autoheight: true, autowidth: true },
                        {},
                        {
                            rows: [
                                {},
                                {
                                    view: "segmented",
                                    options: [
                                        { id: "vi", value: "🇻🇳 Tiếng Việt" },
                                        { id: "en", value: "🇬🇧 English" },
                                    ],
                                    value: currentLang,
                                    width: 250,
                                    height: 35,
                                    on: {
                                        onChange: (lang) => this.changeLang(lang),
                                    },
                                },
                                {}
                            ]
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
                                            css: {
                                                "border-radius": "12px",
                                                "border": "1px solid #e0e0e0",
                                                "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.1)",
                                                "background": "#fff"
                                            },
                                            rows: [
                                                { template: (`<div class='login-title template_center'>${this._('login.login')}</div>`), borderless: true, height: 50 },
                                                {
                                                    view: "form",
                                                    margin: 10,
                                                    paddingX: 20,
                                                    paddingY: 20,
                                                    localId: "loginForm",
                                                    elements: [
                                                        { view: "textinput", height: 60, name: "username", textCase: 'uppercase', iconShow: 'mdi mdi-account-tie', iconColor: "green", label: this._("login.username"), labelPosition: 'top', on: { onBlur: () => this.onBlurUserName() }, required: true },
                                                        { view: "password", height: 60, name: "pass", iconShow: 'mdi mdi-shield-key', iconColor: 'red', label: this._("login.pass"), labelPosition: 'top', required: true },
                                                        {
                                                            localId: "idOrgUnit", height: 60, iconShow: 'mdi mdi-database', iconColor: 'purple',
                                                            view: "gridcombo", displayField: 'value', name: 'dvcs', label: this._("login.org.unit"), labelPosition: 'top',
                                                            columns: [
                                                                { id: 'id', header: this._('DVCS_ID'), width: 100 },
                                                                { id: 'value', header: this._('TEN_V'), width: 500 }
                                                            ]
                                                        },
                                                        // {
                                                        //     localId: "idOrgUnitSearch", iconShow: 'mdi mdi-database', iconColor: 'purple',
                                                        //     view: "gridsearch", height: 60, name: 'dvcs1', label: this._("login.org.unit"), labelPosition: 'top',
                                                        //     columns: [
                                                        //         { id: 'id', header: this._('DVCS_ID'), width: 100 },
                                                        //         { id: 'value', header: this._('TEN_V'), width: 500 }
                                                        //     ],
                                                        //     url: { link: '/System/GetDvcsByUser', filterKey: 'username' }
                                                        // },
                                                        {
                                                            cols: [
                                                                {
                                                                    view: "checkbox",
                                                                    name: "remember",
                                                                    label: this._('login.remember'),
                                                                    labelPosition: 'left'
                                                                },
                                                                {
                                                                    view: "button",
                                                                    value: this._('login.forgot.pass'),
                                                                    css: "webix_transparent",
                                                                    click: () => this.forgotPassword()
                                                                },
                                                            ]
                                                        },
                                                        {
                                                            height: 40,
                                                            cols: [
                                                                {
                                                                    view: "vcbutton",
                                                                    value: this._('login.register'),
                                                                    css: "webix_transparent",
                                                                    autowidth: true,
                                                                    hotkey: "F12",
                                                                    click: () => this.register()
                                                                },
                                                                {
                                                                    view: "vcbutton",
                                                                    value: this._('login.login'),
                                                                    type: "form",
                                                                    css: "webix_primary",
                                                                    icon: 'mdi mdi-login',
                                                                    iconPosition: "right",
                                                                    hotkey: "F10",
                                                                    click: function () {
                                                                        this.$scope.doLogin(this);
                                                                    },
                                                                },
                                                            ]
                                                        },
                                                        // {
                                                        //     view: "gridcombo",
                                                        //     name: 'dvcs2',
                                                        //     labelPosition: 'top',
                                                        //     height: 60,
                                                        //     label: "Danh mục",
                                                        //     iconShow: "mdi mdi-folder-outline",
                                                        //     displayField: "value",
                                                        //     columns: [
                                                        //         {
                                                        //             id: "value", header: "Film title", width: 250,
                                                        //             template: "{common.space()}{common.icon()} #value#"
                                                        //         },
                                                        //         { id: "chapter", header: "Mode", width: 200 }
                                                        //     ],
                                                        //     data: [
                                                        //         {
                                                        //             "id": "1", "value": "The Shawshank Redemption", "open": true, "data": [
                                                        //                 { "id": "1.1", "value": "Part 1.1", "chapter": "alpha" },
                                                        //                 {
                                                        //                     "id": "1.2", "value": "Part 1.2", "chapter": "beta", "open": true, "data": [
                                                        //                         { "id": "1.2.1", "value": "Part 1.2.1", "chapter": "beta-twin" }
                                                        //                     ]
                                                        //                 }
                                                        //             ]
                                                        //         }
                                                        //     ]
                                                        // }
                                                        { view: "numeric", height: 60, labelPosition: 'top', name: 'inputNum', label: 'Input number', value: 123423.09 },
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
        if (orgUnit) orgUnit.parse(data);
    }

    async doLogin(btn) {
        this.loading.showLoading("...");
        btn.showLoading(true);
        try {
            const data = this.$$("loginForm").getValues();
            console.log('data login>>', data);
            // await apiClient.post("/api/auth/login", data);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            VcStorage.setInfoLogin(JSON.stringify(data));
            // this.app.show("/app-list");
        } catch (e) {
            webix.message({ type: "error", text: "Đăng nhập thất bại" });
        } finally {
            btn.showLoading(false);
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

    forgotPassword() {

    }

    register() {

    }
}
