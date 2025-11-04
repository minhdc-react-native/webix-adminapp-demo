// services/VcMessage.js
let messageContainer = null;

const VcMessage = {
    init() {
        if (!messageContainer) {
            messageContainer = webix.html.create("div", {
                class: "custom-message-container"
            });
            document.body.appendChild(messageContainer);
        }
    },

    show(text, type = "info", duration = 3000) {
        this.init();
        const id = webix.uid();
        const message = webix.html.create("div", {
            class: `custom-message ${type}`,
            id
        });
        message.innerHTML = `
            <div class="custom-message-content">
                <span>${webix.template.escape(text)}</span>
            </div>
        `;
        messageContainer.appendChild(message);

        setTimeout(() => message.classList.add("show"), 10);

        setTimeout(() => this.hide(id), duration);

        return id;
    },

    hide(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove("show");
            el.classList.add("hide");
            setTimeout(() => el.remove(), 300);
        }
    },

    clearAll() {
        if (messageContainer) messageContainer.innerHTML = "";
    },

    success(text, duration) { return this.show(text, "success", duration); },
    error(text, duration) { return this.show(text, "error", duration); },
    warning(text, duration) { return this.show(text, "warning", duration); },
    info(text, duration) { return this.show(text, "info", duration); },
};

export default VcMessage;
