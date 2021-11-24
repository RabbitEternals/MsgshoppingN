<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="shopping-page">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <h1>Welcome To ShoppingPage</h1>
        <ul class="navbar-nav ml-auto">
          <NuxtLink to="/BasketPage">Basket Page</NuxtLink>
        </ul>
      </div>
    </nav>
    <div class="container">
      <ul class="list-group list-group-flush">
        <tr>
            <ShoppingCard v-for="card in products" :key="card.name" :card="card"/>
        </tr>
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
      products: []
    }
  },
  methods: {
    async getData() {
      const response = await listProducts(ALL);
      this.products = response.data;
    }
  },
  async mounted() {
    await this.getData();
  }
}
</script>

<style scoped>

</style>
