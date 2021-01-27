const ImportPage = Vue.component("ImportPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "categories", "accounts", "filters"],
	template: `
        <v-row>
        	<v-col cols="12" md="5" lg="4" class="py-0">
				<section-title>Choose your bank</section-title>
				<section-block>
					<v-btn-toggle v-model="bank" borderless color="orange darken-2">
						<v-btn
							v-for="b in banks"
							:value="b"
						>{{ b }}</v-btn>
					</v-btn-toggle>
				</section-block>
				
				<template v-if="bank">
					<section-title>Select your file</section-title>
					<section-block>
						<div class="d-flex align-center">
							<v-file-input
								solo
								hide-details
								single-line
								@change="onFileSelect"
								color="orange darken-2"
								flat
							></v-file-input>
							<v-btn
								color="orange darken-2"
								@click="startImport"
								large
								outlined
								:disabled="!lines.length || parsing"
								:loading="parsing"
								class="ml-2"
							><v-icon left>mdi-check-bold</v-icon> Import</v-btn>
						</div>
					</section-block>
				</template>
				<div v-else class="error--text mt-2">Select a bank/source.</div>
			
				<v-progress-linear
					v-if="lines.length"
					color="orange darken-2"
					:buffer-value="buffer"
					:value="progressPercent"
					stream
					height="25"
					dark
				>
					<strong>
						{{ progressUnit }}/{{ lines.length }}
						({{ Math.floor(progressPercent) }}%)
					</strong>
				</v-progress-linear>
			</v-col>
			<v-col cols="12" md="7" lg="8" class="py-0">
				<template v-if="lines.length">
					<section-title>Your data</section-title>
					<v-tabs
						v-model="tab"
						icons-and-text
						show-arrows
						dark
					>
						<v-tabs-slider></v-tabs-slider>
						<v-tab v-for="t in tabs" :class="t.color + '--text'">
							{{ t.name | capitalize }} ({{ linesPerStatus[t.name].length }})
							<v-icon :color="t.color">{{ t.icon }}</v-icon>
						</v-tab>
						
						<v-tab-item v-for="t in tabs">
							<import-line
								v-for="line in truncatedLinesPerStatus[t.name]"
								:transaction="line.data"
								:error="line.error"
							></import-line>
						</v-tab-item>
					</v-tabs>
					
					<section-block>
						<v-btn text block @click="showMore">Show more</v-btn>
					</section-block>
				</template>
			</v-col>
        </v-row>
    `,
	data() {
		return {
			lines: [],
			parsing: false,
			bank: false,
			buffer: 1,
			progressPercent: 0,
			progressUnit: 0,
			lineShown: 10,
			tabs: [
				{
					name: "pending",
					icon: "mdi-pause-circle",
					color: "white",
				},
				{
					name: "success",
					icon: "mdi-check-circle",
					color: "success",
				},
				{
					name: "error",
					icon: "mdi-alert-circle",
					color: "error",
				},
				{
					name: "ignored",
					icon: "mdi-skip-next-circle",
					color: "grey",
				},

			],
			tab: "pending"
		}
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
		truncatedLinesPerStatus() {
			const perStatus = {
				pending: [],
				success: [],
				error: [],
				ignored: []
			};

			_.forEach(this.linesPerStatus, (lines, status) => {
				perStatus[status] = lines.slice(0, this.lineShown);
			});

			return perStatus;
		},
		linesPerStatus() {
			const perStatus = {
				pending: [],
				success: [],
				error: [],
				ignored: []
			};

			this.lines.forEach(line => {
				if (!line.status) {
					perStatus.pending.push(line);
				} else {
					perStatus[line.status].push(line);
				}
			});

			return perStatus;
		},
	},
	methods: {
		showMore() {
			this.lineShown += 10;
		},
		onFileSelect(file) {
			if (file) {
				this.parsing = true;
				Papa.parse(file, {
					delimiter: this.bankData.delimiter,
					encoding: this.bankData.encoding,
					header: false,
					skipEmptyLines: true,
					complete: async (results) => {
						this.lineShown = 10;
						const lines = results.data;
						lines.splice(0, this.bankData.headerLinesCount);
						this.lines = this.formatLines(lines);

						await this.delay(1000);
						this.parsing = false;
					},
					error: (error) => {
						console.error("CSV File parsing error : ", error);
					}
				});
			} else {
				this.lines = [];
			}
		},
		getTransactionID(line) {
			const formatter = this.bankData.idFormatter;
			if (typeof formatter === "function") {
				return formatter(line);
			} else {
				return line[formatter];
			}
		},
		formatLine(line) {
			line.transactionID = this.getTransactionID(line);
			if (this.bankData.formatter) {
				this.bankData.formatter(line);
			}

			line.amount = parseFloat(line.amount.replace(',', '.'));
			line.date = moment.utc(line.date, this.bankData.dateFormat).local().toDate();
			line.imported = true;
			return line;
		},
		formatLines(lines) {
			const matches = this.bankData.match;
			return lines.map(line => {
				const data = {};
				_.forEach(matches, (index, field) => {
					data[field] = line[index];
				});

				return {
					data: this.formatLine(data),
					status: false,
					error: "",
				};
			});
		},
		transactionExists(line) {
			return !!_.find(this.transactions, t => t.communications === line.communications)
		},
		async importLine(line) {
			if (this.transactionExists(line.data)) {
				await this.delay(100);
				line.status = 'ignored';
			} else {
				try {
					this.autoFillTransaction(line.data);
					await this.saveTransaction(line.data);
					line.status = 'success';
				} catch (error) {
					line.status = 'error';
					line.error = error;
				}
			}
		},
		async startImport() {
			this.progressPercent = 0;
			this.progressUnit = 0;
			this.buffer = 100 / this.lines.length;
			for (let i = 0; i < this.lines.length; i++) {
				await this.importLine(this.lines[i]);
				this.progressPercent += this.buffer;
				this.progressUnit++;
			}
			this.$emit('refresh');
		},
	}
});