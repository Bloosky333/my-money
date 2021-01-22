const TransactionModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
			// defaultTransaction: {
			// 	userID: false,
			// 	categoryID: false,
			// 	account: "",
			// 	counterpart_account: "",
			// 	counterpart_name: "",
			// 	date: "",
			// 	amount: "",
			// 	communications: ""
			// },
		}
	},
	methods: {
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
