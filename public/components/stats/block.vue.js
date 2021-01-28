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
			const functionName = _.camelCase("get " + this.params.stat + " data");
			return this[functionName]();
		},
	},
	methods: {
		getCashflowData() {
			let headers = [], series = [], headerName;

			switch (this.chartType) {
				case "combo":
					headerName = "Period";
					const periodsByAccount = this.getPeriodsByAccount();
					const uniquePeriods = this._flattenList(periodsByAccount);
					headers = uniquePeriods;

					_.forEach(periodsByAccount, (years, accountID) => {
						const name = this._getAccountName(accountID);
						series.push(this._getDataLine(name, uniquePeriods, years, "total"));
					});
					series.push(this._getTotalLine(series));

					break;
				case "column":
					const accountsByPeriod = this.getAccountsByPeriod();
					const uniqueAccounts = this._flattenList(accountsByPeriod);

					headerName = "Account";
					headers = uniqueAccounts.map(accountID => this._getAccountName(accountID))

					_.forEach(accountsByPeriod, (accounts, year) => {
						series.push(this._getDataLine(year, uniquePeriods, accounts, "total"));
					});
					break;
			}

			return {headers, series, headerName};
		},


		_roundDataLine(data) {
			return data.map(item => this._round(item))
		},

		_getTotalLine(series) {
			let total = [];
			if(series[0] && series[0].data) {
				total = series[0].data.map(x => 0);
				series.forEach(serie => {
					serie.data.forEach((val, i) => {
						total[i] += val;
					})
				})
			}

			return {
				type: 'spline',
				name: 'All',
				data: this._roundDataLine(total),
				marker: {
					lineWidth: 2,
					lineColor: Highcharts.getOptions().colors[3],
					fillColor: 'white'
				}
			}
		},
		_getDataLine(name, uniqueIds, items, field, totalData, absolute) {
			const data = [];
			uniqueIds.forEach((id, i) => {
				if(totalData && !totalData[i]) totalData[i] = 0;

				const found = items[id];
				if (found) {
					const value = absolute ? Math.abs(found[field]) : found[field];
					data.push(value);
					if(totalData) {
						totalData[i] += value;
					}
				} else {
					data.push(0);
				}
			});

			return {
				type: 'column',
				name: name,
				data: this._roundDataLine(data),
			}
		},

		// PERIOD
		getIncomeExpenseData() {
			let headers = [], series = [], headerName;

			switch (this.chartType) {
				case "combo":
					headerName = "Period";
					const periodsByAccount = this.getPeriodsByAccount();
					const uniquePeriods = this._flattenList(periodsByAccount);
					headers = uniquePeriods;

					_.forEach(periodsByAccount, (years, accountID) => {
						const name = this._getAccountName(accountID);
						series.push(this._getDataLine(name + '/IN', uniquePeriods, years, "income"));
						series.push(this._getDataLine(name + '/OUT', uniquePeriods, years, "expense"));
					});
					series.push(this._getTotalLine(series));

					break;
				case "column":
					const accountsByPeriod = this.getAccountsByPeriod();
					const uniqueAccounts = this._flattenList(accountsByPeriod);

					headerName = "Account";
					headers = uniqueAccounts.map(accountID => this._getAccountName(accountID))

					_.forEach(accountsByPeriod, (accounts, year) => {
						const data = [];
						uniqueAccounts.forEach(accountID => {
							const account = accounts[accountID];
							if (account) {
								data.push(this._round(account.total));
							} else {
								data.push(0);
							}
						});

						series.push({
							name: year,
							data: data,
						});
					});
					break;
			}

			return {headers, series, headerName};
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