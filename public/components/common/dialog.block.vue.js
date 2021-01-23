const DialogBlock = Vue.component("DialogBlock", {
	props: ["show", "backOnly"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			fullscreen
			hide-overlay
			scrollable
			transition="dialog-bottom-transition"
		>
			<v-card>
				<v-card-title class="d-flex justify-space-between">
					<v-btn text @click="close" class="ml-n4">
						<v-icon left>mdi-chevron-left</v-icon> {{ backOnly ? 'Back' : 'Cancel' }}
					</v-btn>
					<v-btn text color="orange darken-2" @click="save" v-if="!backOnly">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
					<slot name="action"></slot>
				</v-card-title>
				<v-card-text class="pt-2 pb-12 font-weight-light">
					<slot></slot>
				</v-card-text>
			</v-card>
		</v-dialog>
    `,
	methods: {
		save() {
			this.$emit("save", false);
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});