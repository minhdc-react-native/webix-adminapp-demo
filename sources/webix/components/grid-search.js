webix.protoUI({
    name: "gridsearch",
    defaults: {
        icon: 'wxi-plus',
        css: "webix_el_search",
        delay: 300,
        minLength: 2,
        yCount: 10,
        placeholder: "Tìm kiếm..."
    },
    $init: function (config) {
        config.css = (config.css || "") + " webix_el_search";
        const columns = config.columns;
        config.suggest = {
            view: "gridsuggest",
            body: {
                select: true,
                header: true,
                borderless: true,
                scroll: true,
                autoheight: false,
                autofocus: true,
                autoConfig: !columns,
                yCount: config.yCount || this.defaults.yCount,
                columns
            }
        };
        config.on = {
            onBeforeShow: function () {
                const list = this.getList ? this.getList() : this;
                if (!list.count()) return false;
            },
            onKeyPress: function (code, e) {
                const self = this;
                const suggest = webix.$$(self.config.suggest);
                const grid = suggest.getList();
                if (self._typingTimer) clearTimeout(self._typingTimer);
                self._typingTimer = setTimeout(() => {
                    const text = self.getValue().trim();
                    if (text.length >= (config.minLength || self.defaults.minLength) && config.url) {
                        apiClient.get(config.url.link, {
                            params: { [config.url.filterKey]: text }, showLoading: false,
                            onSuccess: (data) => {
                                grid.clearAll();
                                if (data.length > 0) {
                                    suggest.show(self.$view);
                                    grid.parse(data);
                                } else {
                                    suggest.hide();
                                }
                            },
                            onError: (err) => { }
                        });
                    } else {
                        suggest.hide();
                    }
                }, config.delay || self.defaults.delay);
            },
            onSearchIconClick: function (e) {
                console.log('search value>>', this.getValue());
            }
        };
        this.attachEvent("onAfterRender", this._addIcon.bind(this));
    },
    _addIcon: function () {
        const input = this.getInputNode() || this.$view.querySelector("input");
        if (!input || !this.config.iconShow) return;

        if (this.$view.querySelector(".webix_input_icon custom")) return;
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
    }
}, webix.ui.search);
