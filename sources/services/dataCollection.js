import { getService } from "./serviceHelper";

export function DataCollection(app) {
    const service = {
        app: app,
        api: getService("api"),
        dataSource: {},
        getCollection(key) {
            if (!this.dataSource[key]) {
                this.dataSource[key] = new webix.DataCollection({
                    url: null,
                });
            }
            return this.dataSource[key];
        },
        async load(key, url, options = {}) {
            const { params = {}, reload = false } = options;
            const collection = this.getCollection(key);

            if (!reload && collection.count()) {
                return collection;
            }

            const [data, err] = await this.api.get(url, { params });

            if (err) {
                console.error(`❌ Load data failed for "${key}"`, err);
                return collection;
            }

            collection.clearAll();
            collection.parse(data);
            return collection;
        },
        clear(key) {
            const c = this.dataSource[key];
            if (c) c.clearAll();
        },
        clearAll() {
            Object.values(this.dataSource).forEach((c) => c.clearAll());
        },
        dispose(key) {
            const c = this.dataSource[key];
            if (c) {
                if (!c.$destructed) c.destructor();
                delete this.dataSource[key];
            }
        },
        disposeAll() {
            Object.keys(this.dataSource).forEach((key) => {
                const c = this.dataSource[key];
                if (c && !c.$destructed) c.destructor();
                delete this.dataSource[key];
            });
            this.dataSource = {};
        }
    };
    app.setService("dataCollection", service);
}