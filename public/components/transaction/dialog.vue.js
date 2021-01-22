const TransactionDialog = Vue.component("TransactionDialog", {
	mixins: [TransactionModelMixin, FilterModelMixin],
	props: ["show", "transaction", "accounts", "categories"],
	template: `
		<div>
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
					<v-card-text class="pt-2 font-weight-light">
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
								v-model="transaction.account"
								:disabled="transaction.imported"
								prepend-icon="mdi-bank"
								hint="transaction.account"
								persistent-hint
							></v-autocomplete>
							<v-text-field
								v-else
								label="Account"
								v-model="transaction.account"
								:disabled="transaction.imported"
								prepend-icon="mdi-bank"
							></v-text-field>
							
							<v-text-field
								label="Counterpart Account"
								v-model="transaction.counterpart_account"
								:disabled="transaction.imported"
								prepend-icon="mdi-bank-transfer-out"
							></v-text-field>
							<v-text-field
								label="Counterpart Name"
								v-model="transaction.counterpart_name"
								:disabled="transaction.imported"
								prepend-icon="mdi-account-arrow-right"
							></v-text-field>
							<v-text-field
								label="Date"
								v-model="formattedDate"
								:disabled="transaction.imported"
								prepend-icon="mdi-calendar-outline"
							></v-text-field>
							<v-text-field
								label="Amount"
								v-model="transaction.amount"
								:disabled="transaction.imported"
								prepend-icon="mdi-currency-eur"
							></v-text-field>
							
							<v-textarea
								label="Communications"
								v-model="transaction.communications"
								:disabled="transaction.imported"
								auto-grow
								:rows="5"
								prepend-icon="mdi-message-reply-text"
							></v-textarea>
						</section-block>
						
						<v-btn
							text
							block
							@click="createFilter"
							v-if="!showEditFilter"
						>
							<v-icon left small>mdi-filter-plus</v-icon> Create a filter
						</v-btn>
						
						<section-block v-if="showEditFilter" class="pa-4 mb-10 mt-4">
							<div class="d-flex justify-space-between align-center mb-4">
								<h2 class="font-weight-light">New filter</h2>
								<v-btn
									icon small
									@click="showEditFilter=false"
								><v-icon >mdi-close</v-icon></v-btn>
							</div>
							<v-divider></v-divider>
							<filter-form
								:filter.sync="newFilter"
								:accounts="accounts"
								:categories="categories"
							></filter-form>
						</section-block>
					</v-card-text>
				</v-card>
			</v-dialog>
		</div>
    `,
	data() {
		return {
			showEditFilter: false,
			newFilter: {},
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
		}
	},
	methods: {
		save() {
			const id = this.account.id;
			if (id) {
				this.updateAccount(id, this.account)
			} else {
				this.createAccount(this.account)
			}
			this.close();
		},
		createFilter() {
			this.showEditFilter = true;
			this.newFilter = {
				categoryID: this.transaction.categoryID,
				accountID: this.transaction.accountID,
				counterpart_account: this.transaction.counterpart_account,
			};
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});