const ImportPage = Vue.component("ImportPage", {
	mixins: [],
	props: ["transactions"],
	template: `
        <div>
        	<section-title>1. Choose your bank</section-title>
			<section-block>
				<v-btn-toggle v-model="bank" mandatory color="orange">
					<v-btn
						v-for="b in banks"
						:value="b"
						block
					>{{ b }}</v-btn>
				</v-btn-toggle>
			</section-block>
			
			<section-title>2. Select your file</section-title>
			<section-block>
				<div class="d-flex align-center">
					<v-file-input
						solo
						hide-details
						single-line
						@change="onFileSelect"
					></v-file-input>
					<v-btn
						color="orange"
						@click="startImport"
						large
						outlined
						:disabled="!lines.length"
					><v-icon left>mdi-check-bold</v-icon> Import</v-btn>
				</div>
			</section-block>
			
			<section-title>3. Check your data</section-title>
			<section-block>
				<v-data-table
					:headers="headers"
					:items="lines"
					dense
					fixed-header
					:mobile-breakpoint="400"
				></v-data-table>
			</section-block>
        </div>
    `,
	data() {
		return {
			lines: [],
			bank: CONST.banks[0].name,
		}
	},
	created() {
	},
	computed: {
		banks() {
			return CONST.banks.map(bank => bank.name);
		},
		bankData() {
			return _.find(CONST.banks, b => b.name === this.bank);
		},
		headers() {
			const headers = [];
			_.forEach(CONST.transactionHeaders, (title, field) => {
				headers.push({
					text: title,
					value: field,
				});
			});
			return headers;
		},
	},
	methods: {
		onFileSelect(file) {
			Papa.parse(file, {
				delimiter: this.bankData.delimiter,
				header: false,
				skipEmptyLines: true,
				complete: (results) => {
					const lines = results.data;
					lines.shift();
					this.lines = this.formatLines(lines);
				},
				error: (error) => {

				}
			});
		},
		formatLines(lines) {
			const matches = this.bankData.match;
			return lines.map(line => {
				const result = {};
				_.forEach(matches, (index, field) => {
					result[field] = line[index];
				});
				return result;
			})
		},
		startImport() {

		},
	}
});