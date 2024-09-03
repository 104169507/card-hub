<template>
  <div class="card flex-grow-1">
    <img class="card-img-top" :src="`https://images.ygoprodeck.com/images/cards/${card.id}.jpg`" :alt="card.name">
    <div class="card-body">
      <h5 class="card-title">{{ card.name }}</h5>
      <h6 v-if="card.card_sets && card.card_sets[0]" class="card-subtitle mb-2 text-muted">Rarity:
        {{ card.card_sets[0].set_rarity }}</h6>
      <h6 v-else>Rarity: None</h6>
      <p class="card-text fw-bold">Price: {{ card.card_prices[0].cardmarket_price }}€</p>
      <div class="btn-group d-flex justify-content-center">
        <div><router-link :to="`/card/${card.name}`" class="btn btn-primary">Add to cart</router-link></div>
        <div><Button ref="favButton" @click="ToggleFavourite()" class="btn" v-if="isUserAuthenticated"><i
              class="fas fa-heart"></i></Button></div>
      </div>
    </div>
  </div>
</template>



<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { updateDoc, arrayUnion, getFirestore, doc, arrayRemove, getDoc } from 'firebase/firestore';
export default {
  data() {
    return {
      isUserAuthenticated: false,
      user: null,
    };
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.isUserAuthenticated = true;
    })
  },
  async updated() {
    if (this.user) {
      await this.checkFavourite();
    }
  },
  methods: {
    async checkFavourite() {
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        let userData = docSnap.data();
        let favButton = this.$refs.favButton;
        if (userData.FavCard.includes(this.card.id)) {
          favButton.style.color = "red";
        } else {
          favButton.style.color = "grey";
        }
      }
    },
    async ToggleFavourite() {
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);
      let favButton = this.$refs.favButton;
      if (favButton.style.color == "red") {
        await updateDoc(userDoc, {
          FavCard: arrayRemove(this.card.id)
        });
        favButton.style.color = "grey"
      }
      else {
        await updateDoc(userDoc, {
          FavCard: arrayUnion(this.card.id)
        });
        favButton.style.color = "red"
      }
    },
  }
}
</script>
