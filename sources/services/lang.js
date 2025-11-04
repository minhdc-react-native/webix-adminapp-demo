import LangVi from "../locales/vi";
import LangEn from "../locales/en";
import LoadingView from "../views/loading";
import { VcStorage } from "./storage";
import VcMessage from "./message";

export function Lang(app) {
    const service = {
        locale: app.getService("locale"),
        api: app.getService("api"),
        getCurrent() {
            return VcStorage.getLang();
        },
        async changeLang(lang, setLoading) {
            try {
                setLoading(true);

                const [data, error] = await this.api.get("/System/GetLanguagesByMa", {
                    params: { lang },
                    showLoading: false
                });

                const fixData = {};
                if (Array.isArray(data)) {
                    data.forEach((item) => {
                        fixData[item.KEY_LANG] = item.VALUES_LANG;
                    });
                }

                const staticData = lang === "vi" ? LangVi : LangEn;
                const allDataLang = Object.assign({}, staticData, fixData);

                VcStorage.setLang(lang);
                VcStorage.setLangData(JSON.stringify(allDataLang));

                this.locale.setLang(lang);
                this.locale.setLangData(lang, allDataLang);
                VcMessage.success(`🌐 Đã chuyển ngôn ngữ sang ${lang.toUpperCase()}`);
            } catch (err) {
                console.error("Lỗi changeLang:", err);
                VcMessage.error("Không thể tải dữ liệu ngôn ngữ");
            } finally {
                setLoading(false);
            }
        },

        async getDataLang() {
            const lang = VcStorage.getLang();
            let langData = VcStorage.getLangData();

            let fixData = {};
            if (!langData) {
                const [data, error] = await this.api.get("/System/GetLanguagesByMa", {
                    params: { lang },
                    showLoading: false
                });

                if (Array.isArray(data)) {
                    data.forEach((item) => {
                        fixData[item.KEY_LANG] = item.VALUES_LANG;
                    });
                }

                VcStorage.setLangData(JSON.stringify(fixData));
            } else {
                try {
                    fixData = JSON.parse(langData);
                } catch (e) {
                    fixData = {};
                }
            }

            const staticData = lang === "vi" ? LangVi : LangEn;
            const allDataLang = Object.assign({}, staticData, fixData);
            this.locale.setLang(lang);
            this.locale.setLangData(lang, allDataLang);
        },
    };
    app.setService("lang", service);
}