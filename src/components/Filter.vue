<template>
    <v-container>
      <v-radio-group v-model="cardType" @update:modelValue="handleRadio">
        <v-radio label="Monster Cards" value="monster"></v-radio>
        <v-radio label="Spell Cards" value="Spell Card"></v-radio>
        <v-radio label="Trap Cards" value="Trap Card"></v-radio>
      </v-radio-group>
  
      <v-select
        v-if="cardType === 'monster'"
        :items="monsterTypes"
        label="Monster Type"
        v-model="raceState"
        @update:modelValue="handleSelect"
      ></v-select>
  
      <v-select
        v-if="cardType === 'Spell Card'"
        :items="spellTypes"
        label="Spell Type"
        @update:modelValue="handleSelect"
      ></v-select>
  
      <v-select
        v-if="cardType === 'Trap Card'"
        :items="trapTypes"
        label="Trap Type"
        @update:modelValue="handleSelect"
      ></v-select>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      race:{
        type: String
      },
      cardType:{
        type: String
      }
    },
    data() {
      return {
        raceState: this.$props.race,
        cardType: this.$props.cardType,
        monsterTypes: ['Aqua', 'Beast', 'Beast-Warrior', 'Creator-God', 'Cyberse', 'Dinosaur', 'Divine-Beast', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Insect', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 'Thunder', 'Warrior', 'Winged Beast'],
        spellTypes: ['Normal', 'Field', 'Equip', 'Continuous', 'Quick-Play', 'Ritual'],
        trapTypes: ['Normal', 'Continuous', 'Counter']
      }
    },
    methods: {
      handleSelect(e) {
        this.$emit("update-race", e);
      },
      handleRadio(e){
        this.$emit("update-type", e);
      }
    }
  }
  </script>