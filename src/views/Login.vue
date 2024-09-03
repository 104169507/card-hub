<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Login</h1>
    <p class="text-center mb-4" v-theme="`secondary`">Please enter your email and password to log in.</p>
    <v-form class="p-5 rounded shadow">
      <div v-if="errMsg" class="alert alert-danger" role="alert">
        {{ errMsg }}
      </div>
      <div class="mb-3">
        <v-text-field label="Email" v-model="email" prepend-inner-icon="mdi-email" required></v-text-field>
      </div>
      <div class="mb-3">
        <v-text-field label="Password" v-model="password" type="password" prepend-inner-icon="mdi-lock" required></v-text-field>
      </div>
      <v-btn block @click="login">Log in</v-btn>
    </v-form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
export default {
  data() {
    return {
      email: '',
      password: '',
      errMsg: ''
    }
  },
  methods: {
    login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        // If the sign-in is successful, you can redirect the user to another route
        .then((data) => {
          console.log('Successfully registered!');
          this.$router.push('/');
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              this.errMsg = 'Invalid email'
              break
            case 'auth/user-not-found':
              this.errMsg = 'No account with that email was found'
              break
            case 'auth/wrong-password':
              this.errMsg = 'Incorrect password'
              break
            default:
              this.errMsg = 'Email or password was incorrect'
              break
          }
        });
    }
  }
}
</script>