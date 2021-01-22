const DialogBlock = Vue.component("DialogBlock", {
	props: ["show"],
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
						<v-icon left>mdi-chevron-left</v-icon> Cancel
					</v-btn>
					<v-btn color="orange" @click="save">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
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