webix.protoUI({
    name: "gridsearch",
    defaults: {
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
            }
        };
    }
}, webix.ui.search);
