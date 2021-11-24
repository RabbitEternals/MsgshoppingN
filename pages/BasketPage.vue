<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="basket-page">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <h1>Welcome To Your Basket Card</h1>
        <ul class="navbar-nav ml-auto">
          <NuxtLink to="/ShoppingPage">Shopping Page</NuxtLink>
        </ul>
      </div>
    </nav>
    <div class="container">
      <button class="btn btn-outline-secondary btn-sm float-end" @click="clearBasket">Clear</button>
      <ul class="list-group list-group-flush">
        <BasketCard class="border rounded" @increase="increase(card.name)" @decrease="decrease(card.name)"
                    @remove="remove(card.name)"
                    v-for="card in products" :key="card.name" :card="card"/>
      </ul>
      <a class="border float-end" :key="products">&euro;{{ total }}</a>
      <button class="btn btn-outline-secondary btn-sm float-end">Purchase</button>
    </div>
  </div>
</template>

<script>
import BasketCard from "../components/BasketCard";
import {clearBasket, listProducts} from "../api/apiCalls";
import {BASKET} from "../locales/util";

export default {
  name: "BasketPage",
  components: {BasketCard},
  data() {
    return {
      products: [],
      total: 0,
    }
  },
  methods: {
    async sumTotal() {
      this.total = this.products.map(item => item.basketprice).reduce((prev, next) => prev + next);
    },
    async getData() {
      const response = await listProducts(BASKET);
      this.products = response.data
    },
    async clearBasket() {
      const clear = await clearBasket();
      if (clear.status === 200) {
        this.products = [];
        this.total = 0;
      } else {
        //fuck
      }
    },
    async increase(name) {
      const cardObject = this.products.filter(card => card.name === name).pop();
      cardObject.basketquantity++;
      cardObject.basketprice += cardObject.price;
      await this.sumTotal();
    },
    async decrease(name) {
      const cardObject = this.products.filter(card => card.name === name).pop();
      cardObject.basketquantity--;
      cardObject.basketprice -= cardObject.price;
      await this.sumTotal();
    },
    async remove(name) {
      const cardObject = this.products.filter(card => card.name === name).pop();
      cardObject.basketquantity = 0;
      cardObject.basketprice = 0;
      cardObject.inbasket = false;
      await this.sumTotal();
    },
  },
  async mounted() {
    await this.getData();
    await this.sumTotal();
  }
}
</script>

<style scoped>

</style>
