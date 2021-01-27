const SectionBlock = Vue.component("SectionBlock", {
    props: {
        color: {
            default: "grey darken-4"
        },
        marginBottom: {
            default: 1
        }
    },
    template: `
        <v-card flat :color="color" class="pa-3" :class="cls">
            <slot></slot>
        </v-card>
    `,
    computed: {
        cls() {
            return "mb-" + String(this.marginBottom);
        }
    }
});