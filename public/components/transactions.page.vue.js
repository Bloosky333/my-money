const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
        	<v-btn text block @click="processTransactions">
        		<v-icon left>mdi-auto-fix</v-icon>
        		Process
        		<span v-if="changed"> - Changed : {{ changed }}</span>
			</v-btn>
        	
        	<template v-for="section in sections" v-if="section.transactions.length">
        		<section-title
        			expandable="true"
        			:expanded.sync="expanded[section.name]"
        		>{{ section.name }} ({{ section.transactions.length }})</section-title>
        		<v-expand-transition>
        			<div v-if="expanded[section.name]">
						<transaction-line
							v-for="transaction in section.transactions"
							:transaction="transaction"
							@click.native="editTransaction(transaction)"
							:accounts="accounts"
							:categories="categories"
						></transaction-line>
					</div>
				</v-expand-transition>
        	</template>
        	
        	<transaction-dialog
        		:show.sync="showEdit"
        		:transaction="selected"
        		:accounts="accounts"
        		:categories="categories"
        	></transaction-dialog>
        </div>
    `,
	data() {
		return {
			showEdit: false,
			selected: {},
			expanded: {
				Uncategorized: true
			},
			changed: 0,
		}
	},
	created() {
	},
	computed: {
		sections() {
			const ordered = _.sortBy(this.transactions, t => t.date.valueOf()).reverse();
			const sections = [];
			const uncategorized = {
				name: "Uncategorized",
				transactions: [],
			};

			let section = {
				name: "",
			};
			ordered.forEach(transaction => {
				if(transaction.categoryID) {
					const date = dateToMoment(transaction.date);
					const name = date.format("YYYY MMMM");

					if(name !== section.name){
						section = {
							name: name,
							transactions: [],
						};
						sections.push(section);
					}
					section.transactions.push(transaction);
				} else {
					uncategorized.transactions.push(transaction);
				}
			});

			if(sections.length) {
				this.expanded[sections[0].name] = true;
			}

			sections.unshift(uncategorized);

			return sections;
		},
	},
	methods: {
		processTransactions() {
			this.changed = 0;
			this.transactions.forEach(transaction => {
				const changed = this.autoFillTransaction(transaction);
				if(changed) {
					this.saveTransaction(transaction);
					this.changed ++;
				}
			})
		},
		editTransaction(transaction) {
			this.showEdit = true;
			this.selected = transaction;
		},
	}
});