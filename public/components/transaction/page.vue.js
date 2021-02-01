const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
			<div class="d-flex align-center mt-6">
				<v-text-field
					v-model="search"
					placeholder="Search communications ..."
					solo
					hide-details
					single-line
					clearable
					prepend-icon="mdi-magnify"
				></v-text-field>
				<v-menu
					:rounded="8"
					offset-y
				>
					<template v-slot:activator="{ attrs, on }">
						<v-btn
							class="transparent ml-2"
							dark
							v-bind="attrs"
							v-on="on"
							:loading="processing"
							large
							icon
						><v-icon>mdi-dots-vertical</v-icon></v-btn>
					</template>
				
					<v-list dense>
						<v-list-item link @click="processTransactions">
							<v-list-item-icon>
								<v-icon>mdi-auto-fix</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Apply filters</v-list-item-title>
						</v-list-item>
						<v-list-item link @click="refreshDigest">
							<v-list-item-icon>
								<v-icon>mdi-refresh</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Refresh Digest</v-list-item-title>
						</v-list-item>
						<v-list-item link @click="showConfirm=true">
							<v-list-item-icon>
								<v-icon>mdi-delete-empty</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Clear all transactions</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
			
			<v-row v-if="transactions.length && !search">
				<v-col 
					cols="12" md="6" lg="4" 
					v-for="section in sections" 
					class="py-0"
				>
					<transaction-block 
						:section="section"
						:accounts="accounts"
						:categories="categories"
						@edit="edit"
						:expanded="section.expanded"
					></transaction-block>
				</v-col>
			</v-row>
			<transaction-search
				 v-if="search"
				:search="search"
				:accounts="accounts"
				:categories="categories"
				:transactions="transactions"
				@edit="edit"
			></transaction-search>
			
			<div v-if="!transactions.length" class="text-center py-4">
                <v-progress-linear indeterminate color="orange darken-2"></v-progress-linear>
            </div>
            
            <confirm-dialog 
				:show.sync="showConfirm" 
				@confirm="clearTransactions"
			></confirm-dialog>
        </div>
    `,
	data() {
		return {
			changed: 0,
			processing: false,
			showConfirm: false,
			search: "",
		}
	},
	computed: {
		sections() {
			const sections = [];

			const uncategorized = {
				name: "Uncategorized",
				transactions: [],
			};
			const undated = {
				name: "Undated",
				transactions: [],
			};

			let section = {
				name: "",
			};
			let subSection = {
				name: "",
			};
			this.transactions.forEach(transaction => {
				if (transaction.categoryID) {
					const date = dateToMoment(transaction.date);

					if (date) {
						if(section.name !== date.year()) {
							section = {
								name: date.year(),
								subSections: [],
							}
							sections.push(section);
						}

						const name = date.format("MMMM");
						if (subSection.name !== name) {
							subSection = {
								name: name,
								transactions: [],
							};
							section.subSections.push(subSection);
						}
						subSection.transactions.push(transaction);
					} else {
						undated.transactions.push(transaction);
					}
				} else {
					uncategorized.transactions.push(transaction);
				}
			});

			section = {
				name: "Missing information",
				subSections: [],
				expanded: true,
			};
			if(undated.transactions.length || uncategorized.transactions.length) {
				if(undated.transactions.length) {
					section.subSections.push(undated);
				}
				if(uncategorized.transactions.length) {
					section.subSections.push(uncategorized);
				}
				sections.unshift(section);
			}

			sections.forEach(this.sumSection);
			return sections;
		},
	},
	methods: {
		sumSection(section) {
			section.income = 0;
			section.expense = 0;
			section.count = 0;
			section.subSections.forEach(ss => {
				ss.income = 0;
				ss.expense = 0;
				ss.transactions.forEach(t => {
					if (t.amount > 0) {
						ss.income += t.amount;
					} else {
						ss.expense += t.amount;
					}
				});
				ss.total = ss.income + ss.expense;
				ss.count = ss.transactions.length;

				section.count += ss.count;
				section.income += ss.income;
				section.expense += ss.expense;
			});
			section.total = section.income + section.expense;
		},
		async processTransactions() {
			this.processing = true;
			this.changes = 0;
			let changed, transaction;
			for(let i = 0; i<this.transactions.length; i++) {
				transaction = this.transactions[i];
				changed = this.autoFillTransaction(transaction);
				if (changed) {
					this.saveTransaction(transaction);
					this.changes++;
				}
			}
			if (this.changes > 0) {
				this.$emit('refresh');
			}
			await this.delay(1000);
			this.processing = false;
		},
		async clearTransactions() {
			this.processing = true;
			const ids = this.transactions.map(t => t.id);
			for(let i = 0; i<ids.length; i++) {
				await this.deleteTransaction(ids[i]);
			}

			this.$emit("refresh");
			this.processing = false;
		},

		async refreshDigest() {
			this.processing = true;
			this.$emit("refresh");
			await this.delay(1000);
			this.processing = false;
		},
		edit(transaction) {
			this.$emit("edit", "transaction", transaction);
		},
	}
});