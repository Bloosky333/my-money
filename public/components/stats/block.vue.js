const StatsBlock = Vue.component("StatsBlock", {
	props: ["title", "digest", "search", "categories", "accounts", "chartTypes", "grouping", "expense"],
	template: `
		<div>
			<section-title>
				{{ title }}
				<template v-slot:action>
					<v-btn-toggle 
						v-model="chartType" 
						rounded
						borderless 
						mandatory
						color="orange darken-2"
					>
						<v-btn 
							v-for="type in chartTypesArray"
							small
							:value="type"
						><v-icon small>{{ CONST.chartIcon[type] }}</v-icon></v-btn> 
					</v-btn-toggle>
				</template>
			</section-title>
		
			<section-block class="pt-5">
				<div v-if="digest.accounts">
					<stats-chart 
						v-if="chartType"
						:type="chartType" 
						:data="data"
					></stats-chart>
					
					<div class="d-flex align-center justify-space-between text-overline mt-2 grey--text" @click="toggle">
						<div v-if="expanded">Hide details</div>
						<div v-else>Show details</div>
						<v-icon small>{{ toggleIcon }}</v-icon>
					</div>
					<div v-if="expanded" class="mt-2">
						<v-expand-transition>
							<stats-table :data="data"></stats-table>
						</v-expand-transition>
					</div>
				</div>
				<div v-else class="text-center py-4">
					<v-progress-linear indeterminate color="orange darken-2"></v-progress-linear>
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
	created() {
		this.chartType = this.chartTypesArray[0];
	},
	computed: {
		chartTypesArray() {
			return this.chartTypes.split(',');
		},
		toggleIcon() {
			return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down';
		},
		data() {
			const functionName = _.camelCase("get data by " + this.grouping);
			return this[functionName]();
		},
	},
	methods: {
		_getAccountName(id) {
			const account = _.find(this.accounts, a => a.id === id);
			return account ? account.name : "?";
		},
		_getCategoryName(id) {
			const category = _.find(this.categories, c => c.id === id);
			return category ? category.name : "?";
		},
		_include(field, id) {
			const allName = _.camelCase("all " + field);
			const formatted = field === "years" ? parseInt(id) : id;
			return !this.search[field] || this.search[allName] || this.search[field].includes(formatted);
		},
		_round(val) {
			return _.round(val, 2);
		},

		_flattenList(years) {
			const uniques = [];
			_.forEach(years, items => {
				_.forEach(items, (item, id) => {
					if(!uniques.includes(id)) {
						uniques.push(id);
					}
				});
			});
			return uniques;
		},

		// PERIOD
		getDataByPeriod() {
			// Format
			// Period xxx/IN xxx/OUT yyy/IN yyy/OUT Total
			const years = this._getAccountsByPeriod();
			const uniqueAccounts = this._flattenList(years);

			const headers = ["Period"];
			uniqueAccounts.forEach(accountID => {
				const accountName = this._getAccountName(accountID);
				headers.push(accountName + "/IN", accountName + "/OUT")
			});
			headers.push("Total");

			const lines = [];
			_.forEach(years, (accounts, year) => {
				const line = [year];
				let total = 0;
				uniqueAccounts.forEach(accountID => {
					const account = accounts[accountID];
					if (account) {
						line.push(account.income, account.expense);
						total += account.total;
					} else {
						line.push(0, 0);
					}
				});
				line.push(total);
				lines.push(line);
			});

			return [headers, ...lines];
		},

		_getAccountsByPeriod() {
			const years = {};
			_.forEach(this.digest.accounts, (account, accountID) => {
				if (this._include("accounts", accountID)) {
					_.forEach(account.years, (yearObj, year) => {
						if (this._include("years", parseInt(year))) {
							const yearResult = years[year] || {};
							const accountResult = {
								income: 0,
								expense: 0,
								total: 0,
							};
							_.forEach(yearObj.categories, (category, categoryID) => {
								if (this._include("categories", parseInt(categoryID))) {
									accountResult.income += category.income;
									accountResult.expense += category.expense;
									accountResult.total += category.total;
								}
							});
							yearResult[accountID] = accountResult;
							years[year] = yearResult;
						}
					});
				}
			});

			return years;
		},
		_getCategoriesByPeriod() {
			const years = {};
			_.forEach(this.digest.accounts, (account, accountID) => {
				if (this._include("accounts", accountID)) {
					_.forEach(account.years, (yearObj, year) => {
						if (this._include("years", parseInt(year))) {
							const yearResult = years[year] || {};
							_.forEach(yearObj.categories, (category, categoryID) => {
								if (this._include("categories", parseInt(categoryID))) {
									const categoryResult = yearResult[categoryID] || {
										income: 0,
										expense: 0,
										total: 0,
									};
									categoryResult.income += category.income;
									categoryResult.expense += category.expense;
									categoryResult.total += category.total;

									yearResult[categoryID] = categoryResult;
								}
							});
							years[year] = yearResult;
						}
					});
				}
			});
			return years;
		},

		getPeriodsByCategory() {
			const categories = {};
			_.forEach(this.digest.accounts, (account, accountID) => {
				if (this._include("accounts", accountID)) {
					_.forEach(account.categories, (category, categoryID) => {
						if (this._include("categories", parseInt(categoryID))) {
							const categoryResult = categories[categoryID] || {};
							_.forEach(category.years, (yearObj, year) => {
								if (this._include("years", parseInt(year))) {
									const yearResult = categoryResult[year] || {
										income: 0,
										expense: 0,
										total: 0,
									};
									yearResult.income += yearObj.income;
									yearResult.expense += yearObj.expense;
									yearResult.total += yearObj.total;

									categoryResult[year] = yearResult;
								}
							});
							categories[categoryID] = categoryResult;
						}
					});
				}
			});
			return categories;
		},

		// CATEGORY
		getDataByCategory() {
			const data = [];
			let categoriesByPeriod, periodsByCategory;

			switch (this.chartType) {
				case "pie":
					categoriesByPeriod = this._getCategoriesByPeriod();
					data.push(["Category", "Total"]);
					const categoryTotals = this._getTotals(categoriesByPeriod);
					_.forEach(categoryTotals, (total, categoryID) => {
						const name = this._getCategoryName(categoryID);
						data.push([name, this._round(total)]);
					});

					break;
				case "line":
					categoriesByPeriod = this._getCategoriesByPeriod();
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

		_getTotals(list) {
			const totals = {};
			_.forEach(list, items => {
				_.forEach(items, (item, id) => {
					let total = totals[id] || 0;
					if (this.expense) {
						total += Math.abs(item.expense);
					} else {
						total += item.income;
					}
					totals[id] = total;
				});
			});
			return totals;
		},
		_getLine(name, columns, items) {
			const line = [name];
			columns.forEach(id => {
				const item = items[id];
				if (item) {
					if (this.expense) {
						line.push(this._round(Math.abs(item.expense)));
					} else {
						line.push(this._round(item.income));
					}
				} else {
					line.push(0);
				}
			});
			return line;
		},

		toggle() {
			this.expanded = !this.expanded;
		}
	}
});