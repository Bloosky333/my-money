const GlobalToast = Vue.component("GlobalToast", {
    template: `
        <v-expand-transition>
            <div v-show="visible" class="app-toast" :class="color">   
                <v-icon dark>{{ icon }}</v-icon>
            </v-snackbar>
        </div>
    `,
    data() {
        return {
            default: {
                timeout: 2000,
                color: "success",
                icon: "mdi-check"
            },
            message: "",
            timeout: -1,
            visible: false,
            color: "success",
            icon: "mdi-check",
        }
    },
    methods: {
        show(message, type, timeout) {
            this.message = message;
            this.timeout = timeout || this.default.timeout;

            switch (type) {
                case "warning":
                    this.color = "warning";
                    this.icon = "mdi-alert";
                    break;
                case "error":
                    this.color = "error";
                    this.icon = "mdi-alert";
                    break;
                default:
                    this.color = this.default.color;
                    this.icon = this.default.icon;
            }

            this.visible = true;

            setTimeout(this.hide, this.timeout);
        },
        hide() {
            this.visible = false;
        }
    }
});