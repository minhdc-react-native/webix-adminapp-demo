import LoadingView from "../views/loading";
import VcMessage from "./message";
import { VcStorage } from "./storage";

function handleAjaxError(err, method, url) {
    let message = `❌ Request ${method} ${url} failed`;

    if (err.status) {
        message += ` (status ${err.status})`;
        try {
            const body = err.responseText ? JSON.parse(err.responseText) : null;
            if (body && body.message) message += `: ${body.message}`;
        } catch (e) {
            console.error("error parsing response", e);
        }
    } else {
        message += " (network error)";
    }

    console.error(message, err);
    VcMessage.error(message);
}

function getBaseUrl() {
    const hostname = window.location.hostname;
    if (hostname.includes("localhost")) {
        return "https://hoclaptrinh.vaonline.vn/api";
    }
    return `https://${hostname}/api`;
}

function getTokenHeader() {
    const token = VcStorage.getToken();
    const year = VcStorage.getYear();
    const orgUnit = VcStorage.getOrgUnit();
    const lang = VcStorage.getLang();
    if (!token) return null;
    return `Bearer ${token};${orgUnit};${year};${lang}`;
}

export function Api(app) {
    webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers) => {
        const header = getTokenHeader();
        if (header) headers["Authorization"] = header;
    });

    webix.attachEvent("onLoadError", (xhr, status, err, url) => {
        console.error("❌ API load error:", url, status, err);
    });

    webix.attachEvent("onAjaxError", (xhr) => {
        console.error("⚠️ Ajax error:", xhr.status, xhr.responseText);
    });

    webix.attachEvent("onAfterAjax", (mode, url, data, xhr) => {
        if (xhr.status === 401) {
            VcMessage.error("Phiên đăng nhập hết hạn");
            const session = app.getService("session");
            if (session && session.logout)
                session.logout();
            else {
                VcStorage.clearToken();
                VcStorage.clearInfoLogin();
            }
            app.show("/login");
        }
    });

    const service = {
        async request(method, url, { data, params, headers = {}, form = false, onSuccess, onError, loader } = {}) {
            try {
                if (loader) {
                    if (loader && loader.showLoading) loader.showLoading("...");
                }

                let fullUrl = getBaseUrl() + url;

                if (params && Object.keys(params).length) {
                    const query = Object.keys(params)
                        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                        .join("&");
                    fullUrl += `?${query}`;
                }

                // 🔹 xử lý body theo kiểu
                let body = null;
                if (data) {
                    if (form) {
                        body = Object.keys(data)
                            .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
                            .join("&");
                        headers["Content-Type"] = "application/x-www-form-urlencoded";
                    } else {
                        body = JSON.stringify(data);
                        headers["Content-Type"] = "application/json";
                    }
                }

                const res = await webix.ajax().headers(headers)[method.toLowerCase()](fullUrl, body);
                const json = res.json();

                if (onSuccess) onSuccess(json);
                return [json, null];
            } catch (err) {
                handleAjaxError(err, method, url);
                if (onError) onError(err);
                return [null, err];
            } finally {
                if (loader && loader.hideLoading) loader.hideLoading();
            }
        },
        async get(url, options = {}) {
            return this.request("GET", url, options);
        },
        async post(url, data = {}, options = {}) {

            const opts = Object.assign({}, options, { data });
            return this.request("POST", url, opts);
        },
        async put(url, data = {}, options = {}) {
            const opts = Object.assign({}, options, { data });
            return this.request("PUT", url, opts);
        },
        async delete(url, options = {}) {
            return this.request("DELETE", url, options);
        },
    };
    app.setService("api", service);
}