const FiltersBar = Vue.component("FiltersBar", {
	mixins: [TransactionModelMixin],
	props: ["search", "categories", "accounts", "transactions", "show"],
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
	computed: {
		toggleIcon() {
			if(!this.show) {
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
			if (this.search[type].length === this[type].length) {
				return "All";
			} else {
				return this.search[type].length + '/' + this[type].length;
			}
		},
		toggle() {
			this.expanded = !this.expanded;
		}
	}
});