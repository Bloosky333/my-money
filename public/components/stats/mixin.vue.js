const StatsMixin = Vue.component("StatsMixin", {
	methods: {
		getPeriodsByAccount() {
			return this._getPeriodsByXData("account");
		},
		getPeriodsByCategory() {
			return this._getPeriodsByXData("category");
		},

		getAccountsByPeriod() {
			return this._getXByPeriodData("account");
		},
		getCategoriesByPeriod() {
			return this._getXByPeriodData("category");
		},

		_getPeriodsByX(params) {
			let data;
			if (params.resource === "account") {
				data = this.getPeriodsByAccount();
			} else {
				data = this.getPeriodsByCategory();
			}

			const IDs = this._flattenList(data);
			const headerName = _.capitalize(params.resource);
			const headers = IDs;

			const series = this._getSeries(data, IDs, params);

			return {headerName, headers, series}
		},
		_getXByPeriod(params) {
			params.idIsName = true;

			let data;
			if (params.resource === "account") {
				data = this.getAccountsByPeriod();
			} else {
				data = this.getCategoriesByPeriod();
			}

			const IDs = this._flattenList(data);
			const headerName = _.capitalize(params.resource);

			const getNameFct = this._getNameFunction(params.resource);
			const headers = IDs.map(id => getNameFct(id));

			const series = this._getSeries(data, IDs, params);


			return {headerName, headers, series}
		},

		_getXByPeriodData(type) {
			const results = {};
			let result;
			_.forEach(this.digest.accounts, (account, accountID) => {
				if (this._include("accounts", accountID)) {
					_.forEach(account.years, (yearObj, year) => {
						if (this._include("years", year)) {
							// const yearResult = results[year] || {};
							if (type === "account") {
								result = {
									income: 0,
									expense: 0,
									total: 0,
									months: {}
								};
							}

							_.forEach(yearObj.months, (monthObj, month) => {
								_.forEach(monthObj.categories, (category, categoryID) => {
									if (this._include("categories", categoryID)) {
										const yearResult = results[year] || {};
										if (type === "category") {
											result = yearResult[categoryID] || {
												income: 0,
												expense: 0,
												total: 0,
												months: {}
											};
										}

										const monthResult = result.months[month] || {
											income: 0,
											expense: 0,
											total: 0,
										};

										monthResult.income += category.income;
										monthResult.expense += category.expense;
										monthResult.total += category.total;

										result.income += category.income;
										result.expense += category.expense;
										result.total += category.total;

										result.months[month] = monthResult;

										if (type === "category") {
											yearResult[categoryID] = result;
										}
										if (type === "account") {
											yearResult[accountID] = result;
										}
										results[year] = yearResult;
									}
								});
							});
						}
					});
				}
			});
			return results;
		},

		_getPeriodsByXData(type) {
			let result;
			const results = {};
			_.forEach(this.digest.accounts, (account, accountID) => {
				if (this._include("accounts", accountID)) {
					if (type === "account") {
						result = results[accountID] || {};
					}
					_.forEach(account.years, (yearObj, year) => {
						if (this._include("years", year)) {
							_.forEach(yearObj.months, (monthObj, month) => {
								_.forEach(monthObj.categories, (category, categoryID) => {
									if (this._include("categories", categoryID)) {
										if (type === "category") {
											result = results[categoryID] || {};
										}
										const yearResult = result[year] || {
											income: 0,
											expense: 0,
											total: 0,
										};

										yearResult.income += category.income;
										yearResult.expense += category.expense;
										yearResult.total += category.total;
										result[year] = yearResult;
										if (type === "category") {
											results[categoryID] = result;
										}
									}
								});
							})
						}
					});
					if (type === "account") {
						results[accountID] = result;
					}
				}
			});
			return results;
		},

		_roundDataLine(data) {
			return data.map(item => this._round(item))
		},

		_getTotalLine(series) {
			let total = [];
			if(series[0] && series[0].data) {
				total = series[0].data.map(x => 0);
				series.forEach(item => {
					item.data.forEach((val, i) => {
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

		_getNameFunction(resource) {
			const fctName = "_" + _.camelCase("get " + resource + " name");
			return this[fctName];
		},
		_getSeries(data, IDs, params) {
			const getNameFct = params.idIsName ? false : this._getNameFunction(params.resource);

			const series = [];
			_.forEach(data, (items, id) => {
				const name = getNameFct ? getNameFct(id) : id;
				const addSuffix = params.income && params.expense;
				const stack = params.group ? id : false;

				let fullName;
				if(params.income) {
					fullName = addSuffix ? name + "/IN" : name;
					series.push(this._getDataLine(fullName, IDs, items, "income", stack, params.absolute));
				}
				if(params.expense){
					fullName = addSuffix ? name + "/OUT" : name;
					series.push(this._getDataLine(fullName, IDs, items, "expense", stack, params.absolute));
				}
				if(params.total) {
					series.push(this._getDataLine(name, IDs, items, "total", stack, params.absolute));
				}
			});
			return series;
		},

		_getDataLine(name, uniqueIds, items, field, stack, absolute) {
			const data = [];
			uniqueIds.forEach((id, i) => {
				const found = items[id];
				if (found) {
					const value = absolute ? Math.abs(found[field]) : found[field];
					data.push(value);
				} else {
					data.push(0);
				}
			});

			const type = this.chartType === "line" ? "line" : "column";
			return {
				type: type,
				name: name,
				data: this._roundDataLine(data),
				stack: stack || false
			}
		},

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
					if (!uniques.includes(id)) {
						uniques.push(id);
					}
				});
			});
			return uniques.sort();
		},
	}
});