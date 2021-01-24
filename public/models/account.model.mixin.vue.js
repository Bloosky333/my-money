const AccountModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
		saveAccount(account) {
			const id = account.id;
			if(id) {
				return this.updateAccount(id, account)
			} else {
				return this.createAccount(account)
			}
		},
		getAccountByID(id) {
			if(id) {
				const found = _.find(this.accounts, account => {
					return account.id === id;
				});
				return found || {};
			} else {
				return {};
			}
		},
		findAccount(number) {
			if(number) {
				const found = _.find(this.accounts, account => {
					return account.number === number;
				});
				return found || false;
			} else {
				return false;
			}
		},

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
