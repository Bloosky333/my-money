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
			const params = {
				resource: "account",
				income: false,
				expense: false,
				total: true
			};
			switch (this.chartType) {
				case "combo":
					params.stack = true;
					return this._getComboData(params);
				case "column":
					return this._getColumnData(params);
			}
		},

		// Income-Expense
		getIncomeExpenseData() {
			const params = {
				resource: "account",
				income: true,
				expense: true,
				total: false,
				stack: true
			};

			switch (this.chartType) {
				case "combo":
					return this._getComboData(params);
				case "column":
					params.group = true;
					return this._getColumnData(params);
			}
		},

		// CATEGORY
		getCategoryData() {
			const params = {
				resource: "category",
				income: !this.params.expense,
				expense: this.params.expense,
				total: false,
				stack: false,
				group: true,
				absolute: true
			};
			switch (this.chartType) {
				case "pie":
					return this._getPieData(params);
				case "line":
					return this._getLineData(params);
				case "column":
					return this._getColumnData(params);
			}
		},

		_getPieData(params) {
			const periodsByCategory = this.getPeriodsByCategory();
			const headerName = "Category";

			const data = [];
			_.forEach(periodsByCategory, (years, categoryID) => {
				const name = this._getCategoryName(categoryID);
				let total = 0;
				_.forEach(years, year => {
					total += this.params.expense ? year.expense : year.income;
				});
				total = Math.abs(total);
				if (total > 0) {
					data.push([name, this._round(total)]);
				}
			});

			const series = [{
				name: headerName,
				data: data,
				type: "pie",
			}];
			return {series, headerName};
		},
		_getComboData(params) {
			const data = this._getPeriodsByX(params);
			data.series.push(this._getTotalLine(data.series));
			return {...data, ...params};
		},
		_getColumnData(params) {
			const data = this._getXByPeriod(params);
			return {...data, ...params};
		},
		_getLineData(params) {
			const data = this._getPeriodsByX(params);
			return {...data, ...params};
		},

		toggle() {
			this.expanded = !this.expanded;
		}
	}
});