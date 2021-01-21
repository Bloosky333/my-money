const SectionBlock = Vue.component("SectionBlock", {
    props: [],
    template: `
        <v-card flat color="grey darken-4" class="mb-1 pa-2">
            <slot></slot>
        </v-card>
    `,
});