Vue.use(VueRouter);
Vue.use(Vuefire.firestorePlugin);
Vue.use(VueGoogleCharts);

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
                    loading: true,
                    autoSaveDelay: 500
                }
            },
            watch: {
                "firebaseUser.uid": {
                    immediate: true,
                    async handler(uid) {
                        if(uid) {
                            this.loading = true;
                            await this.getCurrentUser();
                        }
                        this.loading = false;
                    }
                }
            },
            computed: {
                isAdmin() {
                    return this.currentUser && this.currentUser.admin;
                },
                userID() {
                    return this.currentUser.id;
                },
            },
            methods: {
                selectCharacter(id) {
                    this.$set(this.currentUser, "character", id);
                    return this.updateUser(this.userID, this.currentUser);
                },
                showToast(message, type, timeout) {
                    this.$refs.toast.show(message, type, timeout);
                },
            }
        });
    } else {
        CharacterSheetApp.$set(CharacterSheetApp, "firebaseUser", user);
    }
});
// Vue.config.devtools = true;