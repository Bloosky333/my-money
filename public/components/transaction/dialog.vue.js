const TransactionDialog = Vue.component("TransactionDialog", {
	mixins: [TransactionModelMixin],
	props: ["show", "transaction", "accounts", "categories", "filters"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<v-row>
				<v-col cols="12" sm="6" class="py-0">
					<v-row>	
						<v-col cols="12" lg="6" class="py-0">
							<section-block class="px-4">
								<div class="d-flex align-center">
									<v-autocomplete
										label="Category"
										v-model="transaction.categoryID"
										:items="categories"
										item-text="name"
										item-value="id"
										:prepend-icon="categoryIcon"
										:success="category && !category.isExpense"
										:error="category && category.isExpense"
									>
										<template v-slot:item="{ item }">
											<category-title :category="item"></category-title>
										</template>
									</v-autocomplete>
									<v-btn
										icon
										@click="edit('category', {})"
										class="ml-3"
									><v-icon>mdi-plus</v-icon></v-btn>
								</div>
								
								<div v-if="transaction.accountID || !transaction.account" class="d-flex align-center">
									<v-autocomplete
										label="Account"
										v-model="transaction.accountID"
										:items="accounts"
										item-text="name"
										item-value="id"
										:readonly="transaction.imported"
										prepend-icon="mdi-bank"
										:hint="transaction.account"
										persistent-hint
									></v-autocomplete>
									<v-btn
										icon
										@click="edit('account', {})"
										class="ml-3"
									><v-icon>mdi-plus</v-icon></v-btn>
								</div>
								<v-text-field
									v-else
									label="Account"
									v-model="transaction.account"
									:readonly="transaction.imported"
									prepend-icon="mdi-bank"
								></v-text-field>
							</section-block>
							<section-block class="px-4">
								<v-text-field
									label="Date"
									:value="formattedDate"
									:readonly="transaction.imported"
									prepend-icon="mdi-calendar-outline"
									@change="updateDate"
								></v-text-field>
								<v-text-field
									label="Amount"
									v-model="transaction.amount"
									:readonly="transaction.imported"
									prepend-icon="mdi-currency-eur"
									hide-details
								></v-text-field>
								<div class="my-2 pl-8">
									<div><small v-if="transaction.initialAmount" class="text-caption grey--text">
										Initial amount: {{ transaction.initialAmount | currency }}
									</small></div>
									<small v-if="transaction.beforeSplit" class="text-caption grey--text">
										Before split : {{ transaction.beforeSplit | currency }}
									</small>
								</div>
							</section-block>
						</v-col>
						<v-col cols="12" lg="6" class="py-0">
							<section-block class="px-4">
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
								<v-textarea
									label="Communications"
									v-model="transaction.communications"
									:readonly="transaction.imported"
									auto-grow
									:rows="2"
									prepend-icon="mdi-message-reply-text"
								></v-textarea>
							</section-block>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="12" sm="6" class="py-0">
					<v-row>	
						<v-col cols="12" lg="6" class="py-0">
							<section-block class="px-4">
								<v-text-field
									label="Transaction ID"
									v-model="transaction.transactionID"
									:readonly="transaction.imported"
									prepend-icon="mdi-identifier"
								></v-text-field>
								<v-text-field
									label="Reference"
									v-model="transaction.reference"
									:readonly="transaction.imported"
									prepend-icon="mdi-pound-box"
								></v-text-field>
								
								<v-textarea
									label="Details"
									v-model="transaction.details"
									:readonly="transaction.imported"
									auto-grow
									:rows="2"
									prepend-icon="mdi-text-box-outline"
								></v-textarea>
							</section-block>
						</v-col>
						<v-col cols="12" lg="6" class="py-0">
							<section-block v-if="transaction.id" class="px-4">
								<section-title expandable="true" :expanded.sync="showSplit" margin-top="2">
									<v-icon left>mdi-call-split</v-icon> Split transaction
									
									<template v-slot:action v-if="showSplit">
										<v-btn
											text
											small
											@click.stop="showSplit=false"
										>
											<v-icon left small>mdi-close</v-icon> Cancel
										</v-btn>
									</template>
								</section-title>
								<v-expand-transition>
									<div v-if="showSplit">
										<v-divider></v-divider>
										<v-row>
											<v-col cols="6">
												<v-autocomplete
													label="Category 1"
													v-model="transaction.categoryID"
													:items="categories"
													item-text="name"
													item-value="id"
													prepend-icon="mdi-tag"
												></v-autocomplete>
												
												<v-text-field
													label="Amount 1"
													:value="transaction.amount - split.amount"
													prepend-icon="mdi-currency-eur"
													disabled
												></v-text-field>
											</v-col>
											<v-col cols="6">
												<v-autocomplete
													label="Category 2"
													v-model="split.categoryID"
													:items="categories"
													item-text="name"
													item-value="id"
													prepend-icon="mdi-tag"
												></v-autocomplete>
												<v-text-field
													label="Amount 2"
													v-model="split.amount"
													prepend-icon="mdi-currency-eur"
												></v-text-field>
											</v-col>
										</v-row>
									</div>
								</v-expand-transition>
							</section-block>
							
							<section-block v-if="transaction.id && matchingFilter" class="px-4">
								<section-title margin-top="2">
									<v-icon left>mdi-filter</v-icon> Matching filter
								</section-title>
								<v-divider></v-divider>
								<filter-line
									:filter="matchingFilter"
									:accounts="accounts"
									:categories="categories"
									class="clickable"
									@click.native="edit('filter', matchingFilter)"
								></filter-line>
							</section-block>
							
							<section-block v-else class="px-4">
								<section-title expandable="true" :expanded.sync="showEditFilter" margin-top="2">
									<v-icon left>mdi-filter-plus</v-icon> Create a filter
									
									<template v-slot:action v-if="showEditFilter">
										<v-btn
											text
											small
											@click.stop="showEditFilter=false"
										>
											<v-icon left small>mdi-close</v-icon> Cancel
										</v-btn>
									</template>
								</section-title>
								<v-expand-transition>
									<div v-if="showEditFilter" class="pb-4">
										<v-divider></v-divider>
										<filter-form
											:filter.sync="filter"
											:accounts="accounts"
											:categories="categories"
											class="mt-2"
										></filter-form>
										
										<div v-if="invalidFilter" class="error--text text-center mt-2">
											<v-icon left small color="error">mdi-alert</v-icon> Filter will not apply to this transaction
										</div>
									</div>
								</v-expand-transition>
							</section-block>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			
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
			showSplit: false,
			split: {},
			filter: {},
		}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		},
		showEditFilter(val) {
			if(val) {
				this.newFilter();
			}
		},
		showSplit(val) {
			if(val) {
				this.newSplit();
			}
		}
	},
	computed: {
		category() {
			if(this.transaction.categoryID) {
				return this.getCategoryByID(this.transaction.categoryID);
			} else {
				return false;
			}
		},
		categoryIcon() {
			if(!this.category) {
				return "mdi-tag";
			} else {
				return this.category.isExpense ? "mdi-cash-minus" : "mdi-cash-plus";
			}
		},
		formattedDate() {
			if (this.transaction.date) {
				return dateToMoment(this.transaction.date).format(CONST.userDateFormat);
			} else {
				return "";
			}
		},
		invalidFilter() {
			return !this.filterMatch(this.filter, this.transaction);
		},
		matchingFilter() {
			return this.findMatchFilter(this.transaction);
		},
	},
	methods: {
		updateDate(value) {
			const date = moment(value, CONST.userDateFormat);
			this.transaction.date = date.isValid() ? date.toDate() : "";
		},
		newFilter() {
			this.showEditFilter = true;
			this.filter = {
				categoryID: this.transaction.categoryID || false,
				accountID: this.transaction.accountID || false,
				counterpartAccount: this.transaction.counterpartAccount || "",
				contains: [],
			};
		},
		newSplit() {
			this.split = _.clone(this.transaction);
			delete this.split.id;
			this.split.amount /= 2;
		},
		async saveAndClose() {
			if(this.showSplit) {
				this.split.beforeSplit = this.transaction.amount;
				this.transaction.beforeSplit = this.transaction.amount;
				this.transaction.amount -= this.split.amount;
				await this.saveTransaction(this.split);
			}

			await this.saveTransaction(this.transaction);
			if(this.showEditFilter) {
				this.saveFilter(this.filter);
			}


			this.show = false;
			this.showEditFilter = false;
			this.showSplit = false;
			this.split = {};
			this.$emit('refresh');
		},
		deleteAndClose() {
			this.deleteTransaction(this.transaction.id);
			this.show = false;
		},
		edit(type, filter) {
			this.showEditFilter = false;
			this.$emit("edit", type, filter);
		}
	}
});