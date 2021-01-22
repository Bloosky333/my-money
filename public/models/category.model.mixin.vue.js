const CategoryModelMixin = {
	mixins: [ModelMixin],
	data() {
		return {
			categories: [],
			defaultCategories: {
				name: "",
				account: "",
				counterpartAccount: "",
				communications: []
			},
		}
	},
	methods: {
		saveCategory(category) {
			const id = category.id;
			if(id) {
				return this.updateCategory(id, category)
			} else {
				return this.createCategory(category)
			}
		},
		getCategoryByID(id) {
			if(id) {
				const found = _.find(this.categories, category => {
					return category.id === id;
				});
				return found || {};
			} else {
				return {};
			}
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
