const StatsMixin = Vue.component("StatsMixin", {
	methods: {
		getPeriodsByAccount() {
			return this._getPeriodsByX("account");
		},
		getPeriodsByCategory() {
			return this._getPeriodsByX("category");
		},

		getAccountsByPeriod() {
			return this._getXByPeriod("account");
		},
		getCategoriesByPeriod() {
			return this._getXByPeriod("category");
		},

		_getXByPeriod(type) {
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

		_getPeriodsByX(type) {
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

		_getTotals(list) {
			const totals = {};
			_.forEach(list, items => {
				_.forEach(items, (item, id) => {
					let total = totals[id] || 0;
					if (this.params.expense) {
						total += Math.abs(item.expense);
					} else {
						total += item.income;
					}
					totals[id] = total;
				});
			});
			return totals;
		},
		_getLine(name, columns, items, field) {
			const line = [name];
			columns.forEach(id => {
				const item = items[id];
				if (item) {
					if (field) {
						line.push(this._round(item[field]));
					} else if (this.params.expense) {
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
			return uniques;
		},
	}
});