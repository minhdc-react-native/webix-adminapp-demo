import { VcStorage } from "./storage";
import { getService } from "./serviceHelper";
import VcMessage from "./message";

export function Session(app) {
    const service = {
        app: app,
        api: getService("api"),
        _user: null,
        _listYear: [],
        _currentYear: null,
        _company: {},
        init() {
            const token = this.getToken();
            if (token) {
                const user = this.getUser();
                this._user = user;
                this._listYear = JSON.parse(VcStorage.getListYear());
                this._company = JSON.parse(VcStorage.getCompany());
                this._currentYear = this._listYear[0].id;
            }
        },

        getToken() {
            return VcStorage.getToken();
        },

        setToken(token) {
            VcStorage.setToken(token);
        },

        clearToken() {
            VcStorage.clearToken();
        },
        setListYear(listYear) {
            const fixListYear = listYear.map(y => ({ id: y.NAM, value: y.NAM, from_date: y.TU_NGAY, to_date: y.DEN_NGAY }));
            VcStorage.setListYear(JSON.stringify(fixListYear));
            VcStorage.setYear(fixListYear[0].NAM);
            this._listYear = fixListYear;
            this._currentYear = fixListYear[0].NAM;
        },
        setCompany(company) {
            this._company = company;
            VcStorage.setCompany(JSON.stringify(company));
        },
        async login(infoLogin) {
            const { username, pass, dvcs } = infoLogin;
            const [data, error] = await this.api.post("/Account/Login", { username, pass, dvcs, captcha_token: '' }, { form: true });
            if (data.error) {
                VcMessage.error(data.error);
                return [null, data];
            } else {
                VcMessage.success("success!");
                this.setToken(data.token);
                this.setListYear(data.nam);
                VcStorage.setOrgUnit(infoLogin.dvcs);
                this.setUser(infoLogin);
                const [company] = await this.api.get("/System/GetInfoDvcs");
                this.setCompany(company[0]);
            }
            return [data, error];
        },

        logout() {
            this.clearToken();
            this.clearUser();

            const dataService = getService("dataCollection");
            dataService.disposeAll();

            this.app.show("/login");
        },

        setUser(user) {
            this._user = user;
            if (user.remember) {
                VcStorage.setInfoLogin(JSON.stringify(user));
            } else {
                VcStorage.clearInfoLogin();
            }
        },

        getUser() {
            if (this._user) return this._user;
            const raw = VcStorage.getInfoLogin();
            this._user = raw ? JSON.parse(raw) : {
                username: '',
                pass: '',
                dvcs: '',
                remember: false
            };
            return this._user;
        },
        getCompany() {
            return this._company;
        },
        clearUser() {
            this._user = null;
            VcStorage.clearInfoLogin();
        },

        isAuthenticated() {
            return !!this.getToken();
        },

        forgotPassword() {

        },

        register() {

        }
    };
    app.setService("session", service);
}