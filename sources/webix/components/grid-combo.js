import VcMessage from "../../services/message";

webix.protoUI({
    name: "gridcombo",
    defaults: {
        displayField: 'id',
        css: "webix_el_combo",
        yCount: 10,
        placeholder: "Chọn mục...",
        dataCollection: []
    },

    $init: function (config) {
        config.css = (config.css || "") + " webix_el_combo";
        const columns = config.columns;

        config.suggest = {
            view: "suggest",
            fitMaster: false,
            body: {
                view: "treetable",
                select: "row",
                autowidth: true,
                autoheight: false,
                threeState: false,
                scroll: true,
                navigation: true,
                borderless: true,
                yCount: config.yCount || this.defaults.yCount,
                autoConfig: !columns,
                columns,
            },
            filter: function (item, value) {
                if (!value) return true;
                const normalize = (str) =>
                    str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const search = normalize(value);
                const cols = this.config.body.columns
                    ? this.config.body.columns.map((c) => c.id)
                    : ["value"];
                return cols.some((k) => normalize(item[k] || "").includes(search));
            },
        };

        this.attachEvent("onAfterRender", this._addIcon.bind(this));
        this.attachEvent("onIconClick", this._onIconClick.bind(this));
    },

    _addIcon: function () {
        const self = this;
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (!input || !this.config.iconShow) return;
        this._initData(input.value);
        const iconDown = this.$view.querySelector(".wxi-menu-down");
        if (iconDown) {
            iconDown.className = "webix_input_icon wxi-plus custom-plus";
            iconDown.style.cursor = "pointer";
            iconDown.onclick = (e) => {
                e.stopPropagation();
                self.callEvent("onIconClick", [this, input.value]);
            };
        }

        if (this.$view.querySelector(".webix_input_icon.custom")) return;

        input.style.paddingLeft = "30px";
        const wrapper = input.parentNode;
        wrapper.style.position = "relative";

        const btn = document.createElement("span");
        btn.className = "webix_input_icon custom " + this.config.iconShow;
        btn.style.position = "absolute";
        btn.style.left = `${input.offsetLeft + 4}px`;
        btn.style.top = "50%";
        btn.style.transform = "translateY(-50%)";
        if (this.config.iconColor) btn.style.color = this.config.iconColor;
        wrapper.appendChild(btn);
        this._icon = btn;
    },
    _initData(value) {
        const popup = this.getPopup();
        if (!popup) return;
        const tree = popup.getBody();

        if (this.config.dataCollection) {
            tree.sync(this.config.dataCollection);
        } else {
            tree.clearAll();
            tree.parse(this.config.data || []);
        }

        const displayField = this.config.displayField;
        if (!tree.type || typeof tree.type.template !== "function") {
            tree.type = tree.type || {};
            tree.type.template = function (obj) {
                return obj && (obj[displayField] || "");
            };
        }

        tree.attachEvent("onItemClick", (id) => {
            const item = tree.getItem(id);
            if (!item) return;
            this.setValue(item.id);
            const text = tree.type.template.call(tree.type, item, tree.type);
            const inp = this.getInputNode();
            if (inp) inp.value = text;
            // this.callEvent("onChange", [this.getValue(), this]);
        });
    },
    _onIconClick(view, value) {
        VcMessage.info(value);
    },
}, webix.ui.combo);
