const ConfirmDialog = Vue.component("ConfirmDialog", {
	props: ["show"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			width="200px"
		>
			<v-card>
				<v-card-title class="justify-center">
					Are you sure ?
				</v-card-title>
				<v-card-actions class="d-flex justify-space-between">
					<v-btn
						color="red"
						text
						@click="close"
					><v-icon small left>mdi-close</v-icon> No</v-btn>
					<v-btn
						color="green darken-2"
						text
						@click="confirm"
					><v-icon small left>mdi-check</v-icon> Yes</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
    `,
	methods: {
		confirm() {
			this.$emit("confirm");
			this.close();
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});