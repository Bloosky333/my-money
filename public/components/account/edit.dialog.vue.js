const EditAccountDialog = Vue.component("EditAccountDialog", {
	mixins: [AccountModelMixin],
	props: ["show", "account"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card>
				<v-card-title class="d-flex justify-space-between">
					<v-btn text @click="close">
						<v-icon left>mdi-chevron-left</v-icon> Cancel
					</v-btn>
					<v-btn color="orange" @click="save">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
				</v-card-title>
				<v-card-text class="pt-8 font-weight-light">
					<v-text-field
						label="Name"
						v-model="account.name"
					></v-text-field>
					
					<v-text-field
						label="Number"
						v-model="account.number"
					></v-text-field>
				</v-card-text>
			</v-card>
		</v-dialog>
    `,
	data() {
		return {
		}
	},
	computed: {

	},
	methods: {
		save() {
			const id = this.account.id;
			if(id) {
				this.updateAccount(id, this.account)
			} else {
				this.createAccount(this.account)
			}
			this.close();
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});