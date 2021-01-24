const AccountDialog = Vue.component("AccountDialog", {
	mixins: [AccountModelMixin],
	props: ["show", "account"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<section-block class="px-4">
				<v-text-field
					label="Name"
					v-model="account.name"
				></v-text-field>
				
				<v-text-field
					label="Number"
					v-model="account.number"
				></v-text-field>
				
				<v-text-field
					label="Initial balance"
					v-model="account.initialBalance"
					suffix="€"
				></v-text-field>
			</section-block>
			
			<v-btn 
				color="error"
				small
				text
				block
				@click="showConfirm=true"
				class="mt-8 mb-12"
			>
				<v-icon	small left>mdi-delete</v-icon> Delete
			</v-btn> 
			
			
			<confirm-dialog 
				:show.sync="showConfirm" 
				@confirm="deleteAndClose"
			></confirm-dialog>
		</dialog-block>
    `,
	data() {
		return {
			showConfirm: false,
		}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		}
	},
	computed: {

	},
	methods: {
		saveAndClose() {
			this.saveAccount(this.account);
			this.show = false;
		},
		deleteAndClose() {
			this.deleteAccount(this.account.id);
			this.show = false;
		}
	}
});