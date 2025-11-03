// sources/views/custom/password.js
webix.protoUI({
    name: "password",
    $cssName: "text",
    defaults: {
        type: "password",
        // iconShow: "wxi-eye",
        placeholder: "Nhập mật khẩu..."
    },

    $init: function () {
        this.$view.classList.add("webix_password");
        this._visible = false;
        this.attachEvent("onAfterRender", this._addToggleButton.bind(this));
    },

    _addToggleButton: function () {
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (!input) return;
        if (this.$view.querySelector(".password-toggle")) return;
        input.style.paddingRight = "30px";
        const wrapper = input.parentNode;
        wrapper.style.position = "relative";
        const btn = document.createElement("span");
        btn.className = "password-toggle webix_input_icon wxi-eye";
        btn.style.position = "absolute";
        btn.style.right = "4px";
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        btn.style.cursor = "pointer";
        btn.onclick = () => this.togglePassword();
        wrapper.appendChild(btn);
        this._icon = btn;
        // add icon left
        if (this.config.iconShow) {
            if (this.$view.querySelector(".webix_input_icon_show")) return;
            input.style.paddingLeft = "30px";
            const btnShow = document.createElement("span");
            btnShow.className = "webix_input_icon_show webix_input_icon " + this.config.iconShow;
            btnShow.style.position = "absolute";
            btnShow.style.left = `${input.offsetLeft + 4}px`;
            btnShow.style.top = "50%";
            btnShow.style.transform = "translateY(-50%)";
            if (this.config.iconColor) btnShow.style.color = this.config.iconColor;
            wrapper.appendChild(btnShow);
        }
    },

    togglePassword: function () {
        this._visible = !this._visible;
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (input) {
            input.type = this._visible ? "text" : "password";
            if (this._icon) {
                this._icon.className = `password-toggle webix_input_icon ${this._visible ? 'wxi-eye-slash' : 'wxi-eye'
                    }`;
                this._icon.style.color = this._visible ? "red" : "#4B5563";
            }
        }
    },

    getValue: function () {
        const input = this.getInputNode() || this.$view.querySelector("input");
        return input ? input.value : "";
    },

    setValue: function (value) {
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (input) input.value = value || "";
    },

    focus: function () {
        const input = this.getInputNode() || this.$view.querySelector("input");
        input.focus();
    }
}, webix.ui.text);
