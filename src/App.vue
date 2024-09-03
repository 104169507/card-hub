<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light container">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"><img src="./components/icons/logo.png" alt="Logo"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
          aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/Profile">Profile</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/marketplace">Marketplace</RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item" v-if="!user">
              <RouterLink class="nav-link" to="/signup">Signup</RouterLink>
            </li>
            <li class="nav-item" v-if="!user">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item" v-if="user">
              <a class="nav-link" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>


  <RouterView />

  <div class="container mt-5 border-top">
    <footer class="py-5">
      <div class="row">
        <div class="col-12 col-md-4 col-lg-2">
          <h5>Home</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/">Home</RouterLink></li>
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/">Banner</RouterLink></li>
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/">Most favourites</RouterLink></li>
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/">About us</RouterLink></li>
          </ul>
        </div>

        <div class="col-12 col-md-4 col-lg-2">
          <h5>Profile</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/profile">Profile</RouterLink></li>
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/profile">Item</RouterLink></li>
          </ul>
        </div>

        <div class="col-12 col-md-4 col-lg-2">
          <h5>Marketplace</h5>
          <ul class="nav flex-column">
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/marketplace">Search</RouterLink></li>
            <li class="nav-item mb-2"><RouterLink class="nav-link p-0 text-muted" to="/marketplace">Product</RouterLink></li>
          </ul>
        </div>

        <div class="col-12 col-md-12 col-lg-4 offset-lg-1">
          <form>
            <h5>Subscribe to our newsletter</h5>
            <p>Monthly digest of whats new and exciting from us.</p>
            <div>
              <v-text-field v-model="email" label="Email" prepend-inner-icon="mdi-email"></v-text-field>
              <button class="btn btn-outline-success" type="button">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <div class="d-flex justify-content-between py-4 my-4 border-top">
        <p>&copy; 2024 Nguyen Quang Huy. All rights reserved.</p>
        <ul class="list-unstyled d-flex">
          <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#twitter" />
              </svg></a></li>
          <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#instagram" />
              </svg></a></li>
          <li class="ms-3"><a class="link-dark" href="#"><svg class="bi" width="24" height="24">
                <use xlink:href="#facebook" />
              </svg></a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { watchEffect } from 'vue';
export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.user = null;
        this.$router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
  },
  mounted() {
    const auth = getAuth();
    watchEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
        this.user = currentUser;
      });
    });
  },
};
</script>


<style scoped>
.navbar {
  border-bottom: solid 1px lightgray;
}
</style>
