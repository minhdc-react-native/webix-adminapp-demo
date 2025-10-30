webix.protoUI({
    name: "numeric",
    $cssName: "text",
    defaults: {
        decimalSize: 2,
        thousandSeparator: ",",
        decimalSeparator: ".",
        min: null,
        max: null,
        value: "",
        placeholder: "0",
        align: "right",
    },

    $init: function (config) {
        const self = this;
        self.$view.classList.add("webix_numeric");

        self.attachEvent("onAfterRender", function () {
            webix.delay(() => self._initAutoNumeric(config.value));
        });
    },

    _initAutoNumeric: function (initialValue) {
        const input = this.getInputNode();
        if (!input) return;

        input.style.textAlign = "right";

        // nếu AutoNumeric chưa load, thử lại sau 100ms
        if (typeof window.AutoNumeric === "undefined") {
            setTimeout(() => this._initAutoNumeric(initialValue), 100);
            return;
        }

        // nếu đã có instance, remove để khởi tạo lại (đảm bảo sync)
        if (this._autoNumericInstance) {
            this._autoNumericInstance.remove();
            this._autoNumericInstance = null;
        }

        const opts = {
            decimalPlaces: this.config.decimalSize,
            digitGroupSeparator: this.config.thousandSeparator,
            decimalCharacter: this.config.decimalSeparator,
            minimumValue: this.config.min != null ? this.config.min : "-9999999999999999",
            maximumValue: this.config.max != null ? this.config.max : "9999999999999999",
            modifyValueOnWheel: false,
            unformatOnSubmit: true,
            allowDecimalPadding: true,
        };

        this._autoNumericInstance = new window.AutoNumeric(input, 0, opts);

        // ✅ set giá trị ngay sau khi init
        if (initialValue != null && initialValue !== "")
            this._autoNumericInstance.set(initialValue);
    },

    getValue: function () {
        if (this._autoNumericInstance)
            return this._autoNumericInstance.getNumber();

        const input = this.getInputNode();
        if (!input) return this.config.value || 0;

        const v = input.value;
        return v ? parseFloat(v.replace(/,/g, "")) : 0;
    },

    setValue: function (value) {
        if (this._autoNumericInstance)
            this._autoNumericInstance.set(value || 0);
        else
            this.config.value = value;
    },

    $destroy: function () {
        if (this._autoNumericInstance) {
            this._autoNumericInstance.remove();
            this._autoNumericInstance = null;
        }
    }
}, webix.ui.text);
