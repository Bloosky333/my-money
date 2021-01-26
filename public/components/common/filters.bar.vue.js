const FiltersBar = Vue.component("FiltersBar", {
	props: ["show", "search", "categories", "accounts", "transactions", "years", "digest"],
	template: `
        <section-block class="mb-0 filter-drawer py-2" color="#252525">
        	<v-expand-transition>
        		<div v-if="expanded && show" class="filter-drawer-content">
        			<template v-for="section in sections">
						<section-title no-margin-bottom="true">
							{{ section.name | capitalize }}
							
							<template v-slot:action>
								<v-btn small text color="orange darken-2" @click="setNone(section.name)">
									<v-icon small left>mdi-checkbox-blank-outline</v-icon> None
								</v-btn>
								<v-btn small text color="orange darken-2" @click="setAll(section.name)">
									<v-icon small left>mdi-checkbox-marked</v-icon> All
								</v-btn>
							</template>
						</section-title>
						<section-block class="py-1">
							<v-row dense>
								<v-col cols="6" v-for="item in section.list">
									<v-checkbox
										v-model="search[section.name]"
										:label="item.name || item"
										:value="item.id || item"
										color="orange darken-2"
										hide-details
										dense
										class="mt-0"
									></v-checkbox>
								</v-col>
							</v-row>
						</section-block>
					</template>
					
					<section-title no-margin-bottom="true">
						Save/Load Filters
					</section-title>
					<section-block class="py-1">
						<div class="d-flex align-center">
							<v-text-field
								v-model="newFilterName"
								placeholder="New filter name"
								solo
								hide-details
								single-line
								flat
							></v-text-field>
							<v-btn
								v-if="!success.add"
								text
								@click="addNewFilter"
								:disabled="!newFilterName"
								class="ml-2"
								color="orange darken-2"
							>
								<v-icon small left>mdi-content-save</v-icon> Save
							</v-btn>
							<div v-else class="success--text ml-2 px-2">
								<v-icon small left color="success">mdi-check</v-icon> Saved !
							</div>
						</div>
					</section-block>
					
					<section-block class="py-1" v-for="(item, i) in digest.search">
						<div class="d-flex align-center justify-space-between">
							<div>{{ item.name }}</div>
							<div>
								<v-btn
									icon
									@click="loadFilter(item, i)"
									:color="success.load[i] ? 'success' : 'orange darken-2'"
									:loading="processing.load[i]"
								>
									<v-icon>{{ success.load[i] ? 'mdi-check' : 'mdi-file-upload' }}</v-icon>
								</v-btn>
								<v-btn
									icon
									@click="overwriteFilter(item, i)"
									:color="success.overwrite[i] ? 'success' : 'grey'"
									:loading="processing.overwrite[i]"
								>
									<v-icon>{{ success.overwrite[i] ? 'mdi-check' : 'mdi-bulldozer' }}</v-icon>
								</v-btn>
								<v-btn
									icon
									:color="processing.remove[i] ? 'success' : 'grey'"
									@click="removeFilter(i)"
								>
									<v-icon>mdi-delete-empty</v-icon>
								</v-btn>
							</div>
						</div>
					</section-block>
        		</div>
        	</v-expand-transition>
        	
       		<v-btn
				fab
				depressed
				class="fab-center fab-filter"
				:color="show && !expanded ? 'orange darken-2' : 'grey darken-4'"
				@click="toggle"
			><v-icon :small="!show || !expanded">{{ toggleIcon }}</v-icon></v-btn>
        </section-block>
    `,
	data() {
		return {
			expanded: false,
			newFilterName: "",
			processing: {
				load: {},
				overwrite: {},
				remove: {}
			},
			success: {
				load: {},
				overwrite: {},
				add: false
			},
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
			return this.expanded ? 'mdi-chevron-up' : 'mdi-filter';
		},
		sections() {
			return [
				{name: "years", list: this.years},
				{name: "accounts", list: this.accounts},
				{name: "categories", list: this.categories},
			]
		},
	},
	methods: {
		async startBtnAnimation(type, i) {
			if(type === "add") {
				this.success.add = true;
				await this.delay(3000);
				this.success.add = false;
			} else {
				console.log(type,);
				this.$set(this.processing[type], i, true);

				console.log(type,this.processing[type]);
				await this.delay(1000);
				this.$set(this.processing[type], i, false);
				this.$set(this.success[type], i, true);
				await this.delay(3000);
				this.$set(this.success[type], i, false);
			}
		},
		addNewFilter() {
			this.startBtnAnimation("add");
			this.digest.search.push({
				name: this.newFilterName,
				search: _.cloneDeep(this.search),
			});
			this.newFilterName = "";
			this.updateDigest();
		},
		loadFilter(item, i) {
			this.startBtnAnimation("load", i);
			_.assign(this.search, _.cloneDeep(item.search));
		},
		overwriteFilter(item, i) {
			this.startBtnAnimation("overwrite", i);
			_.assign(item.search, _.cloneDeep(this.search));
			this.updateDigest();
		},
		removeFilter(index) {
			if(this.processing.remove[index]) {
				this.digest.search.splice(index, 1);
				this.updateDigest();
				this.processing.remove[index] = false;
			} else {
				this.$set(this.processing.remove, index, true);
			}
		},
		setNone(section) {
			this.search[section] = [];
		},
		setAll(section) {
			this.search[section] = this[section].map(x => x.id || x);
		},
		updateDigest() {
			this.$emit("updateDigest");
		},
		toggle() {
			this.expanded = !this.expanded;
		},
		delay: ms => new Promise(res => setTimeout(res, ms)),
	}
});