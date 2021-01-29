const SectionBlock = Vue.component("SectionBlock", {
    props: {
        color: {
            default: "grey darken-4"
        },
        marginBottom: {
            default: 1
        },
        height: {
            default: undefined
        }
    },
    template: `
        <v-card flat :color="color" class="pa-3" :class="cls" :height="height">
            <slot></slot>
        </v-card>
    `,
    computed: {
        cls() {
            return "mb-" + String(this.marginBottom);
        }
    }
});