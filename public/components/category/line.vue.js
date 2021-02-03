const CategoryLine = Vue.component("CategoryLine", {
    props: ["category"],
    template: `
        <section-block>
            <category-title :category="category">
        </section-block>
    `,
});
const CategoryTitle = Vue.component("CategoryTitle", {
    props: ["category"],
    template: `
        <div v-if="category" class="d-flex align-center">
            <v-icon 
                left 
                :color="color" 
            >{{ icon }}</v-icon>
            {{ category.name }}
        </div>
        <div v-else class="error--text d-flex align-center"">
           <v-icon 
                left 
                color="error" 
            >mdi-help-circle-outline</v-icon> No category
        </div>
    `,
    computed: {
        icon() {
            if(this.category.icon) {
                return this.category.icon;
            } else {
                return this.category.isExpense ? "mdi-cash-minus" : "mdi-cash-plus";
            }
        },
        color() {
            return this.category.isExpense ? "error" : "success";
        },
    }
});
