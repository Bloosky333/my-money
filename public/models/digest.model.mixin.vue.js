const DigestModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
		saveDigest(digest, transactions) {
			digest.accounts = this.computeDigest(transactions);
			const id = digest.id;
			if(id) {
				return this.updateDigest(id, digest)
			} else {
				return this.createDigest(digest)
			}
		},

		_getList(id, parent, defaultObj) {
			id = id || "?";
			if(!parent[id]) {
				parent[id] = {
					...defaultObj,
					income: 0,
					expense: 0,
					total: 0,
				};
			}
			return parent[id];
		},
		_getTotal(transactions) {
			let income = 0;
			let expense = 0;

			transactions.forEach(t => {
				if(t.amount > 0) {
					income += t.amount;
				} else {
					expense += t.amount;
				}
			});
			return {
				income: income,
				expense: expense,
				total: income + expense
			};
		},
		computeDigest(transactions) {
			const digest = {};
			transactions.forEach(t => {
				const account = this._getList(t.accountID, digest, {
					years: {},
					categories: {},
				});

				let year = this._getList(t.year, account.years, {months: {}});
				let month = this._getList(t.month, year.months, {categories: {}});
				let category = this._getList(t.categoryID, month.categories, {transactions: []});
				category.transactions.push(t);

				category = this._getList(t.categoryID, account.categories, {years: {}});
				year = this._getList(t.year, category.years, {months: {}});
				month = this._getList(t.month, year.months, {transactions: []});
				month.transactions.push(t);
			});

			_.forEach(digest, account => {
				_.forEach(account.years, year => {
					_.forEach(year.months, month => {
						_.forEach(month.categories, category => {
							_.assign(category, this._getTotal(category.transactions));
							month.income += category.income;
							month.expense += category.expense;
							month.total += category.total;
							delete category.transactions;
						});
						year.income += month.income;
						year.expense += month.expense;
						year.total += month.total;
					});
					account.income += year.income;
					account.expense += year.expense;
					account.total += year.total;
				});

				_.forEach(account.categories, category => {
					_.forEach(category.years, year => {
						_.forEach(year.months, month => {
							_.assign(month, this._getTotal(month.transactions));
							year.income += month.income;
							year.expense += month.expense;
							year.total += month.total;
							delete month.transactions;
						});
						category.income += year.income;
						category.expense += year.expense;
						category.total += year.total;
					});
				});
			});
			return digest;
		},

		bindDigest(id, varName) {
			return this.bind(id, "digests", varName || 'digest');
		},
		bindDigests(varName, digests) {
			return this.bindCollection("digests", digests, varName || "digests")
		},
		createDigest(data) {
			data.userID = this.$root.userID;
			return this.create(data, "digests");
		},
		updateDigest(id, data) {
			return this.update(id, data, "digests");
		},
		deleteDigest(id) {
			return this.remove(id, "digests")
		},
	}
};
