const AccountLine = Vue.component("AccountLine", {
    props: ["account", "accounts", "categories"],
    template: `
        <section-block>
            <div class="d-flex align-center justify-space-between">
                <div>
                    <v-icon left class="mt-n1">{{ icon }}</v-icon>
                    {{ account.name }}
                </div>
                <div>{{ account.number }}</div>
            </div>
        </section-block>
    `,
    computed: {
        icon() {
            if(this.account.icon) {
                return this.account.icon;
            } else {
                return this.account.isCommonAccount ? "mdi-human-male-female" : "mdi-bank";
            }
        },
        category() {
            const id = this.filter.categoryID;
            if(id) {
                return _.find(this.categories, c => c.id === id);
            } else {
                return {};
            }
        }

    }
});