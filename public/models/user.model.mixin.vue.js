const UserModelMixin = {
    mixins: [ModelMixin],
    data() {
        return {
            firebaseUser: null,
            currentUser: null,
            users: [],
            user: {},
            loading: false,
        }
    },
    methods: {
        newUser(user) {
            return {
                name: user.email,
                email: user.email,
                validated: false,
                admin: false,
            };
        },
        async getCurrentUser() {
            if (this.firebaseUser.uid && !this.currentUser) {
                this.currentUserRef = this.getRef(this.firebaseUser.uid, "users");
                await this.bindByRef(this.currentUserRef, "currentUser");

                if (!this.currentUser) {
                    await this.currentUserRef.set(this.newUser(this.firebaseUser));
                }
            }
            return this.currentUser;
        },
        bindUser(id, varName) {
            return this.bind(id, "users", varName || "user")
        },
        bindUsers(varName, filters) {
            return this.bindCollection("users", filters, varName || "users")
        },
        getUser(id) {
            return this.get(id, "users");
        },
        updateUser(id, data) {
            return this.update(id, data, "users");
        },
        goToUser(id) {
            this.$router.push('/users/' + id);
        },
        async login(email, password) {
            try {
                this.loading = true;
                await FireAuth.signInWithEmailAndPassword(email, password);
                this.loading = false;
                this.$router.push('/')
            } catch (error) {
                this.loading = false;
                this.$root.showToast(error, "error", 10000);
            }
        },
        async signup(email, password) {
            try {
                this.loading = true;
                await FireAuth.createUserWithEmailAndPassword(email, password);
                this.loading = false;
                this.$router.push('/')
            } catch (error) {
                this.loading = false;
                this.$root.showToast(error, "error", 10000);
            }
        },
        async logout() {
            try{
                await FireAuth.signOut();
                this.$router.push({path: '/login'});
            } catch(error) {
                this.$root.showToast(error, "error", 10000);
            }

        },
        async forgotPassword(email) {
            this.loading = true;
            try {
                await FireAuth.sendPasswordResetEmail(email);
                this.loading = false;
                return true;
            } catch (error) {
                this.loading = false;
                return false;
            }
        }
    }
};
