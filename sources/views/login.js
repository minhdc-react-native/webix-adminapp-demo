import { JetView } from "webix-jet";
import { getService } from "../services/serviceHelper";
import { VcStorage } from "../services/storage";
import LoadingView from "./loading";
import { KEY_DATA_CONNECTION } from "../constant/constant";
import VcMessage from "../services/message";
export default class LoginView extends JetView {

    constructor(config) {
        super(config);
        this.lang = getService("lang");
        this.session = getService("session");
        this.dataCollection = getService('dataCollection');
    }

    config() {
        const currentLang = this.lang.getCurrent();
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
                                        onChange: (lang) => this.lang.changeLang(lang, this.setLoading.bind(this)),
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
                                                            view: "gridcombo", displayField: 'id', name: 'dvcs', label: this._("login.org.unit"), labelPosition: 'top',
                                                            columns: [
                                                                { id: 'id', header: this._('DVCS_ID'), width: 100 },
                                                                { id: 'value', header: this._('TEN_V'), width: 500 }
                                                            ],
                                                            dataCollection: this.dataCollection.getCollection(KEY_DATA_CONNECTION.DVCS_ID)
                                                        },
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
                                                                    // loadingText: "Truy cập...",
                                                                    hotkey: "F10",
                                                                    click: function () {
                                                                        this.$scope.doLogin(this);
                                                                    },
                                                                },
                                                            ]
                                                        },
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
        return this.lang.locale._(key);
    }

    init(view) {
        this.loading = this.ui(LoadingView);
        const defaultValue = this.session.getUser();
        if (defaultValue.username !== '') this.onBlurUserName(defaultValue);
    }

    setLoading(loading) {
        loading ? this.loading.showLoading("...") : this.loading.hideLoading();
    }

    async onBlurUserName(defaultValue) {
        const form = this.$$("loginForm");
        const { username } = defaultValue || form.getValues();
        await this.dataCollection.load(KEY_DATA_CONNECTION.DVCS_ID, '/System/GetDvcsByUser', { params: { username: username }, reload: true });
        if (defaultValue) form.setValues(defaultValue);
    }

    async doLogin(btn) {
        btn.showLoading(true);
        const form = this.$$("loginForm");
        form.disable();
        const infoLogin = form.getValues();
        const [data, error] = await this.session.login(infoLogin);
        form.enable();
        btn.showLoading(false);
        if (!error) {
            this.show("/main");
        }
    }

    forgotPassword() {
        this.session.forgotPassword();
    }

    register() {
        this.session.register();
    }
}
