webix.protoUI({
    name: "vcbutton",
    $cssName: "button",
    defaults: {
        iconPosition: "left",
        loading: false,
        loadingText: "Đang xử lý..."
    },

    $init: function (config) {
        if (config.hotkey)
            config._hotkey = config.hotkey;
        this.attachEvent("onAfterRender", this._applyIconLayout.bind(this));
    },

    _applyIconLayout: function () {
        const view = this.$view;
        if (!view) return;

        const btn = view.querySelector("button");
        if (!btn) return;

        // reset layout
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.gap = "6px";

        const iconCls = this.config.icon ? `webix_icon ${this.config.icon}` : "";
        const labelText = this.config.value || "";

        // clear old content
        btn.innerHTML = "";
        const pos = this.config.iconPosition;

        if (this.config._hotkey && pos === "right") {
            const hotkeyEl = document.createElement("span");
            hotkeyEl.className = "vcbutton-hotkey";
            hotkeyEl.textContent = this.config._hotkey;
            btn.appendChild(hotkeyEl);

            hotkeyEl.style.fontSize = "10px";
            hotkeyEl.style.opacity = "0.6";
            hotkeyEl.style.marginLeft = "6px";
        }

        // create elements
        const iconEl = document.createElement("span");
        if (iconCls) iconEl.className = iconCls;

        const labelEl = document.createElement("span");
        labelEl.className = "vcbutton-label";
        labelEl.textContent = labelText;

        // set layout by iconPosition

        btn.style.flexDirection =
            pos === "top"
                ? "column"
                : pos === "bottom"
                    ? "column-reverse"
                    : pos === "right"
                        ? "row-reverse"
                        : "row";

        if (iconCls) btn.appendChild(iconEl);
        if (labelText) btn.appendChild(labelEl);

        if (this.config._hotkey && pos !== "right") {
            const hotkeyEl = document.createElement("span");
            hotkeyEl.className = "vcbutton-hotkey";
            hotkeyEl.textContent = this.config._hotkey;
            btn.appendChild(hotkeyEl);

            hotkeyEl.style.fontSize = "10px";
            hotkeyEl.style.opacity = "0.6";
            hotkeyEl.style.marginLeft = "6px";
        }

        if (this.config.autowidth && this.config._hotkey) {
            btn.style.width = "auto";
            webix.delay(() => {
                let baseWidth = btn.offsetWidth;
                const hotkeyEl = btn.querySelector(".vcbutton-hotkey");
                if (hotkeyEl) {
                    const hotkeyWidth = hotkeyEl.offsetWidth;
                    baseWidth += hotkeyWidth;
                }
                this.define("width", baseWidth);
                const parent = this.getParentView();
                if (parent && parent.resizeChildren) parent.resizeChildren();
                else this.resize();
            });
        }

        // apply loading state if needed
        if (this.config.loading) this._setLoading(true);
    },

    _setLoading: function (state) {
        const btn = this.$view.querySelector("button");
        if (!btn) return;
        this.config.loading = state;

        btn.disabled = state;
        btn.innerHTML = ""; // clear content

        if (state) {
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.gap = "6px";

            const spinner = document.createElement("span");
            spinner.className = "webix_icon mdi mdi-loading spin"; // spinner icon
            const label = document.createElement("span");
            label.textContent = this.config.loadingText;

            btn.appendChild(spinner);
            btn.appendChild(label);
        } else {
            this._applyIconLayout(); // restore normal layout
        }
    },

    showLoading: function (state) {
        this._setLoading(state);
    }
}, webix.ui.button);
