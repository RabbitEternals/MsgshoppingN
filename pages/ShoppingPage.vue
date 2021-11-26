<template>
  <div>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="shopping-page">
      <nav class="navbar navbar-expand navbar-light container">
        <div class="container">
          <h1 id="welcome_header">Welcome To ShoppingPage</h1>
          <ul class="navbar-nav ml-3">
            <NuxtLink id="basket_link" to="/BasketPage">Basket Page</NuxtLink>
          </ul>
        </div>
      </nav>
    </div>

    <div class="container-fluid">
      <ul class="list-group list-group-flush">
        <div class="row">
          <ShoppingCard :id="'card'+card.id" class="col-md-4" v-for="card in products" :key="card.id" :card="card"/>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import ShoppingCard from "../components/ShoppingCard";
import {ALL} from "../locales/util";
import {listProducts} from "../api/apiCalls";

export default {
  name: "ShoppingPage",
  components: {ShoppingCard},
  data() {
    return {
      num: 0,
      products: []
    }
  },
  methods: {
    async getData() {
      const response = await listProducts(ALL);
      this.num = 0
      this.products = [];
      for (const element of response.data) {
        this.products.push({
          id: this.num,
          name: element.name,
          price: element.price,
          inBasket:element.inbasket
        });
        this.num++;
      }
    }
  },
  async mounted() {
    await this.getData();
  }
}
</script>

<style scoped>

</style>
