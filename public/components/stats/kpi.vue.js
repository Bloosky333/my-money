const KpiBlock = Vue.component("KpiBlock", {
	mixins: [StatsMixin],
	props: ["digest", "search"],
	template: `
		<section-block color="#252525">
			<div class="d-flex justify-space-around mb-2 ">
				<v-btn-toggle 
					v-model="year" 
					rounded
					mandatory
					color="orange darken-2"
				>
					<v-btn 
						v-for="year in years"
						small
						:value="year"
					>{{ year }}</v-btn> 
				</v-btn-toggle>
			</div>
			<v-row dense>
				<v-col cols="6" v-for="kpi in kpis" class="py-0">
					<kpi-item 
						:title="kpi.title"
						:stat="kpi.stat"
						:year="year"
						:data="data"
					></kpi-item>
				</v-col>
			</v-row>
		</section-block>
    `,
	data() {
		return {
			year: String(moment().year()),
			kpis: [
				{
					title: "Avg. income",
					stat: "income"
				},
				{
					title: "Avg. expense",
					stat: "expense"
				},
			],
		}
	},
	computed: {
		years() {
			const years = [];
			_.forEach(this.data, (item, year) => {
				years.push(year);
			})
			return years;
		},
		data() {
			const accountsByPeriod = this.getAccountsByPeriod();
			const result = {};

			_.forEach(accountsByPeriod, (accounts, year) => {
				if(!isNaN(year)) {
					result[year] = {
						income: 0,
						expense: 0,
						total: 0,
						months: []
					};
					_.forEach(accounts, account => {
						result[year].income += account.income;
						result[year].expense += Math.abs(account.expense);
						result[year].total += account.total;
						_.forEach(account.months, month => {
							if (!result[year].months.includes(month)) {
								result[year].months.push(month);
							}
						})
					});

					result[year].average = result[year].total / result[year].months.length;
				}
			});
			return result;
		},
	},
	methods: {}
});

const KpiItem = Vue.component("KpiItem", {
	props: ["data", "year", "stat", "title"],
	template: `
		<section-block class="text-center">
			<div class="text-overline font-weight-light grey--text">{{ title }}</div>
			<div class="text-h4">{{ selectedYear | round }}€</div>
			<div class="text-caption" :class="getColor(progression)">{{ progression | signedNumber }}%</div>
		</section-block>
    `,
	computed: {
		selectedYear() {
			return this.getStat(this.year);
		},
		previousYear() {
			const prevYear = String(parseInt(this.year) - 1);
			return this.getStat(prevYear);
		},
		progression() {
			if(this.previousYear && this.selectedYear) {
				const diff = this.selectedYear - this.previousYear;
				const percent = diff / this.selectedYear * 100
				return _.round(percent, 2);
			}else {
				return "?";
			}
		},
	},
	methods: {
		getStat(year) {
			if (this.data[year]) {
				return this.data[year][this.stat];
			} else {
				return 0;
			}
		},
		getColor(value) {
			return value > 0 ? "success--text" : "error--text";
		}
	}
});