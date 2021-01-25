const DigestModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
		saveDigest(digest, transactions) {
			if(transactions) {
				const data = this.computeDigest(transactions);
				return this.updateDigest(digest.id, data);
			} else{
				return this.updateDigest(digest.id, digest)
			}
		},

		computeYears(transactions) {
			const years = [];
			transactions.forEach(t => {
				if(t.year && !years.includes(t.year)) {
					years.push(t.year);
				}
			});
			return years;
		},
		computeAccounts(transactions) {
			const accounts = [];
			transactions.forEach(t => {
				if(t.accountID && !accounts.includes(t.accountID)) {
					accounts.push(t.accountID);
				}
			});
			return accounts;
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
				accounts: this.computeAccounts(transactions),
			};

			const subDigest = [
				{field: "byYear", order: "years,months,categories,accounts"},
				{field: "byCategory", order: "categories,years,months,accounts"},
				{field: "byAccountYear", order: "accounts,years,months,categories"},
				{field: "byAccountCategory", order: "accounts,categories,years,months"},
			]

			subDigest.forEach(s => {
				digest[s.field] = {};
				this.computeSubDigest(digest[s.field], transactions, s.order.split(','));
			});
			return digest;
		},

		computeSubDigest(obj, transactions, order) {
			transactions.forEach(t => {
				this._injectInTree(obj, order, 0, t);
			});
			this._computeTotals(obj, order);
		},
		_getIdField(field) {
			const matches = {
				"accounts": "accountID",
				"categories": "categoryID",
				"years": "year",
				"months": "month",
			}
			return matches[field];
		},
		_injectInTree(obj, order, index, t) {
			const idField = this._getIdField(order[index]);
			const childField = order[index+1];
			const isLast = order.length === index + 1;

			const defaultChild = {};
			if(isLast) {
				defaultChild.transactions = [];
			} else{
				defaultChild[childField] = {};
			}

			const item = this._getList(t[idField], obj, defaultChild);
			if(isLast) {
				item.transactions.push(t);
			} else {
				this._injectInTree(item[childField], order, index + 1, t);
			}
		},

		_computeTotals(data, order) {
			order.shift();
			_.forEach(data, item => {
				this._computeLevelTotals(item, order, 0);
			})
		},
		_computeLevelTotals(obj, order, index) {
			const childField = order[index];
			const child = obj[childField];
			const isLast = order.length === index + 1;

			_.forEach(child, item => {
				if(isLast) {
					_.assign(item, this._getTotal(item.transactions));
					obj.income += item.income;
					obj.expense += item.expense;
					obj.total += item.total;
					delete item.transactions;
				} else {
					this._computeLevelTotals(item, order, index + 1);
					obj.income += item.income;
					obj.expense += item.expense;
					obj.total += item.total;
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
			return this.update(id, data, "digests");
		},
		deleteDigest(id) {
			return this.remove(id, "digests")
		},
	}
};
