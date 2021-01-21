const TransactionModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
			transactions: [],
			defaultTransaction: {
				userID: false,
				categoryID: false,
				account: "",
				counterpart_account: "",
				counterpart_name: "",
				date: "",
				amount: "",
				communications: ""
			},
		}
	},
	methods: {
		_formatTransaction(transaction) {
			_.forEach(this.defaultTransaction, (value, key) => {
				if (transaction[key] === undefined) {
					this.$set(transaction, key, _.clone(value))
				}
			});

			return transaction;
		},

		bindTransaction(id, varName) {
			return this.bind(id, "transactions", varName || 'transaction');
		},
		bindTransactions(varName, filters) {
			return this.bindCollection("transactions", filters, varName || "transactions")
		},
		createTransaction(data) {
			data.userID = this.$root.userID;
			return this.create(data, "transactions");
		},
		updateTransaction(id, data) {
			return this.update(id, data, "transactions");
		},
		deleteTransaction(id) {
			return this.remove(id, "transactions")
		},
	}
};
