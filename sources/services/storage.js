import { KEY_STORAGE } from "../constant/constant";

export const VcStorage = {
    setToken(token) {
        localStorage.setItem(KEY_STORAGE.TOKEN, token);
    },
    getToken() {
        return localStorage.getItem(KEY_STORAGE.TOKEN);
    },
    clearToken() {
        localStorage.removeItem(KEY_STORAGE.TOKEN);
    },

    setYear(year) {
        localStorage.setItem(KEY_STORAGE.YEAR_SELECTED, year);
    },
    getYear() {
        return localStorage.getItem(KEY_STORAGE.YEAR_SELECTED);
    },
    clearYear() {
        localStorage.removeItem(KEY_STORAGE.YEAR_SELECTED);
    },
    setLang(lang) {
        localStorage.setItem(KEY_STORAGE.LANG_SELECTED, lang);
    },
    getLang() {
        return localStorage.getItem(KEY_STORAGE.LANG_SELECTED) || "vi";
    },
    clearLang() {
        localStorage.removeItem(KEY_STORAGE.LANG_SELECTED);
    },

    setLangData(langData) {
        localStorage.setItem(KEY_STORAGE.LANG_DATA, langData);
    },
    getLangData() {
        return localStorage.getItem(KEY_STORAGE.LANG_DATA);
    },
    clearLangData() {
        localStorage.removeItem(KEY_STORAGE.LANG_DATA);
    },

    setOrgUnit(orgUnit) {
        localStorage.setItem(KEY_STORAGE.ORG_UNIT, orgUnit);
    },
    getOrgUnit() {
        return localStorage.getItem(KEY_STORAGE.ORG_UNIT);
    },
    clearOrgUnit() {
        localStorage.removeItem(KEY_STORAGE.ORG_UNIT);
    },

    setInfoLogin(infoLogin) {
        localStorage.setItem(KEY_STORAGE.INFO_LOGIN, infoLogin);
    },
    getInfoLogin() {
        return localStorage.getItem(KEY_STORAGE.INFO_LOGIN);
    },
    clearInfoLogin() {
        localStorage.removeItem(KEY_STORAGE.INFO_LOGIN);
    },
    setListYear(listYear) {
        localStorage.setItem(KEY_STORAGE.LIST_YEAR, listYear);
    },
    getListYear() {
        return localStorage.getItem(KEY_STORAGE.LIST_YEAR);
    },
    setCompany(company) {
        localStorage.setItem(KEY_STORAGE.COMPANY, company);
    },
    getCompany() {
        return localStorage.getItem(KEY_STORAGE.COMPANY);
    },
};
