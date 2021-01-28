Vue.use(VueRouter);
Vue.use(Vuefire.firestorePlugin);
// Vue.use(VueGoogleCharts);

const routes = VueFlatRoutes();
const router = new VueRouter({routes});
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
    const currentUser = FireAuth.currentUser;

    if (requiresAuth && !currentUser) next({path: '/login', query: {redirect: to.fullPath}});
    else next();
});

let CharacterSheetApp;
firebase.auth().onAuthStateChanged(user => {
    if(!CharacterSheetApp) {
        CharacterSheetApp = new Vue({
            mixins: [UserModelMixin],
            el: '#my-money',
            router,
            vuetify: new Vuetify({
                theme: {
                    dark: true,
                },
            }),
            data() {
                return {
                    firebaseUser: user,
                }
            },
            watch: {
                "firebaseUser.uid": {
                    immediate: true,
                    async handler(uid) {
                        if(uid) {
                            this.loading = true;
                            await this.getCurrentUser();

                        } else {
                            this.loading = false;
                        }
                    }
                }
            },
            computed: {
                userID() {
                    return this.currentUser ? this.currentUser.id : false;
                },
            },
            methods: {
                processLogout() {
                    this.loading = true;
                    this.$unbind("currentUser");
                    this.logout();
                    this.loading = false;
                }
            }
        });
    } else {
        CharacterSheetApp.$set(CharacterSheetApp, "firebaseUser", user);
    }
});
// Vue.config.devtools = true;