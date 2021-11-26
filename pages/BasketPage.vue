<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="basket-page">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <h1 id="welcome_header_basket">Welcome To Your Basket Card</h1>
        <ul class="navbar-nav ml-auto">
          <NuxtLink id="shopping_link" to="/ShoppingPage">Shopping Page</NuxtLink>
        </ul>
      </div>
    </nav>
    <div class="container">
      <button id="clear_button" class="btn btn-outline-secondary btn-sm float-end" @click="clearBasket">Clear</button>
      <ul class="list-group list-group-flush">
        <BasketCard :id="'card'+card.id" class="border rounded" @increase="increase(card.id)"
                    @decrease="decrease(card.id)"
                    @remove="remove(card.id)"
                    v-for="card in products" :key="card.id" :card="card"/>
      </ul>
      <a id="total_amount" class="border float-end" :key="products">&euro;{{ total }}</a>
      <button id="purchase_button" class="btn btn-outline-secondary btn-sm float-end">Purchase</button>
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
      num: 0,
      products: [],
      total: 0,
    }
  },
  methods: {
    async sumTotal() {
      if (this.products === [] || this.products === null || this.products.length <= 0) {
        this.total = 0;
      } else {
        this.total = this.products.map(item => item.basketPrice).reduce((prev, next) => prev + next);
      }
    },
    async getData() {
      const response = await listProducts(BASKET);
      this.num = 0;
      this.products = [];
      if (response.data != null) {
        for (const element of response.data) {
          this.products.push({
            id: this.num,
            name: element.name,
            inBasket: element.inbasket,
            price:element.price,
            basketQuantity: element.basketquantity,
            basketPrice: element.basketprice
          });
          this.num++;
        }
      }
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
    async increase(id) {
      const cardObject = this.products.filter(card => card.id === id).pop();
      console.log(cardObject)
      cardObject.basketQuantity++;
      cardObject.basketPrice += cardObject.price;
      await this.sumTotal();
    },
    async decrease(id) {
      const cardObject = this.products.filter(card => card.id === id).pop();
      cardObject.basketQuantity--;
      cardObject.basketPrice -= cardObject.price;
      await this.sumTotal();
    },
    async remove(id) {
      const cardObject = this.products.filter(card => card.id === id).pop();
      cardObject.basketQuantity = 0;
      cardObject.basketPrice = 0;
      cardObject.inBasket = false;
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
