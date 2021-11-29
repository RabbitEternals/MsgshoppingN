import {InteractionObject, Pact} from '@pact-foundation/pact';
import {pactWith} from 'jest-pact';
import {listProducts, addBasket, changeProduct, clearBasket} from '../../api/apiCalls';
import {like, term} from "@pact-foundation/pact/src/dsl/matchers";
import {ALL, INCREASE} from "../../locales/util"

pactWith(
  {consumer: 'shoppingm', provider: 'shoppingCardM', cors: true},
  (provider: Pact) => {
    describe("Get cards", () => {
      const type = ALL;
      const shopData = [
        {name: "Camera", price: 1250, inbasket: true, basketquantity: 1, basketprice: 1250},
        {name: "Monitor", price: 7500, inbasket: true, basketquantity: 1, basketprice: 7500},
        {name: "Car", price: 50000, inbasket: true, basketquantity: 1, basketprice: 50000},
        {name: "Computer", price: 25000, inbasket: true, basketquantity: 1, basketprice: 25000},
        {name: "Chair", price: 1100, inbasket: true, basketquantity: 1, basketprice: 1100},
        {name: "Table", price: 5000, inbasket: true, basketquantity: 1, basketprice: 5000},
        {name: "Shirt", price: 650, inbasket: true, basketquantity: 1, basketprice: 650},
        {name: "Couch", price: 2100, inbasket: true, basketquantity: 1, basketprice: 2100},
        {name: "Mouse", price: 1600, inbasket: true, basketquantity: 1, basketprice: 1600},
        {name: "Cable", price: 500, inbasket: true, basketquantity: 1, basketprice: 500}];
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'The are cards',
          uponReceiving: 'a get request to get cards',
          withRequest: {
            method: 'GET',
            path: term({
              generate: `/list`,
              matcher: '/list'
            }),
            query: `type=${like(type)}`,
            headers: {
              Accept: 'application/json;charset=utf-8'
            }
          },
          willRespondWith: {
            status: 200,
            body: like(shopData),
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given type When request listProducts Then should return products', async () => {
        process.env.apiBaseUrl = provider.mockService.baseUrl;
        await listProducts(type);
      });
    });
    describe("Add basket cards", () => {
      const name = "Chair";
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'Added cards to basket',
          uponReceiving: 'a put request to put cards in basket',
          withRequest: {
            method: 'PUT',
            path: term({
              generate: `/putIn`,
              matcher: '/putIn'
            }),
            query: `name=${like(name)}`,
            headers: {
              Accept: 'application/json;charset=utf-8'
            }
          },
          willRespondWith: {
            status: 200,
            body: "200",
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given name When request addBasket Then should return status OK', async () => {
        process.env.apiBaseUrl = provider.mockService.baseUrl;
        await addBasket(name);
      });
    });
    describe("Change cards in basket", () => {
      const name = "Chair";
      const type = INCREASE;
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'Change cards in basket',
          uponReceiving: 'a put request to change cards in basket',
          withRequest: {
            method: 'PUT',
            path: term({
              generate: `/change`,
              matcher: '/change'
            }),
            query: `type=${like(type)}&name=${like(name)}`,
            headers: {
              Accept: 'application/json;charset=utf-8'
            }
          },
          willRespondWith: {
            status: 200,
            body: "200",
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given name and type When request changeProduct Then should return status OK', async () => {
        process.env.apiBaseUrl = provider.mockService.baseUrl;
        await changeProduct(name);
      });
    });
    describe("Clear basket cards", () => {
      beforeEach(() => {
        const interaction: InteractionObject = {
          state: 'Clear cards in basket',
          uponReceiving: 'a put request to clear cards in basket',
          withRequest: {
            method: 'PUT',
            path: term({
              generate: `/clear`,
              matcher: '/clear'
            }),
            headers: {
              Accept: 'application/json;charset=utf-8'
            }
          },
          willRespondWith: {
            status: 200,
            body: "200",
            headers: {'Content-Type': 'application/json'}
          }
        };
        return provider.addInteraction(interaction);
      });
      it('Given none When request clearBasket Then should return status OK', async () => {
        process.env.apiBaseUrl = provider.mockService.baseUrl;
        await clearBasket();
      });
    });
  });

