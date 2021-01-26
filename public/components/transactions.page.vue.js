const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
			<div class="d-flex align-center">
				<v-text-field
					v-model="search"
					placeholder="Search communications ..."
					solo
					hide-details
					single-line
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
			
			<template v-if="transactions.length && !search">
				<transaction-block 
					v-for="(section, i) in sections" 
					:section="section"
					:accounts="accounts"
					:categories="categories"
					@edit="edit"
					:expanded="i === 0"
				></transaction-block>
			</template>
			
			<template v-if="search">
				<section-title>{{ searchResults.length }} Results</section-title>
				<section-block v-for="line in searchResults" class="py-1" @click.native="edit(line)">
					<v-row dense>
						<v-col cols="8">
							<small class="font-weight-light" v-html="$options.filters.highlight(line.communications, search)"></small>
						</v-col>
						<v-col cols="4" class="text-right">
							<div :class="line.amount > 0 ? 'success--text' : 'error--text'">{{ line.amount }} €</div>
							<div>{{ line.date | dateToStr(true) }}</div>
						</v-col>
					</v-row>
				</section-block>
			</template>
			
			
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
			this.transactions.forEach(transaction => {
				if (transaction.categoryID) {
					const date = dateToMoment(transaction.date);

					if (date) {
						const name = date.format("YYYY MMMM");

						if (name !== section.name) {
							section = {
								name: name,
								transactions: [],
							};
							sections.push(section);
						}
						section.transactions.push(transaction);
					} else {
						undated.transactions.push(transaction);
					}
				} else {
					uncategorized.transactions.push(transaction);
				}
			});

			sections.unshift(undated);
			sections.unshift(uncategorized);

			sections.forEach(this.sumSection);
			return sections.filter(section => section.transactions.length > 0);
		},
		searchResults() {
			const query = this.search.toLowerCase();
			return this.transactions.filter(t => t.communications && t.communications.toLowerCase().includes(query));
		},
	},
	methods: {
		sumSection(section) {
			section.income = 0;
			section.expense = 0;
			section.transactions.forEach(t => {
				if (t.amount > 0) {
					section.income += t.amount;
				} else {
					section.expense += t.amount;
				}
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
			let transaction;
			for(let i = 0; i<this.transactions.length; i++) {
				transaction = this.transactions[i];
				this.deleteTransaction(transaction.id);
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