import LoadingView from "../views/loading";
import { VcStorage } from "./storage";
// api/apiClient.js
(function (global) {

    function handleAjaxError(err, method, url) {
        let message = `❌ Request ${method} ${url} failed`;

        if (err.status) {
            message += ` (status ${err.status})`;
            try {
                const body = err.responseText ? JSON.parse(err.responseText) : null;
                if (body && body.message) message += `: ${body.message}`;
            } catch (e) {
                console.error('error>>', e);
            }
        } else {
            message += " (network error)";
        }

        console.error(message, err);
        // webix.message({ type: "error", text: message });
    }

    function getBaseUrl() {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost')) {
            return "https://hoclaptrinh.vaonline.vn/api";
        }
        return `https://${hostname}/api`;
    }
    // Lấy token từ localStorage hoặc sessionStorage
    function getToken() {
        return {
            token: VcStorage.getToken(),
            yearSelected: VcStorage.getYear(),
            orgUnit: VcStorage.getOrgUnit(),
            lang: VcStorage.getLang()
        };
    }

    // === Thiết lập các sự kiện toàn cục cho webix.ajax ===
    webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers, files, promise) {
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token.token};${token.orgUnit};${token.yearSelected};${token.lang}`;
        }
    });

    webix.attachEvent("onLoadError", function (xhr, status, err, url) {
        console.error("❌ API load error:", url, status, err);
        // webix.message({ type: "error", text: "Lỗi tải dữ liệu từ server" });
    });

    webix.attachEvent("onAjaxError", function (xhr) {
        console.error("⚠️ Ajax error:", xhr.status, xhr.responseText);
    });

    webix.attachEvent("onAfterAjax", function (mode, url, data, xhr, headers) {
        if (xhr.status === 401) {
            webix.message({ type: "error", text: "Phiên đăng nhập hết hạn" });
            apiClient.clearToken();
            // chuyển hướng login...
        }
    });

    const apiClient = {
        async request(method, url, { data, params, onSuccess, onError, showLoading = false } = {}) {

            let loaderId = null;
            try {
                if (showLoading) {
                    loaderId = webix.ui(LoadingView);
                    loaderId.show();
                }
                let fullUrl = getBaseUrl() + url;
                if (params && Object.keys(params).length) {
                    const query = Object.keys(params)
                        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                        .join("&");
                    fullUrl += `?${query}`;
                }
                const res = await webix.ajax()[method.toLowerCase()](fullUrl, data ? JSON.stringify(data) : null);
                const json = res.json();
                if (onSuccess) onSuccess(json);
                return [json, null];
            } catch (err) {
                handleAjaxError(err, method, url);
                if (onError) onError(err);
                return [null, err];
                // throw err;
            } finally {
                // if (loaderId) loaderId.hideLoading();
            }
        },

        async get(url, options = {}) {
            return await this.request("GET", url, options);
        },

        async post(url, data = {}, options = {}) {
            const opts = Object.assign({}, options, { data });
            return await this.request("POST", url, opts);
        },

        async put(url, data = {}, options = {}) {
            const opts = Object.assign({}, options, { data });
            return await this.request("PUT", url, opts);
        },

        async delete(url, options = {}) {
            return await this.request("DELETE", url, options);
        }
    };
    global.apiClient = apiClient;

})(window);