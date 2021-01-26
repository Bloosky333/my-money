const FiltersBar = Vue.component("FiltersBar", {
	mixins: [],
	props: ["show", "search", "categories", "accounts", "transactions", "years"],
	template: `
        <section-block class="mb-0">
        	<v-expand-transition>
				<v-row dense align="center" v-if="expanded && show">
					<v-col cols="6">
						<v-btn
							@click="changeFilter('years')"
							block
							color="grey darken-3"
							depressed
							small
						>
							<v-icon small left>mdi-calendar-cursor</v-icon> 
							Periods ({{ getCounter('years') }})
						</v-btn>
					</v-col>
					<v-col cols="6">
						<v-btn
							@click="changeFilter('accounts')"
							block
							color="grey darken-3"
							depressed
							small
						>
							<v-icon small left>mdi-bank</v-icon> 
							Accounts ({{ getCounter('accounts') }})
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-btn
							@click="changeFilter('categories')"
							block
							color="grey darken-3"
							depressed
							small
						>
							<v-icon small left>mdi-tag</v-icon> 
							Categories ({{ getCounter('categories') }})
						</v-btn>
					</v-col>
				</v-row>
        	</v-expand-transition>
        	
        	<filter-select-dialog
        		:show.sync="showSelect"
        		:search.sync="search"
        		:type="selectedType"
        		:years="years"
        		:accounts="accounts"
        		:categories="categories"
        	></filter-select-dialog>
        	
       		<v-btn
				fab
				depressed
				class="fab-center fab-filter"
				color="grey darken-4"
				@click="toggle"
			><v-icon :small="!show">{{ toggleIcon }}</v-icon></v-btn>
			
        </section-block>
    `,
	data() {
		return {
			showSelect: false,
			selectedType: false,
			expanded: true
		}
	},
	watch: {
		search: {
			deep: true,
			handler(search) {
				search.allYears = !search.years.length || search.years.length === this.years.length;
				search.allAccounts = !search.accounts.length || search.accounts.length === this.accounts.length;
				search.allCategories = !search.categories.length || search.categories.length === this.categories.length;
			}
		},
	},
	computed: {
		toggleIcon() {
			if (!this.show) {
				return "mdi-lock";
			}
			return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down';
		},
	},
	methods: {
		changeFilter(type) {
			this.showSelect = true;
			this.selectedType = type;
		},
		getCounter(type) {
			const name = _.camelCase("all " + type);
			if (this.search[type][name]) {
				return "All";
			} else if(this[type] && this.search[type]) {
				return this.search[type].length + '/' + this[type].length;
			}
		},
		toggle() {
			this.expanded = !this.expanded;
		}
	}
});