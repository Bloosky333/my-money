const ConfirmDialog = Vue.component("ConfirmDialog", {
	props: ["show"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			width="180px"
		>
			<v-card>
				<v-card-title>
					Are you sure ?
				</v-card-title>
				<v-card-actions class="text-right">
					<v-btn
						color="red"
						text
						@click="close"
					><v-icon>mdi-close</v-icon> No</v-btn>
					<v-btn
						color="green darken-2"
						text
						@click="confirm"
					><v-icon>mdi-check</v-icon> Yes</v-btn>
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