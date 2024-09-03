import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAEfynIDMsDCsdSTZnE3vZx9tj9LBq0bcA",
  authDomain: "cos30043-cardhub.firebaseapp.com",
  projectId: "cos30043-cardhub",
  storageBucket: "cos30043-cardhub.appspot.com",
  messagingSenderId: "532127621671",
  appId: "1:532127621671:web:00c62425583fb1216f6402",
  measurementId: "G-C4G5RQ8MX8",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default createVuetify({
  icons: {
    defaultSet: "mdi",
  },
});
const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.directive("theme", {
  mounted(el, binding) {
    if (binding.value === 'primary') {
      el.style.color = 'red'
    } else if (binding.value === 'secondary') {
      el.style.color = 'gray'
    } else if (binding.value === 'tertiary') {
      el.style.color = 'blue'
    } else {
      el.style.color = 'black'
    }
  }
})
app.use(vuetify);
app.use(router);
app.mount("#app");
