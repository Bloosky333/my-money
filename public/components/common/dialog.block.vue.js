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
				<v-card-title>
					<v-container class="d-flex justify-space-between pa-0">
						<v-btn text @click="close" class="ml-n4">
							<v-icon left>mdi-chevron-left</v-icon> {{ backOnly ? 'Back' : 'Cancel' }}
						</v-btn>
						<v-btn text color="orange darken-2" @click="save" v-if="!backOnly">
							<v-icon left>mdi-check</v-icon> Save
						</v-btn>
						<slot name="action"></slot>
					</v-container>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text class="pt-6 pb-12 font-weight-light">
					<v-container class="pa-0">
						<slot></slot>
					</v-container>
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