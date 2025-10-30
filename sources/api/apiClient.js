import { KEY_STORAGE } from "./constant";
// api/apiClient.js
(function (global) {
    function getBaseUrl() {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost')) {
            return "https://hoclaptrinh.vaonline.vn";
        }
        return `https://${hostname}`;
    }
    // Lấy token từ localStorage hoặc sessionStorage
    function getToken() {
        return {
            token: localStorage.getItem(KEY_STORAGE.TOKEN) || sessionStorage.getItem(KEY_STORAGE.TOKEN),
            yearSelected: localStorage.getItem(KEY_STORAGE.YEAR_SELECTED) || '',
            orgUnit: localStorage.getItem(KEY_STORAGE.ORG_UNIT) || '',
            lang: localStorage.getItem(KEY_STORAGE.LANG_SELECTED) || 'vi'
        };
    }

    // === Thiết lập các sự kiện toàn cục cho webix.ajax ===
    webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers, files, promise) {
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token.token};${token.orgUnit};${token.yearSelected};${token.lang}`;
        }
        // Nếu có base URL thì ghép vào
        if (url && !url.startsWith("http")) {
            request.url = getBaseUrl() + url;
        }
    });

    webix.attachEvent("onLoadError", function (xhr, status, err, url) {
        console.error("❌ API load error:", url, status, err);
        webix.message({ type: "error", text: "Lỗi tải dữ liệu từ server" });
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
        async get(url, params = {}) {
            const query = Object.keys(params)
                .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                .join("&");
            const fullUrl = query ? `${url}?${query}` : url;
            const res = await webix.ajax().get(fullUrl);
            return res.json();
        },

        async post(url, data = {}) {
            const res = await webix.ajax().headers({
                "Content-Type": "application/json"
            }).post(url, JSON.stringify(data));
            return res.json();
        },

        async put(url, data = {}) {
            const res = await webix.ajax().headers({
                "Content-Type": "application/json"
            }).put(url, JSON.stringify(data));
            return res.json();
        },

        async delete(url) {
            const res = await webix.ajax().del(url);
            return res.json();
        }
    };
    global.apiClient = apiClient;

})(window);
