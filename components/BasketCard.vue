<template>
  <div class="row" v-if="card.inbasket">
    <div class="card-header container-fluid text-center">Product</div>
    <div class="row main align-items-center">
      <div class="col-2"><img class="img-fluid" src="https://picsum.photos/200" alt="Product Photo"></div>
      <div class="col">
        <div class="row">{{ card.name }}</div>
      </div>
      <div class="col">
        <button class="btn btn-outline-secondary btn-sm float-end" :disabled="!(card.basketquantity>1)" @click="dec">-</button>
        <div class="container-fluid text-center border">
          <a href="#">{{ card.basketquantity }}</a>
        </div>
        <button class="btn btn-outline-secondary btn-sm float-end" style="margin-top: 0" @click="inc">+</button>
      </div>
      <div class="col">&euro;<a data-testid="basketPrices">{{ card.basketprice }}</a> <span class="close"><button
          class="btn btn-outline-secondary btn-sm float-end" @click="del">Delete</button></span></div>
    </div>
  </div>
</template>

<script>
import {changeProduct} from "../api/apiCalls";
import {DECREASE, INCREASE, REMOVE} from "../locales/util";

export default {
  name: "BasketCard",
  props: {
    card: Object
  },
  emits: ['increase', 'decrease', 'remove'],
  methods: {
    async inc() {
      const inc = await changeProduct(INCREASE, this.card.name);
      if (inc.status === 200) {
        await this.$emit("increase");
      } else {
        //fuck
      }
    },
    async dec() {
      const inc = await changeProduct(DECREASE, this.card.name);
      if (inc.status === 200) {
        await this.$emit("decrease");
      } else {
        //fuck
      }
    },
    async del() {
      const inc = await changeProduct(REMOVE, this.card.name);
      if (inc.status === 200) {
        await this.$emit("remove");
      } else {
        //fuck
      }
    }
  }
}
</script>

<style scoped>
body {
  background: #ddd;
  min-height: 100vh;
  vertical-align: middle;
  display: flex;
  font-family: sans-serif;
  font-size: 0.8rem;
  font-weight: bold
}

.summary .col-2 {
  padding: 0
}

.row {
  margin: 0
}

.title b {
  font-size: 1.5rem
}

.main {
  margin: 0;
  padding: 2vh 0;
  width: 100%
}

.col-2,
.col {
  padding: 0 1vh
}

a {
  padding: 0 1vh
}

.close {
  margin-left: auto;
  font-size: 0.7rem
}

img {
  width: 3.5rem
}

h5 {
  margin-top: 4vh
}

hr {
  margin-top: 1.25rem
}

form {
  padding: 2vh 0
}

select {
  border: 1px solid rgba(0, 0, 0, 0.137);
  padding: 1.5vh 1vh;
  margin-bottom: 4vh;
  outline: none;
  width: 100%;
  background-color: rgb(247, 247, 247)
}

input {
  border: 1px solid rgba(0, 0, 0, 0.137);
  padding: 1vh;
  margin-bottom: 4vh;
  outline: none;
  width: 100%;
  background-color: rgb(247, 247, 247)
}

input:focus::-webkit-input-placeholder {
  color: transparent
}

.btn {
  background-color: #000;
  border-color: #000;
  color: white;
  width: 100%;
  font-size: 0.7rem;
  margin-top: 4vh;
  padding: 1vh;
  border-radius: 0
}

.btn:focus {
  box-shadow: none;
  outline: none;
  color: white;
  -webkit-box-shadow: none;
  -webkit-user-select: none;
  transition: none
}

.btn:hover {
  color: white
}

a {
  color: black
}

a:hover {
  color: black;
  text-decoration: none
}
</style>
