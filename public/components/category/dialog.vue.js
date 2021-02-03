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
				
				<v-btn-toggle
					v-model="category.isExpense"
					borderless
					color="orange darken-2"
				>
					<v-btn :value="false">
						<v-icon left>mdi-plus</v-icon> Income
					</v-btn>
					<v-btn :value="true">
						<v-icon left>mdi-minus</v-icon> Expense
					</v-btn>
				</v-btn-toggle>
				
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
			
<!--				Waiting vuetify new version -->
<!--				<v-color-picker-->
<!--					label="Chart color"-->
<!--					v-model="category.color"-->
<!--					flat-->
<!--					hide-canvas-->
<!--					hide-input-->
<!--					hide-mode-switch-->
<!--					hide-sliders-->
<!--					mode="hexa"-->
<!--					show-swatches-->
<!--				></v-color-picker>-->
				<v-text-field
					label="Chart color"
					v-model="category.color"
					hide-details
				></v-text-field>
				<div><small class="text-caption grey--text">
					Use simple HEX code. ex: #123456</a>
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
	methods: {
		saveAndClose() {
			this.saveCategory(this.category);
			this.show = false;
		},
		deleteAndClose() {
			this.deleteCategory(this.category.id);
			this.show = false;
		}
	}
});