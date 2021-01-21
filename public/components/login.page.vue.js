const LoginPage = Vue.component("LoginPage", {
    mixins: [UserModelMixin],
    template: `
        <v-container fluid class="Login" style="max-width: 500px;">
            <div class="LoginContainer">
                <v-card height="100%" dark>
                    <v-card-text class="pa-10">
                        <div class="text-center">
                            <v-icon class="text-h1">mdi-piggy-bank-outline</v-icon>
                        </div>
                        <v-form
                            ref="form"
                            v-model="valid"
                            v-show="!showForgotMessage && !showForgotError"
                        >
                            <div class="text-h4 mb-8 font-weight-thin text-center">My Money</div>
                            
                            <v-text-field
                                v-model.trim="email"
                                label="Email"
                                :rules="emailRules"
                                required
                                light
                                solo
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show_password ? 'text' : 'password'"
                                :rules="[v => !!v || 'Password is required']"
                                label="Password"
                                counter
                                required
                                @click:append="show_password = !show_password"
                                light
                                solo
                            ></v-text-field>
                            <v-btn 
                                block 
                                rounded
                                color="primary"
                                class="mb-2 mt-4"
                                :disabled="!valid"
                                @click="login(email, password)"
                                large
                            >
                                Login
                            </v-btn>
                            
                            <v-btn 
                                block 
                                rounded
                                text
                                color="primary"
                                class="mb-2"
                                :disabled="!valid"
                                @click="signup(email, password)"
                            >
                                Signup
                            </v-btn>
                            
                            <v-btn 
                                block 
                                rounded
                                text
                                small
                                color="primary"
                                class="mb-2"
                                :disabled="!email"
                                @click="sendForgotEmail"
                            >
                                Forgot my password
                            </v-btn>
                        </v-form>
                        <div v-if="showForgotMessage" class="text-center">
                            <div class="text-h5 font-weight-light">
                                Email sent
                            </div>
                            <div class="text-overline font-weight-thin mt-2">
                                Please check your mailbox.
                            </div>
                            <v-btn 
                                rounded color="primary" 
                                @click="showForgotMessage=false"
                                class="my-10"
                            >Back</v-btn>
                        </div>
                        <div v-if="showForgotError" class="text-center">
                            <div class="text-h5 font-weight-light">
                                Something went wrong
                            </div>
                            <div class="text-overline font-weight-thin mt-2">
                                Check your email address or Signup if you're not registered yet.
                            </div>
                            <v-btn 
                                rounded color="primary" 
                                @click="showForgotError=false"
                                class="my-10"
                            >Back</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
                
                <div class="text--grey text-center overline mt-4">
                    <small >Next IT © 2021</small>
                </div>
            </div>
            <v-overlay :value="loading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </v-container>
    `,
    data() {
        return {
            email: "",
            password: "",
            stay_connected: false,
            show_password: false,
            showForgotMessage: false,
            showForgotError: false,
            valid: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
        }
    },
    methods: {
        async sendForgotEmail() {
            const res = await this.forgotPassword(this.email);
            if(res) {
                this.showForgotMessage = true;
            } else {
                this.showForgotError = true;
            }
        }
    }
});