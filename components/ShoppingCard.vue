<template>
  <th>
  <div class='container'>
    <div class="card mx-auto col-md-30 col-10 mt-5">
      <div class="card-header text-center">Product</div>
      <div class="card-body text-center mx-auto">
        <img class='mx-auto img-thumbnail' src="https://picsum.photos/200" width="200" height="200"
             alt="Product Photo"/>
        <div class='cvp'>
          <h5 class="card-title font-weight-bold">{{ card.name }}</h5>
          <p class="card-text">${{ card.price }}</p>
          <button v-show="!isAdded" @click="addToBasket(card.name)" class="btn cart px-auto">ADD</button>
        </div>
      </div>
    </div>
  </div>
  </th>
</template>

<script>
import {addBasket} from "../api/apiCalls";

export default {
  name: "ShoppingCard",
  props: {
    card: Object
  },
  data() {
    return {
      isAdded: false,
      updateNum: 0
    }
  },
  methods: {
    async addToBasket(name) {
      const response = await addBasket(name);
      if (response.status === 200) {
        this.isAdded = true;
      } else {
        //fuck
      }
    }
  },
  async mounted() {
    this.card.inbasket === true ? this.isAdded = true : this.isAdded = false;
  }
}
</script>

<style scoped>
body {
  background: #E0E0E0
}

.cart {
  background-color: #212121;
  color: white;
  margin-top: 10px;
  font-size: 12px;
  font-weight: 900;
  width: 100%;
  height: 39px;
  padding-top: 9px;
  box-shadow: 0 5px 10px #212121
}

.card {
  width: fit-content
}

.card-body {
  width: fit-content
}

.btn {
  border-radius: 0
}

.img-thumbnail {
  border: none
}

.card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, .2);
  border-radius: 5px;
  padding-bottom: 10px
}
</style>
