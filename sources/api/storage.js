import { KEY_STORAGE } from "./constant";

export const VcStorage = {
    getToken: function (token) {
        localStorage.getItem(KEY_STORAGE.TOKEN);
    },
    setToken: function (token) {
        localStorage.setItem(KEY_STORAGE.TOKEN, token);
    },
    clearToken: function () {
        localStorage.removeItem(KEY_STORAGE.TOKEN);
    },
    setYear: function (year) {
        localStorage.setItem(KEY_STORAGE.YEAR_SELECTED, year);
    },
    clearYear: function () {
        localStorage.removeItem(KEY_STORAGE.YEAR_SELECTED);
    },
    setLang: function (lang) {
        localStorage.setItem(KEY_STORAGE.LANG_SELECTED, lang);
    },
    clearLang: function () {
        localStorage.removeItem(KEY_STORAGE.LANG_SELECTED);
    },
    setOrgUnit: function (orgUnit) {
        localStorage.setItem(KEY_STORAGE.ORG_UNIT, orgUnit);
    },
    clearOrgUnit: function () {
        localStorage.removeItem(KEY_STORAGE.ORG_UNIT);
    }
};