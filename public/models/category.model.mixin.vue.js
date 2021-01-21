const CategoryModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
			categories: [],
			defaultCategories: {
				account: ""
			},
		}
	},
	methods: {
		_formatCategory(category) {
			_.forEach(this.defaultCategory, (value, key) => {
				if (category[key] === undefined) {
					this.$set(category, key, _.clone(value))
				}
			});

			return category;
		},

		bindCategory(id, varName) {
			return this.bind(id, "categories", varName || 'category');
		},
		bindCategories(varName, filters) {
			return this.bindCollection("categories", filters, varName || "categories")
		},
		createCategory(data) {
			data.userID = this.$root.userID;
			return this.create(data, "categories");
		},
		updateCategory(id, data) {
			return this.update(id, data, "categories");
		},
		deleteCategory(id) {
			return this.remove(id, "categories")
		},
	}
};
