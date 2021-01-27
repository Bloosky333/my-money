const SectionTitle = Vue.component("SectionTitle", {
    props: ["btnLabel", "btnIcon", "switchModel", "switchLabel", "expandable", "expanded", "marginBottom", "marginTop"],
    template: `
        <div 
            class="section-title grey--text d-flex align-center" 
            @click="toggle"
            :class="cls"
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
                    @click="runAction"
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
                    @change="updateSwitch"
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
        cls() {
            let cls = [];
            let margin = this.marginTop === undefined ? "6" : this.marginTop;
            cls.push("mt-" + margin);

            margin = this.marginBottom === undefined ? "2" : this.marginBottom;
            cls.push("mb-" + margin);

            if(this.expandable)  cls.push("clickable");
            return cls.join(' ');
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