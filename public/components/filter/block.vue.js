const FilterBlock = Vue.component("FilterBlock", {
    props: ["section", "accounts", "categories"],
    template: `
        <section-block color="#252525" class="py-1">
            <section-title
                expandable="true"
                :expanded.sync="expanded"
                margin-bottom="1"
                margin-top="2"
            >{{ section.name }} ({{ section.filters.length }})</section-title>
            <v-expand-transition>
                <div v-if="expanded">
                    <filter-line
                        v-for="filter in section.filters"
                        :filter="filter"
                        :accounts="accounts"
                        :categories="categories"
                        @click.native="edit(filter)"
                    ></filter-line>
                </div>
            </v-expand-transition>
        </section-block>
    `,
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        edit(filter) {
            this.$emit("edit", "filter", filter);
        }
    },
});