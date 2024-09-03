<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Sign up</h1>
    <p class="text-center mb-4" v-theme="`secondary`">Please enter your email and password to sign up.</p>
    <v-form class="p-5 rounded shadow">
      <div v-if="errMsg" class="alert alert-danger" role="alert">
        {{ errMsg }}
      </div>
      <div class="mb-3">
        <v-text-field label="Email" v-model="email" prepend-inner-icon="mdi-email" required></v-text-field>
      </div>
      <div class="mb-3">
        <v-text-field label="Password" v-model="password" type="password" prepend-inner-icon="mdi-lock"
          required></v-text-field>
      </div>
      <v-btn block @click="signup">Signup</v-btn>
    </v-form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { errorMessages } from 'vue/compiler-sfc';
export default {
  data() {
    return {
      email: '',
      password: '',
      errMsg:''
    }
  },
  methods: {
    async signup() {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Create a user profile document in Firestore
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          username: 'Customer',
          description: '',
          cardInCart: [],
          cardBought: [],
          FavCard: []
        });

        console.log('User registered and profile created!');
        this.$router.push('/');
      } catch (error) {
        this.errMsg = "Invalid signup credential"
      }
    },
  }
}
</script>

<style scoped></style>