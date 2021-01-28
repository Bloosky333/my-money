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
						<stats-table :data="data" :type="chartType"></stats-table>
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
		// Cash-flow
		getCashflowData() {
			let headers = [], series = [], headerName, stack;

			switch (this.chartType) {
				case "combo":
					return this._getComboData("account",false, false, true);
				case "column":
					return this._getColumnData("account",false, false, true, false);
			}

			return {headers, series, headerName, stack};
		},

		// Income-Expense
		getIncomeExpenseData() {
			let headers = [], series = [], headerName, stack;

			switch (this.chartType) {
				case "combo":
					return this._getComboData(true, true, false);
				case "column":
					return this._getColumnData("account",true, true, false, true);
			}

			return {headers, series, headerName, stack};
		},

		// CATEGORY
		getCategoryData() {
			const data = [];
			let categoriesByPeriod, periodsByCategory;
			const expense = this.params.expense;
			switch (this.chartType) {
				case "pie":
					return this._getPieData();
				case "line":
					return this._getLineData(!expense, expense, false);
				case "column":
					return this._getColumnData("category",!expense, expense, false, false, true);
			}

			return data;
		},

		_getPieData() {
			const periodsByCategory = this.getPeriodsByCategory();
			const headerName = "Category";
			const headers = false;

			const data = [];
			_.forEach(periodsByCategory, (years, categoryID) => {
				const name = this._getCategoryName(categoryID);
				let total = 0;
				_.forEach(years, year => {
					total += this.params.expense ? year.expense : year.income;
				});
				total = Math.abs(total);
				if(total > 0){
					data.push([name, this._round(total)]);
				}
			});

			const series = [{
				name: headerName,
				data: data,
				type: "pie",
			}];
			return {headers, series, headerName};
		},
		_getComboData(income, expense, total) {
			const periodsByAccount = this.getPeriodsByAccount();
			const uniquePeriods = this._flattenList(periodsByAccount);

			const headerName = "Period";
			const headers = uniquePeriods;
			const stack = true;

			const series = [];
			_.forEach(periodsByAccount, (years, accountID) => {
				const name = this._getAccountName(accountID);
				if(income) series.push(this._getDataLine(name + '/IN', uniquePeriods, years, "income"));
				if(expense) series.push(this._getDataLine(name + '/OUT', uniquePeriods, years, "expense"));
				if(total) series.push(this._getDataLine(name, uniquePeriods, years, "total"));
			});
			series.push(this._getTotalLine(series));

			return {headers, series, headerName, stack};
		},
		_getColumnData(resource, income, expense, total, stack, absolute) {
			let XbyPeriod, uniqueIDs, headers;
			if(resource === "account") {
				XbyPeriod = this.getAccountsByPeriod();
				uniqueIDs = this._flattenList(XbyPeriod);
				headers = uniqueIDs.map(id => this._getAccountName(id));
			} else {
				XbyPeriod = this.getCategoriesByPeriod();
				uniqueIDs = this._flattenList(XbyPeriod);
				headers = uniqueIDs.map(id => this._getCategoryName(id));
			}

			const headerName = _.capitalize(resource);

			const series = [];
			_.forEach(XbyPeriod, (items, year) => {
				if(income) series.push(this._getDataLine(year + '/IN', uniqueIDs, items, "income", year, absolute));
				if(expense) series.push(this._getDataLine(year + '/OUT', uniqueIDs, items, "expense", year, absolute));
				if(total) series.push(this._getDataLine(year, uniqueIDs, items, "total", absolute));
			});

			return {headers, series, headerName, stack};
		},
		_getLineData(income, expense, total) {
			const periodsByCategory = this.getPeriodsByCategory();
			const uniquePeriods = this._flattenList(periodsByCategory);

			const headerName = "Category";
			const headers = uniquePeriods;

			const series = [];
			_.forEach(periodsByCategory, (years, categoryID) => {
				const name = this._getCategoryName(categoryID);
				if(income) series.push(this._getDataLine(name, uniquePeriods, years, "income", false, true));
				if(expense) series.push(this._getDataLine(name, uniquePeriods, years, "expense",false, true));
				if(total) series.push(this._getDataLine(name, uniquePeriods, years, "total", false, true));
			});
			series.push(this._getTotalLine(series));

			return {headers, series, headerName};
		},

		toggle() {
			this.expanded = !this.expanded;
		}
	}
});