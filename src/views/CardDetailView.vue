<template>
  <div class="container" v-if="loggedIn && !loading">
    <h1 class="text-center mb-4 mt-4">Card Details</h1>
    <p class="text-center" v-theme="`secondary`">Explore the details of your favorite cards</p>
    <div class="row border rounded p-3">
      <div class="card-image col-md-6 text-center">
        <img :src="card[0].card_images[0].image_url" :alt="card[0].name" class="img-fluid">
      </div>
      <div class="card-info col-md-6">
        <h2>{{ card[0].name }}</h2>
        <p v-if="isSpellOrTrapCard">
          Type: {{ card[0].type }} - Race: {{ card[0].race }}
        </p>
        <p v-else>
          Attribute: {{ card[0].attribute }} - Stars: {{ card[0].level }}
        </p>
        <p v-if="hasAttackAndDefense">
          ATK: {{ card[0].atk }} - DEF: {{ card[0].def }}
        </p>
        <p>{{ card[0].desc }}</p>
        <div class="d-flex align-items-center">
          <input type="number" min="1" v-model="quantity" class="form-control mr-2">
          <button @click="purchase" class="btn btn-primary">Purchase</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!loggedIn" class="text-center mt-5 d-flex align-items-center flex-column" id="error">
    <p class="lead">You have to log in to access this page</p>
    <div>
      <RouterLink to="/login" class="btn btn-primary">Login</RouterLink>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card.vue'
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

export default {
  components: {
    Card
  },
  data() {
    return {
      loggedIn: false,
      suggestCards: [],
      name: this.$route.params.name,
      card: [],
      quantity: 1,
      loading: true,
    };
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.loggedIn = false
      } else {
        this.loggedIn = true
        try {
          const fresponse = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params: { name: this.name } })
          this.card = fresponse.data.data
          console.log(fresponse.data)
        } catch (error) {
          console.error(error);
        }

        for (let i = 0; i < 4; i++) {
          try {
            const response = await axios.get('https://db.ygoprodeck.com/api/v7/randomcard.php')
            this.suggestCards.push(response.data)
            this.loading = false
          } catch (error) {
            console.error(error);
          }
        }
      }
    });
  },
  computed: {
    isSpellOrTrapCard() {
      return this.card[0].type === 'Spell Card' || this.card[0].type === 'Trap Card';
    },
    hasAttackAndDefense() {
      return this.card[0].atk && this.card[0].def;
    }
  },
  methods: {
    async purchase() {
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);
      // Fetch the current 'cardInCart' array from Firestore
      const docSnap = await getDoc(userDoc);
      let cardInCart = docSnap.data().cardInCart;

      // Find the card that the user wants to buy in the 'cardInCart' array
      let card = cardInCart.find(item => item.cardId === this.card[0].id);

      if (card) {
        // If the card is already in the cart, update its quantity
        card.quantity += this.quantity;
      } else {
        // If the card is not in the cart, add it
        cardInCart.push({
          cardId: this.card[0].id,
          quantity: this.quantity
        });
      }
      // Update the 'cardInCart' array in Firestore
      await updateDoc(userDoc, { cardInCart });
      console.log('Card added to cart successfully!');
      this.$router.push('/profile');
    },

  }
}
</script>

<style scoped>
.section {
  border-bottom: 1px solid #ccc;
  margin-bottom: 5em;
  padding-bottom: 5em;
}

img {
  max-height: 50vh;
}

#error {
  min-height: 50vh;
}
</style>