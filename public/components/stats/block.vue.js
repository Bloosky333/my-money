const StatsBlock = Vue.component("StatsBlock", {
	mixins: [StatsMixin],
	props: ["params", "digest", "search", "categories", "accounts"],
	template: `
		<div>
			<section-title>
				{{ params.title }}
				<template v-slot:action>
					<v-btn-toggle 
						v-model="chartType" 
						rounded
						borderless 
						mandatory
						color="orange darken-2"
					>
						<v-btn 
							v-for="type in chartTypes"
							small
							:value="type"
						><v-icon small>{{ CONST.chartIcon[type] }}</v-icon></v-btn> 
					</v-btn-toggle>
				</template>
			</section-title>
		
			<section-block class="pt-5">
				<stats-chart 
					v-if="chartType"
					:type="chartType" 
					:data="data"
				></stats-chart>
				
				<div class="d-flex align-center justify-space-between text-overline mt-2 grey--text clickable" @click="toggle">
					<div v-if="expanded">Hide details</div>
					<div v-else>Show details</div>
					<v-icon small>{{ toggleIcon }}</v-icon>
				</div>
				<div v-if="expanded" class="mt-2">
					<v-expand-transition>
						<stats-table :data="data"></stats-table>
					</v-expand-transition>
				</div>
			</section-block>
		</div>
    `,
	data() {
		return {
			expanded: false,
			chartType: false,
		}
	},
	computed: {
		chartTypes() {
			return this.params.chartTypes.split(',');
		},
		toggleIcon() {
			return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down';
		},
		data() {
			const functionName = _.camelCase("get data by " + this.params.stat);
			return this[functionName]();
		},
	},
	methods: {
		// PERIOD
		getDataByPeriod() {
			switch (this.chartType) {
				case "combo":
					const accountsByPeriod = this.getAccountsByPeriod();
					const uniqueAccounts = this._flattenList(accountsByPeriod);

					const headers = ["Period"];
					uniqueAccounts.forEach(accountID => {
						const accountName = this._getAccountName(accountID);
						headers.push(accountName + "/IN", accountName + "/OUT")
					});
					headers.push("Total");

					const lines = [];
					_.forEach(accountsByPeriod, (accounts, year) => {
						const line = [year];
						let total = 0;
						uniqueAccounts.forEach(accountID => {
							const account = accounts[accountID];
							if (account) {
								line.push(this._round(account.income), this._round(account.expense));
								total += account.total;
							} else {
								line.push(0, 0);
							}
						});
						line.push(this._round(total));
						lines.push(line);
					});

					return [headers, ...lines];
				case "column":
					const periodsByAccount = this.getPeriodsByAccount()
					const data = [];
					const periodNames = this._flattenList(periodsByAccount);
					data.push(["Accounts", ...periodNames]);

					_.forEach(periodsByAccount, (years, accountID) => {
						const name = this._getAccountName(accountID);
						const line = this._getLine(name, periodNames, years, "total");
						data.push(line);
					});

					return data;
			}
		},

		// CATEGORY
		getDataByCategory() {
			const data = [];
			let categoriesByPeriod, periodsByCategory;

			switch (this.chartType) {
				case "pie":
					categoriesByPeriod = this.getCategoriesByPeriod();
					data.push(["Category", "Total"]);
					const categoryTotals = this._getTotals(categoriesByPeriod);
					_.forEach(categoryTotals, (total, categoryID) => {
						const name = this._getCategoryName(categoryID);
						data.push([name, this._round(total)]);
					});

					break;
				case "line":
					categoriesByPeriod = this.getCategoriesByPeriod();
					const uniqueCategories = this._flattenList(categoriesByPeriod);
					const categoryNames = uniqueCategories.map(id => this._getCategoryName(id));

					data.push(["Period", ...categoryNames]);
					_.forEach(categoriesByPeriod, (categories, year) => {
						const line = this._getLine(year, uniqueCategories, categories);
						data.push(line);
					});

					break;
				case "column":
					periodsByCategory = this.getPeriodsByCategory();
					const periodNames = this._flattenList(periodsByCategory);
					data.push(["Category", ...periodNames]);

					_.forEach(periodsByCategory, (years, categoryID) => {
						const name = this._getCategoryName(categoryID);
						const line = this._getLine(name, periodNames, years);
						data.push(line);
					});

					break;
			}

			return data;
		},

		toggle() {
			this.expanded = !this.expanded;
		}
	}
});