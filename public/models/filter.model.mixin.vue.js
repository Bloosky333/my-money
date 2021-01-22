const FilterModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
		}
	},
	methods: {
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
