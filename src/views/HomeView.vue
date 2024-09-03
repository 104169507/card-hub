<template>
  <div id="home" class="container">
    <!-- Hero Banner -->
    <div class="hero mx-auto section">
      <div class="container-fluid py-5 d-flex md-align-items-center row">
        <div class="p-5 mb-4 rounded-3 col">
          <div class="container-fluid py-5">
            <h1 class="display-5 fw-bold">Welcome to Card Hub</h1>
            <p class="fs-4">Browse thousands of cards for your favourite deck on our shop, a community where
              players and collectors can purchase their favorite yugioh cards!</p>
            <RouterLink class="btn btn-outline-primary" to="/marketplace">Marketplace</RouterLink>
          </div>
        </div>
        <div class="col-md-3">
          <img class="img-fluid" src="https://images.ygoprodeck.com/images/cards/46986421.jpg" alt="hero image">
        </div>
      </div>
    </div>


    <!-- Most Popular Cards -->
    <div class="container my-5 section">
      <h2 class="text-center mb-4">Most Popular Cards</h2>
      <div class="row justify-content-around">
        <div class="col-md-6 col-lg-3 col-sm-12 d-flex align-items-stretch" v-for="card in cards" :key="card.id">
          <Card :card="card" />
        </div>
      </div>
    </div>




    <!-- About Us -->
    <div class="container-fluid my-5 section">
      <h2 class="text-center mb-4">About Us</h2>
      <p class="lead text-center">
        Welcome to Card Hub, the premier destination for YuGiOh card enthusiasts. We're a dedicated team of collectors
        and players just like you, and we've created this platform to make it easy for everyone to find, buy, and sell
        their favorite cards.
      </p>
      <p class="text-center">
        Whether you're a seasoned player looking for that elusive card to complete your deck, or a new collector
        starting your journey into the world of YuGiOh, we've got you covered. Our extensive collection includes cards
        from all eras and rarities, and our user-friendly platform makes it easy to find exactly what you're looking
        for.
      </p>
    </div>
  </div>
</template>

<script>
import Card from '../components/Card.vue'
import axios from 'axios';

export default {
  components: {
    Card
  },
  data() {
    return {
      cards: []
    };
  },
  async created() {
    for (let i = 0; i < 4; i++) {
      try {
        const response = await axios.get('https://db.ygoprodeck.com/api/v7/randomcard.php');
        this.cards.push(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  },
}
</script>

<style scoped>
.section {
  border-bottom: 1px solid #ccc;
  margin-bottom: 5em;
  padding-bottom: 5em;
}
.img{
  height: 20vh;
}
</style>