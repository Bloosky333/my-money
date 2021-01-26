const SectionBlock = Vue.component("SectionBlock", {
    props: {
        color: {
            default: "grey darken-4"
        }
    },
    template: `
        <v-card flat :color="color" class="mb-1 pa-3">
            <slot></slot>
        </v-card>
    `,
});