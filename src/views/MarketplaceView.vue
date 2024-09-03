<template>
  <div class="container">
    <h1 class="text-center mt-5">Marketplace</h1>
    <p class="text-center" v-theme="`secondary`">Shop for your favourite card</p>

    <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify"></v-text-field>
    <Filter :race="race" @update-race="updateRace" @update-type="updateType"/>
    <div v-if="loading">Loading...</div>
    <div v-if="!error" class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-12 d-flex align-items-stretch mb-2" v-for="card in getItems"
          :key="card.id">
          <Card :card="card" />
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <Paginate :page-count="getPageCount" :click-handler="clickCallback" :prev-text="'Prev'" :next-text="'Next'"
          :container-class="'pagination'" />
      </div>
    </div>
    <div v-if="error" class="text-center">
      <h2>No matching items found.</h2>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import axios from 'axios';
import Card from '../components/Card.vue'
import Filter from '../components/Filter.vue'

export default {
  data() {
    return {
      cards: [],
      loading: true,
      perPage: 20,
      currentPage: 1,
      search: "",
      race: "",
      error:"",
      type:""
    };
  },
  components: {
    Card,
    Filter,
    Paginate
  },
  async created() {
    try {
        this.loading = true;
        let params = {};
        this.search && (params["fname"] = this.search);
        this.race && (params["race"] = this.race);
        this.type != "monster" && this.type && (params["type"] = this.type);
        const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params });
        this.cards = response.data.data;
        this.loading = false;
        console.log(params);
      } catch (error) {
        console.error(error);
      }
  },
  watch: {
    search() {
      this.fetchCards();
    },
    race() {
      this.fetchCards();
    },
    type(){
      this.fetchCards();
    }
  },
  methods: {
    async fetchCards() {
      try {
        let params = {};
        this.search && (params["fname"] = this.search);
        this.type != "monster" && this.type && (params["type"] = this.type);
        this.race && (params["race"] = this.race);
        
        const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', { params });
        console.log(response.data.args);
        this.cards = response.data.data;
        this.error = false;
        console.log(params);
      } catch (error) {
        this.error = true;
        console.error(error);
      }
    },
    //sets the clicked page
    clickCallback(pageNum) {
      this.currentPage = Number(pageNum);
    },
    updateRace(newRace) {
      this.race = newRace;
    },
    updateType(newType){
      this.type = newType;
      this.race = "";
      if(this.type == "monster"){
        this.fname = "";
      }
    }
  },
  computed: {
    // returns the data according to the page number
    getItems() {
      let current = this.currentPage * this.perPage;
      let start = current - this.perPage;
      return this.cards.slice(start, current);
    },
    //returns total number of pages required according to the total rows of data
    getPageCount() {
      return Math.ceil(this.cards.length / this.perPage);
    },
  },
};
</script>