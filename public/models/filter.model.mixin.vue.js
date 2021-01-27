const FilterModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
		saveFilter(filter) {
			const id = filter.id;
			if(id) {
				return this.updateFilter(id, filter)
			} else {
				return this.createFilter(filter)
			}
		},
		findMatchFilter(transaction) {
			return _.find(this.filters, filter => {
				return this.filterMatch(filter, transaction);
			})
		},
		filterMatch(filter, transaction) {
			if(
				(filter.accountID && filter.accountID !== transaction.accountID) ||
				(filter.counterpartAccount && filter.counterpartAccount !== transaction.counterpartAccount)
			) {
				return false;
			} else if(filter.contains && filter.contains.length) {
				const communications = _.lowerCase(_.deburr(transaction.communications));
				return filter.contains.every(text => {
					if(text) {
						const search = _.lowerCase(_.deburr(text));
						return communications.includes(search);
					} else {
						return true;
					}
				});
			} else {
				return true;
			}
		},

		bindFilter(id, varName) {
			return this.bind(id, "filters", varName || 'filter');
		},
		bindFilters(varName, filters) {
			return this.bindCollection("filters", filters, varName || "filters")
		},
		createFilter(data) {
			data.userID = this.$root.userID;
			return this.create(data, "filters");
		},
		updateFilter(id, data) {
			return this.update(id, data, "filters");
		},
		deleteFilter(id) {
			return this.remove(id, "filters")
		},
	}
};
