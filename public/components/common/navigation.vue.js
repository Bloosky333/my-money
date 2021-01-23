const Navigation = Vue.component("Navigation", {
	props: ["page"],
	template: `
		<div>
			<v-bottom-navigation
				v-model="page"
				grow
				dark
				app
				active-class="orange--text"
				background-color="grey darken-4"
			>
				<v-btn v-for="p in pages" :value="p.name">
					<span>{{ p.name | capitalize }}</span>
					<v-icon>{{ p.icon }}</v-icon>
				</v-btn>
			</v-bottom-navigation>
		</div>
    `,
	data() {
		return {
			pages: [
				{name: "stats", icon: "mdi-chart-areaspline"},
				{name: "transactions", icon: "mdi-swap-horizontal-bold"},
				{name: "import", icon: "mdi-database-import"},
				{name: "params", icon: "mdi-cog"},
			]
		}
	},
	watch: {
		page(page) {
			this.$vuetify.goTo(0);
			this.$emit("update:page", page);
		}
	}
});