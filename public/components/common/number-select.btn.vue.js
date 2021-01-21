const NumberSelectBtn = Vue.component("NumberSelectBtn", {
	props: ["value", "label", "min", "max", "vertical", "block", "small"],
	template: `
        <div :class="block ? 'full-width' : ''">
            <v-btn
                @click="openDialog"
                :class="vertical ? 'number-selector' : ''"
                :block="block"
                :small="small"
                :color="CONST.inputColor"
                depressed
            >
                <label>{{ label }}</label>
                {{ value }}
            </v-btn>
            <v-dialog
                v-model="show"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
            >
                <v-card>
                    <v-card-title>
                        <v-btn text @click="hide">
                            <v-icon left>mdi-chevron-left</v-icon> Cancel
                        </v-btn>
                    </v-card-title>
                    <v-card-text class="text-center pt-4">
                    	<section-block>
							<v-row align="center" justify="space-around">
								<v-col cols="6">
									<div class="d-flex align-center">
										<v-text-field
											v-model="custom"
											label="Custom"
											solo
											light
											hide-details
											single-line
											dense
										></v-text-field>
										<v-btn
											@click="select(custom)"
											color="primary"
											class="ml-1"
										>
											<v-icon left>mdi-check</v-icon> Ok
										</v-btn>
									</div>
								</v-col>
							</v-row>
						</section-block>
						
						<section-block class="py-2">
							<v-btn
								v-for="num in numbers"
								@click="select(num)"
								large
								:color="getColor(num)"
								class="ma-1"
								:block="num === 0"
							>{{ num }}</v-btn>
						</section-block>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>
    `,
	data() {
		return {
			show: false,
			custom: 0
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.custom = val;
			}
		}
	},
	computed: {
		numbers() {
			const numbers = [];
			const min = parseInt(this.min) || 0;
			const max = parseInt(this.max) || 20;
			for (let i = min; i <= max; i++) {
				numbers.push(i);
			}
			return numbers;
		},
	},
	methods: {
		getColor(num) {
			if(num > 0) {
				return "green darken-2";
			} else if(num < 0) {
				return "orange darken-2";
			} else {
				return "blue";
			}
		},
		select(num) {
			this.$emit("update:value", num);
			this.hide();
		},
		openDialog() {
			this.show = true;
		},
		hide() {
			this.show = false;
		}
	}
});