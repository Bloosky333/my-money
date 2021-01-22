const ImportPage = Vue.component("ImportPage", {
	mixins: [TransactionModelMixin],
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
						color="orange"
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
			
			<div>
				<v-progress-linear
					color="orange"
					:buffer-value="buffer"
					v-model="progressPercent"
					stream
					height="25"
					dark
				>
					<strong>
						{{ progressUnit }}/{{ lines.length }}
						({{ Math.ceil(progressPercent) }}%)
					</strong>
				</v-progress-linear>
			</div>
			
			<section-title>3. Check your data</section-title>
			<import-line
				v-for="line in lines"
				:transaction="line.data"
				:status="line.status"
			></import-line>
        </div>
    `,
	data() {
		return {
			lines: [],
			bank: CONST.banks[0].name,
			buffer: 1,
			progressPercent: 0,
			progressUnit: 0,
			percentPerLine: 0,
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
				encoding: this.bankData.encoding,
				header: false,
				skipEmptyLines: true,
				complete: (results) => {
					const lines = results.data;
					lines.splice(0, this.bankData.headerLinesCount);
					this.lines = this.formatLines(lines);
				},
				error: (error) => {

				}
			});
		},
		formatLine(line) {
			line.amount = parseFloat(line.amount.replace(',', '.'));
			line.date = moment.utc(line.date, this.bankData.dateFormat).local().toDate();
			line.imported = true;
			return line;
		},
		formatLines(lines) {
			// TODO: Regroup par account
			const matches = this.bankData.match;
			return lines.map(line => {
				const data = {};
				_.forEach(matches, (index, field) => {
					data[field] = line[index];
				});
				return {
					data: this.formatLine(data),
					status: {
						processing: false,
						status: false
					}
				};
			});
		},
		transactionExists(line) {
			return !!_.find(this.transactions, t => t.communications === line.communications)
		},

		async importLine(line) {
			line.status.processing = true;
			if(this.transactionExists(line.data)) {
				line.status.status = 'ignored';
			} else {
				try{
					this.autoFillTransaction(line.data);
					await this.createTransaction(line.data);
					line.status.status = 'success';
				} catch {
					line.status.status = 'error';
				}
			}
			line.status.processing = false;

		},
		async startImport() {
			this.progressPercent = 0;
			this.progressUnit = 0;
			this.buffer = 100 / this.lines.length;
			for(let i=0; i<this.lines.length; i++) {
				await this.importLine(this.lines[i]);
				this.progressPercent += this.buffer;
				this.progressUnit ++;
			}
		},
	}
});