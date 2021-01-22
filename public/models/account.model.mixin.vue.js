const AccountModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
		bindAccount(id, varName) {
			return this.bind(id, "accounts", varName || 'account');
		},
		bindAccounts(varName, filters) {
			return this.bindCollection("accounts", filters, varName || "accounts")
		},
		createAccount(data) {
			data.userID = this.$root.userID;
			return this.create(data, "accounts");
		},
		updateAccount(id, data) {
			return this.update(id, data, "accounts");
		},
		deleteAccount(id) {
			return this.remove(id, "accounts")
		},
	}
};
