<template>
  <div class="container mt-5" v-if="loggedIn">
    <h1 class="text-center mb-4">Profile Page</h1>
    <div class="card mb-4 w-100">
      <div class="card-header">
        <h3>User Information</h3>
      </div>
      <div class="card-body">
        <h5 class="card-title">Username: {{ username }}</h5>
        <p class="card-text">Email: {{ email }}</p>
        <div v-if="nameError && isEditing" class="alert alert-danger" role="alert">
          {{ nameError }}
        </div>
        <button v-if="!isEditing" @click="editUsername" class="btn btn-primary">Edit Username</button>
        <div v-if="isEditing" class="mt-2">
          <input type="text" v-model="newUsername" placeholder="Enter new username" class="form-control">
          <button @click="submitUsername" class="btn btn-success mt-2">Submit</button>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="favorites-tab" data-bs-toggle="tab" data-bs-target="#favorites"
              type="button" role="tab" aria-controls="favorites" aria-selected="true">Favorites</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="bought-tab" data-bs-toggle="tab" data-bs-target="#bought" type="button"
              role="tab" aria-controls="bought" aria-selected="false">Bought</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="cart-tab" data-bs-toggle="tab" data-bs-target="#cart" type="button" role="tab"
              aria-controls="cart" aria-selected="false">Cart</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="favorites" role="tabpanel" aria-labelledby="favorites-tab">
            <ul class="list-group">
              <li v-for="card in favorites" :key="card.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ card.name }}</span> <!-- display the card name here -->
                  <router-link :to="`/card/${card.name}`" class="btn btn-primary">View</router-link>
                </div>
              </li>
            </ul>
          </div>
          <div class="tab-pane fade" id="bought" role="tabpanel" aria-labelledby="bought-tab">
            <ul class="list-group">
              <li v-for="card in cardBought" :key="card.cardId" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ card.name }} x{{ card.quantity }}</span> <!-- display the card name and quantity here -->
                  <span>{{ new Date(card.date).toString() }}</span> <!-- display the purchase date here -->
                </div>
              </li>
            </ul>
          </div>
          <div class="tab-pane fade" id="cart" role="tabpanel" aria-labelledby="cart-tab">
            <ul class="list-group">
              <li v-for="card in cart" :key="card.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <span>{{ card.name }}</span>
                  <div class="d-flex justify-content-between">
                    <input type="number" min="1" v-model="card.quantity" class="form-control mr-2" style="width: 70px;">
                    <button @click="purchase(card)" class="btn btn-primary mr-2">Purchase</button>
                    <button @click="remove(card)" class="btn btn-danger">Remove</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
export default {
  data() {
    return {
      isEditing: false,
      newUsername: '',
      nameError: '',
      loggedIn: false,
      username: '',
      email: '',
      favorites: [],
      cart: [],
      cardBought: []
    }
  },
  async mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.loggedIn = true
        const db = getFirestore();
        const userDoc = doc(db, 'users', getAuth().currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          let userData = docSnap.data()
          this.username = userData.username
          this.email = getAuth().currentUser.email
          await this.getFavoriteCards(userData);
          await this.getCartCards(userData);
          await this.getBoughtCards(userData);
        }
      }
      else {
        this.loggedIn = false
      }
    })

  },
  methods: {
    //get favourite cards
    async getFavoriteCards(userData) {
      for (let cardId of userData.FavCard) {
        try {
          const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params: { id: cardId } });
          this.favorites.push(response.data.data[0]);  // add card details to favorites
        } catch (error) {
          console.error(error);
        }
      }
    },
    //get cards in cart
    async getCartCards(userData) {
      for (let item of userData.cardInCart) {
        try {
          const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params: { id: item.cardId } });
          let card = response.data.data[0];
          card.quantity = item.quantity;  // add quantity to the card object
          this.cart.push(card);  // add card details to cart
        } catch (error) {
          console.error(error);
        }
      }
    },

    async getBoughtCards(userData) {
      for (let item of userData.cardBought) {
        try {
          const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params: { id: item.cardId } });
          let card = response.data.data[0];
          card.quantity = item.quantity;  // add quantity to the card object
          card.date = item.date;
          this.cardBought.push(card);  // add card details to cardBought
        } catch (error) {
          console.error(error);
        }
      }
    },

    async purchase(card) {
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);
      // Create a new object representing the purchased card
      const purchasedCard = {
        cardId: card.id,
        quantity: card.quantity,
        date: new Date().toISOString()  // current date and time
      };

      try {
        // Fetch the current 'cardInCart' and 'cardBought' arrays from Firestore
        const docSnap = await getDoc(userDoc);
        let cardInCart = docSnap.data().cardInCart;
        let cardBought = docSnap.data().cardBought || [];

        // Remove the card from the 'cardInCart' array
        cardInCart = cardInCart.filter(item => item.cardId !== card.id);
        // Add the card to the 'cardBought' array
        cardBought.push(purchasedCard);

        // Update the 'cardInCart' and 'cardBought' arrays in Firestore
        await updateDoc(userDoc, { cardInCart, cardBought });

        // Update the 'cart' data property
        this.cart = this.cart.filter(item => item.id !== card.id);
        let boughtCard = { ...card, date: purchasedCard.date };
        this.cardBought.push(boughtCard);

        console.log('Card purchased successfully!');
      } catch (error) {
        console.error('Error purchasing card:', error);
      }
    },

    async remove(card) {
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);

      try {
        // Fetch the current 'cardInCart' array from Firestore
        const docSnap = await getDoc(userDoc);
        let cardInCart = docSnap.data().cardInCart;
        // Remove the card from the 'cardInCart' array
        cardInCart = cardInCart.filter(item => item.cardId !== card.id);
        await updateDoc(userDoc, { cardInCart });

        // Update the 'cart' data property
        this.cart = this.cart.filter(item => item.id !== card.id);

        console.log('Card removed from cart successfully!');
      } catch (error) {
        console.error('Error removing card from cart:', error);
      }
    },

    isValidUsername(username) {
      const regex = /^[a-zA-Z0-9_]{1,20}$/;
      return regex.test(username);
    },

    editUsername(){
      this.isEditing = true;

    },

    async submitUsername() {
      if (!this.isValidUsername(this.newUsername)) {
        this.nameError = "Invalid name"
        return;
      }
      this.username = this.newUsername;
      this.isEditing = false;
      const db = getFirestore();
      const userDoc = doc(db, 'users', getAuth().currentUser.uid);

      try {
        await updateDoc(userDoc, { username: this.newUsername });
        console.log('Username changed!');
        this.newUsername = '';
      } catch (error) {
        console.error('Error changing name:', error);
      }
    }
  },
}
</script>

<style scoped>
#error {
  min-height: 50vh;
}
</style>
