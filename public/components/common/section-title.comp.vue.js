const SectionTitle = Vue.component("SectionTitle", {
    props: ["btnLabel", "btnIcon", "switchModel", "switchLabel"],
    template: `
        <div class="section-title grey--text d-flex mt-5 mb-2 align-center">
            <slot></slot>
            <v-spacer></v-spacer>
            <slot name="action">
                <v-btn
                    v-if="btnLabel"
                    @click="runAction"
                    x-small
                    outlined
                    rounded
                    color="primary"
                >
                    <v-icon small left>{{ btnIcon }}</v-icon> {{ btnLabel }}
                </v-btn>
                <v-switch
                    v-if="switchLabel"
                    :label="switchLabel"
                    v-model="switchModel"
                    class="mt-n1"
                    color="primary"
                    @change="updateSwitch"
                    hide-details
                    dense
                    inset
                ></v-switch>
            </slot>
        </div>
    `,
    methods: {
        updateSwitch() {
            this.$emit("update:switch-model", this.switchModel)
        },
        runAction() {
            this.$emit("action");
        }
    }
});