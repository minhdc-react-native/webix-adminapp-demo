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
        align: "right"
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

        if (initialValue != null && initialValue !== "")
            this._autoNumericInstance.set(initialValue);
        this._registerHotkey("F9");
    },

    _registerHotkey: function (key) {
        const input = this.getInputNode();
        const inputNumber = this.$view.querySelector(".password-toggle");
        if (!input) return;

        if (this._hotkeyHandler) {
            webix.eventRemove(this._hotkeyHandler);
        }

        this._hotkeyHandler = webix.event(input, "keydown", (e) => {

            if (e.key.toUpperCase() === key.toUpperCase()) {
                e.preventDefault();
                e.stopPropagation();
                this._onHotkeyPress();
            }
        });
    },

    _onHotkeyPress: function () {
        const self = this;
        const currentValue = this.getValue() || 0;

        if (this._calcWin && this._calcWin.isVisible()) return;

        // Nếu đã có rồi thì update và show lại
        if (this._calcWin) {
            webix.$$(this._calcWinId).setValue(currentValue);
            this._calcWin.show();
            attachKeyboard();
            return;
        }
        this._calcWinId = webix.uid();
        this._calcWin = webix.ui({
            view: "window",
            modal: true,
            position: "center",
            css: {
                "border-radius": "12px"
            },
            move: true,
            head: {
                marginTop: 10,
                view: "text", id: this._calcWinId, readonly: true,
                css: "calc-input", height: 60, value: currentValue
            },
            width: 300,
            body: {
                padding: 20,
                rows: [
                    // {
                    //     view: "text", id: this._calcWinId, readonly: true,
                    //     css: "calc-input", height: 60, value: currentValue
                    // },
                    {
                        rows: [
                            { cols: ["7", "8", "9", "/"].map(makeBtn) },
                            { cols: ["4", "5", "6", "*"].map(makeBtn) },
                            { cols: ["1", "2", "3", "-"].map(makeBtn) },
                            { cols: ["0", "000", ".", "+"].map(makeBtn) },
                            {
                                height: 35,
                                cols: [
                                    { view: "button", label: "CE", css: "webix_danger", click: () => setInput("") },
                                    { view: "button", label: "⌫", click: () => backspace() },
                                    { view: "button", label: "OK", css: "webix_primary", click: () => confirmCalc() },
                                ]
                            }
                        ]
                    }
                ]
            },
            on: {
                onHide: detachKeyboard,
                onDestruct: detachKeyboard
            }
        });

        function makeBtn(label) {
            return {
                view: "button",
                label, value: label,
                click: () => append(label)
            };
        }

        function append(v) {
            const input = webix.$$(self._calcWinId);
            input.setValue(input.getValue() + v);
        }

        function setInput(v) {
            webix.$$(self._calcWinId).setValue(v);
        }

        function backspace() {
            const input = webix.$$(self._calcWinId);
            const v = input.getValue();
            input.setValue(v.slice(0, -1));
        }

        function evalSafe(expr) {
            try {
                const res = eval(expr.replace(/,/g, '.'));
                return isNaN(res) ? 0 : res;
            } catch (e) {
                return 0;
            }
        }

        function confirmCalc() {
            const result = evalSafe(webix.$$(self._calcWinId).getValue());
            self.setValue(result);
            self._calcWin.hide();
        }
        function attachKeyboard() {
            detachKeyboard();
            self._calcKeyHandler = webix.event(document, "keydown", function (e) {
                const key = e.key;
                const allowed = /[0-9+\-*/.]/.test(key);
                if (allowed) {
                    append(key);
                    e.preventDefault();
                } else if (key === "Backspace") {
                    backspace(); e.preventDefault();
                } else if (key === "Delete") {
                    setInput(""); e.preventDefault();
                } else if (key === "Enter") {
                    confirmCalc(); e.preventDefault();
                } else if (key === "Escape") {
                    self._calcWin.hide(); e.preventDefault();
                }
            });
        }

        function detachKeyboard() {
            if (self._calcKeyHandler) {
                webix.eventRemove(self._calcKeyHandler);
                self._calcKeyHandler = null;
            }
        }

        this._calcWin.show();
        attachKeyboard();
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
