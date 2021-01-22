const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
        	<template v-for="section in sections" v-if="section.transactions.length">
        		<section-title
        			:btn-icon="toggleIcon(section.name)"
        			@action="toggle(section.name)"
        		>{{ section.name }}</section-title>
        		<v-expand-transition>
        			<div>
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
			expanded: {}
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
				expanded: false,
			};

			let section = {
				name: "",
			};
			ordered.forEach(transaction => {
				if(transaction.categoryID) {
					const date = dateToMoment(transaction.date);
					const name = date.format("YYYY MMMM")

					if(name !== section.name){
						section = {
							name: name,
							transactions: [],
							expanded: false,
						}
						sections.push(section);
					}
					section.transactions.push(transaction);
				} else {
					uncategorized.transactions.push(transaction);
				}
			});

			sections.unshift(uncategorized);
			return sections;
		},
	},
	methods: {
		editTransaction(transaction) {
			this.showEdit = true;
			this.selected = transaction;
		},
		toggleIcon(name) {
			return this.expanded[name] ? 'mdi-chevron-up' : 'mdi-chevron-down';
		},
		toggle(name) {
			this.expanded[name] = !this.expanded[name];
		}
	}
});