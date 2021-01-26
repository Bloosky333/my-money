const DigestModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {}
	},
	methods: {
		saveDigest(digest, transactions) {
			if (transactions) {
				const data = this.computeDigest(transactions);
				console.log("COMPUTED DIGEST", data);
				return this.updateDigest(digest.id, data);
			} else {
				return this.updateDigest(digest.id, digest)
			}
		},

		computeYears(transactions) {
			const years = [];
			transactions.forEach(t => {
				if (t.year && !years.includes(t.year)) {
					years.push(t.year);
				}
			});
			return years;
		},
		computeAccounts(transactions) {
			const accounts = [];
			transactions.forEach(t => {
				if (t.accountID && !accounts.includes(t.accountID)) {
					accounts.push(t.accountID);
				}
			});
			return accounts;
		},
		_getList(id, parent, defaultObj) {
			id = id === undefined ? "?" : id;
			if (!parent[id]) {
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
				if (t.amount > 0) {
					income += parseFloat(t.amount);
				} else {
					expense += parseFloat(t.amount);
				}
			});
			return {
				income: income,
				expense: expense,
				total: income + expense
			};
		},
		computeDigest(transactions) {
			const digest = {
				years: this.computeYears(transactions),
				accounts: {},
			};

			const subDigest = [
				{field: "years", order: "years,categories"},
				{field: "categories", order: "categories,years"},
			];

			let year, category, account;
			transactions.forEach(t => {
				account = this._getList(t.accountID, digest.accounts, {
					years: {},
					categories: {},
				});

				// By Year
				year = this._getList(t.year, account.years, {categories: {}});
				category = this._getList(t.categoryID, year.categories, {transactions: []});
				category.transactions.push(t);

				// By Category
				category = this._getList(t.categoryID, account.categories, {years: {}});
				year = this._getList(t.year, category.years, {transactions: []});
				year.transactions.push(t);
			});

			_.forEach(subDigest, (s, i) => {
				this._computeTotals(digest.accounts, s.order, i);
			});

			return digest;
		},

		_computeTotals(data, order, notSumFirst) {
			order = order.split(',');
			_.forEach(data, item => {
				this._computeLevelTotals(item, order, 0, notSumFirst);
			})
		},
		_computeLevelTotals(parent, order, index, notSumFirst) {
			const childField = order[index];
			const children = parent[childField];
			_.forEach(children, child => {
				if (child.transactions) {
					_.assign(child, this._getTotal(child.transactions));
					delete child.transactions;
				} else {
					this._computeLevelTotals(child, order, index + 1);
				}

				if(index > 0 || !notSumFirst) {
					parent.income += child.income;
					parent.expense += child.expense;
					parent.total += child.total;
				}
			});
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
			return this.update(id, data, "digests", false);
		},
		deleteDigest(id) {
			return this.remove(id, "digests")
		},
	}
};
