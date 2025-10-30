import { JetView } from "webix-jet";

export default class AppListView extends JetView {
    config() {
        return {
            rows: [
                { template: "Danh sách ứng dụng", type: "header" },
                {
                    view: "list",
                    id: "appList",
                    template: "#name#",
                    select: true,
                    data: [
                        { id: "1", name: "Quản lý kho" },
                        { id: "2", name: "Kế toán" },
                        { id: "3", name: "Nhân sự" }
                    ],
                    on: {
                        onItemClick: (id) => {
                            const item = this.$$("appList").getItem(id);
                            this.app.show(`/main?id=${item.id}`);
                        }
                    }
                }
            ]
        };
    }
}
