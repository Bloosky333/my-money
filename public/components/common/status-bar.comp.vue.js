const CharacterStatusBar = Vue.component('CharacterStatusBar', {
	mixins: [TransactionMixin],
	props: ["character", "page", "loaded"],
	template: `
        <v-card>
            <v-app-bar fixed height="70"  color="grey darken-4">   
				<div v-if="loaded" class="status-bar mt-10">
					<div class="status-title text-center">
						{{ character.name }}
						<small class="grey--text"> {{ classLevelText }}</small>
					</div>
					<v-row dense>
						<v-col cols="6" class="stat-bar">
							<div 
								class="circle green darken-2"
								:class="HPPercent > 0 ? 'green darken-2' : 'grey darken-4'"
							><v-icon>mdi-heart-pulse</v-icon></div>
							<v-progress-linear
								v-model="HPPercent"
								color="green darken-2"
								height="30"
								rounded
							>
								<template v-slot:default="{ value }">
									<span class="overline">{{ HPText }}</span>
								</template>
							</v-progress-linear>
						</v-col>
						<v-col cols="6" class="stat-bar right">
							<div 
								class="circle blue"
								:class="KIPercent > 0 ? 'blue' : 'grey darken-4'"
							><v-icon small>mdi-lightning-bolt</v-icon></div>
							<v-progress-linear
								v-model="KIPercent"
								color="blue"
								height="30"
								rounded
								reverse
							>
								<template v-slot:default="{ value }">
									<span class="overline">{{ KIText }}</span>
								</template>
							</v-progress-linear>
						</v-col>
					</v-row>
				</div>
				<div v-else class="status-bar status-title text-center">
					Please Select a character
				</div>
            </v-app-bar>
        </v-card>
    `,
	computed: {
		classLevelText() {
			return this._getClassLevelText(this.character);
		},
		HPPercent() {
			return Math.round(this.stats.HP.current / this.stats.HP.totalActive * 100);
		},
		HPText() {
			return this.stats.HP.current + " / " + this.stats.HP.totalActive;
		},
		KIPercent() {
			return Math.round(this.stats.KI.current / this.stats.KI.totalActive * 100);
		},
		KIText() {
			return this.stats.KI.current + " / " + this.stats.KI.totalActive;
		},
	},
});
