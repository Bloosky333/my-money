const TransactionDialog = Vue.component("TransactionDialog", {
	mixins: [TransactionModelMixin],
	props: ["show", "transaction", "accounts", "categories"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<section-block class="px-4">
				<v-autocomplete
					label="Category"
					v-model="transaction.categoryID"
					:items="categories"
					item-text="name"
					item-value="id"
					prepend-icon="mdi-tag"
				></v-autocomplete>
				
				<v-autocomplete
					v-if="transaction.accountID || !transaction.account"
					label="Account"
					v-model="transaction.accountID"
					:items="accounts"
					item-text="name"
					item-value="id"
					:readonly="transaction.imported"
					prepend-icon="mdi-bank"
					:hint="transaction.account"
					persistent-hint
					class="mb-8"
				></v-autocomplete>
				<v-text-field
					v-else
					label="Account"
					v-model="transaction.account"
					:readonly="transaction.imported"
					prepend-icon="mdi-bank"
				></v-text-field>
				
				<v-text-field
					label="Counterpart Account"
					v-model="transaction.counterpartAccount"
					:readonly="transaction.imported"
					prepend-icon="mdi-bank-transfer-out"
				></v-text-field>
				<v-text-field
					label="Counterpart Name"
					v-model="transaction.counterpartName"
					:readonly="transaction.imported"
					prepend-icon="mdi-account-arrow-right"
				></v-text-field>
				<v-text-field
					label="Date"
					v-model="formattedDate"
					:readonly="transaction.imported"
					prepend-icon="mdi-calendar-outline"
				></v-text-field>
				<v-text-field
					label="Amount"
					v-model="transaction.amount"
					:readonly="transaction.imported"
					prepend-icon="mdi-currency-eur"
				></v-text-field>
				
				<v-textarea
					label="Communications"
					v-model="transaction.communications"
					:readonly="transaction.imported"
					auto-grow
					:rows="2"
					prepend-icon="mdi-message-reply-text"
				></v-textarea>
			</section-block>
			
			<v-btn
				v-if="!showEditFilter"
				text
				block
				@click="newFilter"
				class="mt-4"
			>
				<v-icon left small>mdi-filter-plus</v-icon> Create a filter
			</v-btn>
			
			<v-expand-transition>
				<section-block v-if="showEditFilter" class="pa-4 mt-4">
					<div class="d-flex justify-space-between align-center mb-4">
						<h2 class="font-weight-light">New filter</h2>
						<v-btn
							icon small
							@click="showEditFilter=false"
						><v-icon >mdi-close</v-icon></v-btn>
					</div>
					<v-divider></v-divider>
					<filter-form
						:filter.sync="filter"
						:accounts="accounts"
						:categories="categories"
					></filter-form>
					
					<div v-if="invalidFilter" class="error--text text-center mt-2">
						<v-icon left small color="error">mdi-alert</v-icon> Filter will not apply to this transaction
					</div>
				</section-block>
			</v-expand-transition>
			
			<v-btn 
				color="error"
				small
				text
				block
				:disabled="transaction.imported"
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
			showEditFilter: false,
			filter: {},
		}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		}
	},
	computed: {
		formattedDate: {
			get() {
				if (this.transaction.date) {
					return dateToMoment(this.transaction.date).format(CONST.userDateFormat);
				} else {
					return "";
				}
			},
			set(value) {
				this.transaction.date = value.toDate();
			}
		},
		invalidFilter() {
			return !this.filterMatch(this.filter, this.transaction);
		}
	},
	methods: {
		newFilter() {
			this.showEditFilter = true;
			this.filter = {
				categoryID: this.transaction.categoryID,
				accountID: this.transaction.accountID,
				counterpartAccount: this.transaction.counterpartAccount,
				contains: [],
			};
		},
		saveAndClose() {
			this.saveTransaction(this.transaction);
			if(this.showEditFilter) {
				this.createFilter(this.filter);
			}
			this.show = false;
			this.showEditFilter = false;
		},
		deleteAndClose() {
			this.deleteTransaction(this.transaction.id);
			this.show = false;
		}
	}
});