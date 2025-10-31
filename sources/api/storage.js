import { KEY_STORAGE } from "./constant";

export const VcStorage = {
    setToken: function (token) {
        localStorage.setItem(KEY_STORAGE.TOKEN, token);
    },
    getToken: function (token) {
        return localStorage.getItem(KEY_STORAGE.TOKEN);
    },
    clearToken: function () {
        localStorage.removeItem(KEY_STORAGE.TOKEN);
    },
    setYear: function (year) {
        localStorage.setItem(KEY_STORAGE.YEAR_SELECTED, year);
    },
    getYear: function () {
        return localStorage.getItem(KEY_STORAGE.YEAR_SELECTED);
    },
    clearYear: function () {
        localStorage.removeItem(KEY_STORAGE.YEAR_SELECTED);
    },
    setLang: function (lang) {
        localStorage.setItem(KEY_STORAGE.LANG_SELECTED, lang);
    },
    getLang: function (lang) {
        return localStorage.getItem(KEY_STORAGE.LANG_SELECTED) || 'vi';
    },
    clearLang: function () {
        localStorage.removeItem(KEY_STORAGE.LANG_SELECTED);
    },
    getLangData: function () {
        return localStorage.getItem(KEY_STORAGE.LANG_DATA);
    },
    setLangData: function (langData) {
        localStorage.setItem(KEY_STORAGE.LANG_DATA, JSON.stringify(langData));
    },
    setOrgUnit: function (orgUnit) {
        localStorage.setItem(KEY_STORAGE.ORG_UNIT, orgUnit);
    },
    getOrgUnit: function () {
        return localStorage.getItem(KEY_STORAGE.ORG_UNIT);
    },
    clearOrgUnit: function () {
        localStorage.removeItem(KEY_STORAGE.ORG_UNIT);
    },
    getInfoLogin: function () {
        return localStorage.getItem(KEY_STORAGE.INFO_LOGIN);
    },
    setInfoLogin: function (infoLogin) {
        return localStorage.setItem(KEY_STORAGE.INFO_LOGIN, infoLogin);
    },
    cleanInfoLogin: function () {
        localStorage.removeItem(KEY_STORAGE.INFO_LOGIN);
    }
};