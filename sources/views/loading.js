import { JetView } from "webix-jet";

export default class LoadingView extends JetView {
    config() {
        return {
            view: "window",
            id: "globalLoading",
            position: "center",
            modal: true,
            move: false,
            resize: false,
            head: false,
            css: { 'border-radius': '10%' },
            body: {
                css: "loading-overlay",
                template: (`
                    <div style="display: flex;height:100%;justify-content: center;align-items: center;">
                        <div>
                            <div class="loading-spinner"></div>
                            <div class="loading-text">...</div>
                        </div>
                    </div>  
				`)
            }
        };
    }

    showLoading(text = "...") {
        const win = this.getRoot();
        win.getBody().setHTML(`
            <div style="display: flex;height:100%;justify-content: center;align-items: center;">
                <div>
                    <div class="loading-spinner"></div>
                    <div class="loading-text">${text}</div>
                </div>
            </div>    
		`);
        win.show();
    }

    hideLoading() {
        this.getRoot().hide();
    }
}
