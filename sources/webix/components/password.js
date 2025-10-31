// sources/views/custom/password.js
webix.protoUI({
    name: "password",
    $cssName: "text",
    defaults: {
        type: "password",
        iconShow: "wxi-eye",
        iconHide: "wxi-eye-slash",
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

        const wrapper = input.parentNode;
        wrapper.style.position = "relative";

        const btn = document.createElement("span");
        btn.className = "password-toggle webix_icon_btn " + this.config.iconShow;
        btn.style.position = "absolute";
        btn.style.right = "8px";
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        btn.style.cursor = "pointer";
        btn.onclick = () => this.togglePassword();
        wrapper.appendChild(btn);
        this._icon = btn;
    },

    togglePassword: function () {
        this._visible = !this._visible;
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (input) {
            input.type = this._visible ? "text" : "password";
            if (this._icon) {
                this._icon.className = `password-toggle webix_icon_btn ${this._visible ? this.config.iconHide : this.config.iconShow
                    }`;
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
