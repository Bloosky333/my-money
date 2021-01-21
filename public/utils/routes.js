const VueRoutes = [
    {
        to: '/',
        component: MainPage,
    },
    {
        text: 'Login',
        to: '/login',
        component: LoginPage,
        hide: true,
        public: true
    },
];

function VueFlatRoutes() {
    const createRoute = route => {
        const meta = route.public ? {} : {requiresAuth: true};
        return {
            path: route.to,
            component: route.component,
            beforeEnter: route.beforeEnter,
            meta: meta
        };
    };
    const routes = [];

    VueRoutes.forEach((route) => {
        if (route.to && route.component) {
            routes.push(createRoute(route));
        }
        if (route.subLinks) {
            route.subLinks.forEach((subroute) => {
                if (subroute.to && subroute.component) {
                    routes.push(createRoute(subroute));
                }
            });
        }
    });

    return routes;
}