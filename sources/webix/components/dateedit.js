webix.protoUI({
    name: "dateedit",
    $cssName: "text",
    defaults: {
        placeholder: "dd/MM/yyyy",
    },

    $init: function (config) {
        config.icon = "wxi-calendar";

        this.attachEvent("onKeyPress", function () {
            webix.delay(() => this._formatInput());
        });

        this.attachEvent("onItemClick", (id, e, node) => {
            const target = e.target || e.srcElement;
            if (target.classList.contains("wxi-calendar")) {

                this._showCalendar();
            }
        });

        if (config.value) {
            webix.delay(() => this.setValue(config.value));
        }
    },

    _showCalendar: function () {
        const self = this;
        const input = self.getInputNode();
        const currentValue = self.getValue();

        if (self._popup && self._popup.isVisible()) {
            self._popup.hide();
            return;
        }

        // Nếu popup chưa có, tạo mới
        if (!self._popup) {
            self._popup = webix.ui({
                view: "popup",
                width: 260,
                body: {
                    view: "calendar",
                    timepicker: false,
                    on: {
                        onChange: (date) => {
                            self.setValue(date[0]);
                            self._popup.hide();
                        }
                    }
                }
            });
        }

        const cal = self._popup.getBody();
        if (currentValue) {
            const parts = currentValue.split("-");
            if (parts.length === 3) {
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                cal.setValue(d);
            }
        }

        // Hiển thị popup ngay cạnh input
        self._popup.show(input);
    },

    _formatInput: function () {
        const input = this.getInputNode();
        const val = input ? input.value : (this.config.value || '');
        const raw = val.replace(/[^\d]/g, ""); // chỉ lấy số

        let formatted = "";
        if (raw.length > 0) formatted = raw.slice(0, 2);
        if (raw.length >= 3) formatted += "/" + raw.slice(2, 4);
        if (raw.length >= 5) formatted += "/" + raw.slice(4, 8);
        this.getInputNode().value = formatted;
    },

    setValue: function (value) {
        if (!value) {
            this.getInputNode().value = "";
            return;
        }
        let date;
        if (typeof value === "string") {
            if (value.includes("T")) value = value.split("T")[0];
            if (value.includes(" ")) value = value.split(" ")[0];
            const parts = value.split("-");
            if (parts.length === 3) {
                date = new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                date = new Date(value);
            }
        } else if (value instanceof Date) {
            date = value;
        }

        if (isNaN(date)) {
            this.getInputNode().value = "";
            return;
        }

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        this.getInputNode().value = `${dd}/${mm}/${yyyy}`;
        this.config.value = `${yyyy}-${mm}-${dd}`;
    },

    getValue: function () {
        const input = this.getInputNode();
        if (!input) return this.config.value || '';

        const today = new Date();
        const month = (today.getMonth() + 1).toString();
        const year = today.getFullYear().toString();

        const val = input.value;
        const parts = val.split("/");
        const dd = parts[0];
        const mm = parts[1] || month;
        const yyyy = this._normalizeYear(parts[2] || '');
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    },

    _normalizeYear: function (inputYear) {
        const nowYear = new Date().getFullYear();
        const str = inputYear.toString().replace(/\D/g, "");
        if (str.length === 4) return parseInt(str);
        const currentPrefix = nowYear.toString().slice(0, 4 - str.length);
        return parseInt(currentPrefix + str);
    }
}, webix.ui.text);
