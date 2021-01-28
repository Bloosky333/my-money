const CategoryDialog = Vue.component("CategoryDialog", {
	mixins: [CategoryModelMixin],
	props: ["show", "category"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<section-block class="px-4">
				<v-text-field
					label="Name"
					v-model="category.name"
				></v-text-field>
				
				<v-text-field
					label="Icon"
					v-model="category.icon"
					hide-details
				></v-text-field>
				<div><small class="text-caption grey--text">
					Use MDI icons. 
					Check <a href="https://materialdesignicons.com/" target="_blank"> materialdesignicons.com</a> 
					or use 
					<a href="https://chrome.google.com/webstore/detail/materialdesignicons-picke/edjaedpifkihpjkcgknfokmibkoafhme" target="_blank">
						Chrome extension
					</a>
				</small></div>
			
				<v-text-field
					label="Color"
					v-model="category.color"
					hide-details
				></v-text-field>
				<div><small class="text-caption grey--text">
					Use simple color names. ex: red, blue, green<br/>
					You can add darken-[1-4] or lighten-[1-5]. ex: red lighten-2<br/>
					<a href="https://vuetifyjs.com/en/styles/colors/#material-colors" target="_blank">Full list here</a>
				</small>
			</section-block>
			
			<v-btn 
				color="error"
				small
				text
				block
				@click="showConfirm=true"
				class="mt-8 mb-12"
			>
				<v-icon	small left>mdi-delete</v-icon> Delete
			</v-btn> 
			
			<confirm-dialog 
				:show.sync="showConfirm" 
				@confirm="deleteAndClose"
			></confirm-dialog>
		</dialog-block>
    `,
	data() {
		return {
			showConfirm: false,
		}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		}
	},
	computed: {

	},
	methods: {
		saveAndClose() {
			this.saveCategory(this.category);
			this.show = false;
		},
		deleteAndClose() {
			this.deleteFilter(this.category.id);
			this.show = false;
		}
	}
});