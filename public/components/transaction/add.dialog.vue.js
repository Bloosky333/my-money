const SimulationDialog = Vue.component("SimulationDialog", {
	mixins: [TransactionMixin, SimulationMixin],
	props: ["show", "character"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card>
				<v-card-title>
					<v-btn text @click="close">
						<v-icon left>mdi-chevron-left</v-icon> Cancel
					</v-btn>
				</v-card-title>
				<v-card-text class="pt-8 font-weight-light">
					<v-simple-table>
						<thead>
							<tr>
								<th>Attack</th>
								<th class="text-right">Avg</th>
								<th class="text-right">Hits</th>
								<th class="text-right">Dmg</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Base</td>
								<td class="text-right">{{ baseDamage.avg | round }}</td>
								<td class="text-right">{{ baseDamage.hits | round }}</td>
								<td class="text-right">{{ baseDamage.total | round }}</td>
							</tr>
							<tr>
								<td>Extra Critical Damage</td>
								<td class="text-right">{{ criticalDamage.avg | round }}</td>
								<td class="text-right">{{ criticalDamage.hits | round }}</td>
								<td class="text-right">{{ criticalDamage.total | round }}</td>
							</tr>
							<tr v-for="dmg in extraDamage" v-if="dmg.total > 0">
								<td>
									{{ dmg.name }}
									<br/>
									<small>{{ dmg.value }}</small>
								</td>
								<td class="text-right">{{ dmg.avg | round }}</td>
								<td class="text-right">{{ dmg.hits | round }}</td>
								<td class="text-right">{{ dmg.total | round }}</td>
							</tr>
							<tr>
								<th class="py-3" colspan="3">Total</th>
								<td class="text-right py-3">{{ totalDamage | round }}</td>
							</tr>
						</tbody>
					</v-simple-table>
					
					<GChart
						type="PieChart"
						:data="chartData"
						:options="chartOptions"
					></GChart>
				</v-card-text>
			</v-card>
		</v-dialog>
    `,
	data() {
		return {
			chartOptions: {
				is3D: true,
				height: 300,
				pieHole: 0.2,
				backgroundColor: { fill:'transparent' },
				chartArea:{
					left: 40,
					top:0,
					width:'90%',
					height:'100%'
				},
				pieSliceTextStyle: {
					fontName: "Roboto",
					fontSize: 16,
				},
				legend: {
					alignment: "center",
					textStyle: {
						fontName: "Roboto",
						fontSize: 16,
						color: "white"
					}
				},
			}
		}
	},
	computed: {
		chartData() {
			const data = [];
			data.push(["Type", "Damage"]);
			data.push(["Base", this.baseDamage.total]);
			data.push(["Critical", this.criticalDamage.total]);

			_.forEach(this.extraDamage, dmg => {
				data.push([dmg.name, dmg.total]);
			})

			return data;
		},
	},
	methods: {
		close() {
			this.$emit("update:show", false);
		}
	}
});