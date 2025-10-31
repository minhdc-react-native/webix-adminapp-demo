webix.protoUI({
    name: "gridcombo",
    defaults: {
        css: 'webix_el_combo',
        yCount: 10,
        placeholder: "Tìm kiếm..."
    },
    $init: function (config) {
        config.css = (config.css || "") + " webix_el_combo";
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
            },

            filter: function (item, value) {
                if (!value) return true;
                const normalize = (str) =>
                    str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                const search = normalize(value);
                const cols = this.config.body.columns.map(c => c.id);
                return cols.some(k => normalize(item[k] || "").includes(search));
            }
        };
    }
}, webix.ui.combo);
