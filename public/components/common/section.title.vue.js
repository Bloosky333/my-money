const SectionTitle = Vue.component("SectionTitle", {
    props: ["btnLabel", "btnIcon", "switchModel", "switchLabel", "expandable", "expanded", "noMarginBottom"],
    template: `
        <div 
            class="section-title grey--text d-flex mt-5 align-center" 
            @click="toggle"
            :class="noMarginBottom ? '' : 'mb-2'"
        >
            <slot></slot>
            <v-spacer></v-spacer>
            <slot name="action">
                <v-btn
                    v-if="expandable"
                    small
                    icon
                >
                    <v-icon small>{{ toggleIcon }}</v-icon>
                </v-btn>
                <v-btn
                    v-if="btnLabel"
                    @click.stop="runAction"
                    x-small
                    outlined
                    rounded
                    color="orange darken-2"
                >
                    <v-icon small left>{{ btnIcon }}</v-icon> {{ btnLabel }}
                </v-btn>
                <v-switch
                    v-if="switchLabel"
                    :label="switchLabel"
                    v-model="switchModel"
                    class="mt-n1"
                    color="orange darken-2"
                    @change.stop="updateSwitch"
                    hide-details
                    dense
                    inset
                ></v-switch>
            </slot>
        </div>
    `,
    computed: {
        toggleIcon() {
            return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down';
        },
    },
    methods: {
        updateSwitch() {
            this.$emit("update:switch-model", this.switchModel)
        },
        runAction() {
            this.$emit("action");
        },
        toggle() {
            if(this.expandable) {
                this.$emit("update:expanded", !this.expanded)
            }
        }
    }
});