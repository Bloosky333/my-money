const StatsBlock = Vue.component("StatsBlock", {
	props: ["title", "digest", "search", "categories", "accounts", "chartTypes", "grouping", "expense"],
	template: `
        <section-block>
            <div class="section-title grey--text mb-4 d-flex justify-space-between align-center">
                <div>{{ title }}</div>
                <v-btn-toggle 
                    v-model="chartType" 
                    borderless 
                    mandatory
                    color="orange darken-2"
                >
                    <v-btn 
                        v-for="type in chartTypesArray"
                        small
                        :value="type"
                    ><v-icon>{{ CONST.chartIcon[type] }}</v-icon></v-btn> 
                </v-btn-toggle>
            </div>
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
			console.log("GET DATA ", functionName)
			return this[functionName]();
		},
		// reverseTransaction() {
		//     return this.transactions.slice().reverse();
		// }
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

		// PERIOD
		getDataByPeriod() {
			const headers = ["Period"];

			let periods;
			if (this.search.period === "year") {
				periods = this.search.years.slice().sort();
			} else {
				periods = []
				for (let i = 1; i <= 12; i++) {
					periods.push(i);
				}
			}

			const totals = {};
			_.forEach(this.digest.byAccountYear, (obj, accountID) => {
				if (this._include("accounts", accountID)) {
					const accountName = this._getAccountName(accountID);
					headers.push(accountName + "/IN", accountName + "/OUT")

					const data = {};
					const order = "years,months,categories".split(',');
					const returnField = this.search.period + "s";
					this._getTotal(data, obj, order, returnField, 0)

					periods.forEach(period => {
						if(!totals[period]) {
							totals[period] = {
								columns: [String(period)],
								total: 0
							}
						}
						const line = data[period];
						if(line) {
							totals[period].columns.push(line.income, line.expense)
							totals[period].total += line.total;
						} else{
							totals[period].columns.push(0, 0);
						}
					});
				}
			});

			const lines = [];
			periods.forEach(period => {
				totals[period].columns.push(totals[period].total);
				lines.push(totals[period].columns);
			});

			headers.push("Total");
			return [headers, ...lines];
		},

		_getTotal(data, obj, order, returnField, index) {
			const childField = order[index];
			const child = obj[childField];
			const isLast = order.length === index + 1;
			let total = {
				income: 0,
				expense: 0,
				total: 0,
			}

			const result = {};
			_.forEach(child, (item, itemID) => {
				if (this._include(childField, itemID)) {
					if (isLast) {
						total.income += item.income;
						total.expense += item.expense;
						total.total += item.total;
					} else {
						total = this._getTotal(data, item, order, returnField, index + 1);
					}
					if (childField === returnField) {
						total.name = itemID;
						data[total.name] = total;
					}
				}
			})

			return total;
		},

		_getTotalByPeriod() {

		},

		groupTransactionsByPeriod() {
			const periods = [];

			let period = {
				name: ""
			};
			const dateFormat = this.period === "month" ? "MM" : "YYYY";
			this.reverseTransaction.forEach(transaction => {
				const date = dateToMoment(transaction.date);

				if (date) {
					const name = date.format(dateFormat);
					if (name !== period.name) {
						period = {
							name: name,
							transactions: [],
						};
						periods.push(period);
					}
					period.transactions.push(transaction);
				}
			});
			return periods;
		},


		// CATEGORY
		getDataByCategory() {
			const data = [];
			let byCategory = {};
			let order;
			let obj;
			const returnField = this.search.period + "s";

			switch (this.chartType) {
				case "pie":
					data.push(["Category", "Total"]);
					order = "categories,years,months,accounts".split(',');
					obj = {"categories": this.digest.byCategory};
					this._getTotal(byCategory, obj, order, "categories", 0)
					_.forEach(byCategory, category => {
						const name = this._getCategoryName(category.name);
						if(this.expense) {
							data.push([name, Math.abs(category.expense)]);
						} else{
							data.push([name, category.income]);
						}
					});
					break;
				case "line":
					const categoryNames = this.categories.map(c => c.name);
					const categoryIds = this.categories.map(c => c.id);
					data.push(["Period", ...categoryNames]);

					order = "months,categories,accounts".split(',');
					_.forEach(this.digest.byYear, (obj, year) => {
						if (this._include("years", year)) {
							byCategory = {}
							this._getTotal(byCategory, obj, order, "categories", 0);

							const line = [String(year)]
							categoryIds.forEach(categoryID => {
								const category = byCategory[categoryID];
								if(category) {
									if(this.expense){
										line.push(Math.abs(category.expense));
									} else {
										line.push(category.income);
									}
								} else {
									line.push(0);
								}
							});
							data.push(line);
						}
					});
					break;
				case "column":
					// periods = this.groupTransactionsByPeriod();
					// const periodNames = periods.map(p => p.name);
					// data.push(["Category", ...periodNames]);


					//
					// this.categories.forEach(c => {
					// 	const sumsByPeriod = periods.map(period => {
					// 		return this.sumByCategory(c.id, period.transactions);
					// 	});
					// 	data.push([c.name, ...sumsByPeriod]);
					// });

					break;
			}

			return data;
		},
		sumByCategory(categoryID, transactions) {
			let total = 0;
			transactions.forEach(t => {
				if (
					(this.expense && t.amount < 0) ||
					(!this.expense && t.amount > 0)
				) {
					let amount = 0;
					if (!categoryID) {
						amount = t.categoryID ? 0 : t.amount;
					} else {
						amount = t.categoryID === categoryID ? t.amount : 0;
					}

					total += amount;
				}
			});
			return Math.abs(total);
		},

		toggle() {
			this.expanded = !this.expanded;
		}
	}
});