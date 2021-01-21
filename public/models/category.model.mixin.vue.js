const CategoryModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
			categories: [],
			defaultCategories: {
				name: "",
				account: "",
				counterpart_account: "",
				communications: []
			},
		}
	},
	methods: {
		autoAssign(transaction) {
			const found = _.find(this.categories, category => {
				const checkAccount = !category.account;

			});
		},
		bindCategory(id, varName) {
			return this.bind(id, "categories", varName || 'category');
		},
		bindCategories(varName, filters) {
			return this.bindCollection("categories", filters, varName || "categories")
		},
		createCategory(data) {
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
