const BalanceBlock = Vue.component("BalanceBlock", {
	mixins: [StatsMixin],
	props: ["digest", "accounts"],
	template: `
		<div>
			<section-title>Account's balance</section-title>
			<v-row dense>
				<v-col cols="4" v-for="account in accountList" class="py-0" @click="edit(account.model)">
					<section-block class="pa-2 text-center" marginBottom="0">
						<div class="text-overline font-weight-light grey--text standard-line-height"><small>{{ account.name }}</small></div>
						<div class="text-button standard-line-height">{{ account.balance | round }}€</div>
					</section-block>
				</v-col>
			</v-row>
		</div>
    `,
	data() {
		return {

		}
	},
	computed: {
		accountList() {
			const balances = [];
			_.forEach(this.digest.accounts, (account, accountID) => {
				const accountObj = _.find(this.accounts, a => a.id === accountID);
				balances.push({
					id: accountID,
					name: accountObj.name,
					balance: account.total + (accountObj.initialBalance || 0),
					model: accountObj
				});
			})
			return _.sortBy(balances, b => b.name);
		},
	},
	methods: {
		edit(item) {
			this.$emit("edit", "account", item);
		},
	}
});
