webix.protoUI({
    name: "textinput",
    $cssName: "text",
    defaults: {
        iconAlign: "left",
        textCase: "none", // none | uppercase | lowercase | capitalize
    },

    $init: function () {
        this.attachEvent("onAfterRender", this._addIcon.bind(this));
    },

    _addIcon: function () {
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (!input || !this.config.iconShow) return;
        const isLeftIcon = (this.config.iconAlign || this.defaults.iconAlign) === "left";

        if (this.$view.querySelector(".webix_input_icon")) return;
        isLeftIcon ? input.style.paddingLeft = "30px" : input.style.paddingRight = "30px";
        const wrapper = input.parentNode;
        wrapper.style.position = "relative";

        const btn = document.createElement("span");
        btn.className = "webix_input_icon " + this.config.iconShow;
        btn.style.position = "absolute";
        isLeftIcon ? btn.style.left = `${input.offsetLeft + 4}px` : btn.style.right = "4px";
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        if (this.config.iconColor) btn.style.color = this.config.iconColor;
        wrapper.appendChild(btn);
        this._icon = btn;
        // textCase
        input.style.textTransform = this.config.textCase;
    },

    getValue: function () {
        const input = this.getInputNode();
        return input ? input.value : "";
    },

    setValue: function (value) {
        const input = this.getInputNode();
        if (input) input.value = value || "";
    },

    focus: function () {
        const input = this.getInputNode();
        if (input) input.focus();
    }
}, webix.ui.text);
