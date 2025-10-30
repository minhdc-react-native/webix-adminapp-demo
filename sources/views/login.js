import { JetView } from "webix-jet";
import LoadingView from "./loading";

export default class LoginView extends JetView {
    config() {
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
                            value: "vi",
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
                                            width: 480,
                                            // padding: 40,
                                            borderless: true,
                                            css: { "border-radius": '10px' },
                                            rows: [
                                                { template: "<div class='login-title template_center'>Đăng nhập</div>", borderless: true, height: 50 },
                                                {
                                                    view: "form",
                                                    localId: "loginForm",
                                                    elements: [
                                                        { view: "text", name: "username", label: "User", required: true },
                                                        { view: "text", name: "password", label: "Password", type: "password", required: true },
                                                        {
                                                            margin: 10,
                                                            cols: [
                                                                {},
                                                                {
                                                                    view: "button",
                                                                    value: "Đăng nhập",
                                                                    type: "form",
                                                                    width: 150,
                                                                    css: "webix_primary",
                                                                    click: () => this.doLogin(),
                                                                },
                                                            ],
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
                    template: '<div class="template_center">© 2025 MyCompany — All rights reserved.</div>',
                    borderless: true,
                },
            ],
        };
    }

    init() {
        this.loading = this.ui(LoadingView);
    }

    async doLogin() {
        this.loading.showLoading("...");
        try {
            const data = this.$$("loginForm").getValues();
            // await apiClient.post("/api/auth/login", data);
            await new Promise((resolve) => setTimeout(resolve, 15000));
            // this.app.show("/app-list");
        } catch (e) {
            webix.message({ type: "error", text: "Đăng nhập thất bại" });
        } finally {
            this.loading.hideLoading();
        }
    }

    changeLang(lang) {
        webix.message(`Ngôn ngữ: ${lang}`);
        // ở đây có thể lưu vào localStorage hoặc reload app với lang
    }
}
