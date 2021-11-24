import {render, screen} from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {rest} from "msw";
import {setupServer} from "msw/node";
import App from "../pages/BasketPage";
import {DECREASE, INCREASE, REMOVE} from "../locales/util";


let counter = 0;
let listType;
let name;
let operationType;
const server = setupServer(
  rest.get("/list", (req, res, ctx) => {
    listType = req.url.searchParams.get("type");
    if (listType === "BASKET") {
      return res(ctx.status(200), ctx.json(basketData));
    } else {
      return res(ctx.status(501), ctx.json(notImplemented));
    }
  }),
  rest.put("/clear", (req, res, ctx) => {
    counter++;
    return res(ctx.status(200), ctx.json(success));
  }),
  rest.put("/change", (req, res, ctx) => {
    name = req.url.searchParams.get("name");
    operationType = req.url.searchParams.get("type");
    if (operationType !== REMOVE || operationType !== INCREASE || operationType !== DECREASE) {
      counter++;
      return res(ctx.status(200), ctx.json(success));
    } else {
      return res(ctx.status(501), ctx.json(notImplemented));
    }
  })
);
beforeAll(() => server.listen());
beforeEach(() => {
  counter = 0;
  name = "";
  operationType = "";
  server.resetHandlers();
});
afterAll(() => server.close());
const setup = async () => {
  await render(App);
};

describe("Shopping Page", () => {
  describe("Layout", () => {
    it("has basket page header", async () => {
      await setup();
      const input = screen.queryByRole("heading", {name: "Welcome To Your Basket Card"});
      expect(input).toBeInTheDocument();
    });
    it("initially displays clear products button", async () => {
      await setup();
      const button = screen.queryByRole("button", {name: "Clear"});
      expect(button).toBeInTheDocument();
    });
    it("initially displays 4 product card", async () => {
      await setup();
      const cards = await screen.findAllByText(/Product/);
      expect(cards.length).toBe(4);
    });
    it("initially displays 4 delete product button", async () => {
      await setup();
      const buttons = await screen.findAllByRole("button", {name: "Delete"});
      expect(buttons.length).toBe(4);
    });
    it("initially displays 4 increase product button", async () => {
      await setup();
      const buttons = await screen.findAllByRole("button", {name: "+"});
      expect(buttons.length).toBe(4);
    });
    it("initially displays 4 decrease product button", async () => {
      await setup();
      const buttons = await screen.findAllByRole("button", {name: "-"});
      expect(buttons.length).toBe(4);
    });
    it("initially displays purchase button", async () => {
      await setup();
      const button = screen.queryByRole("button", {name: "Purchase"});
      expect(button).toBeInTheDocument();
    });
    it("initially disables 4 decrease product button because quantities are one", async () => {
      await setup();
      const buttons = await screen.findAllByRole("button", {name: "-"});
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });
  });
  describe("Interactions", () => {
    it("decreases products quantity and price after clicking decrease", async () => {
      await setup();
      const buttonsI = await screen.findAllByRole("button", {name: "+"});
      for (const button of buttonsI) {
        await userEvent.click(button);
      }
      const buttons = await screen.findAllByRole("button", {name: "-"});
      for (const button of buttons) {
        await userEvent.click(button);
      }
      const prices = await screen.findAllByTestId("basketPrices");
      for (let i = 0; i < 4; i++) {
        expect(Number(prices[i].text)).toBe(expectedOne[i]);
      }
    });
    it("clears products after clicking delete buttons", async () => {
      await setup();
      const deletes = await screen.queryAllByRole("button", {name: "Delete"});
      for (const button of deletes) {
        userEvent.click(button);
      }
      const buttonsI = await screen.queryAllByRole("button", {name: "+"});
      const buttonsM = await screen.queryAllByRole("button", {name: "-"});
      const prices = await screen.queryAllByTestId("basketPrices");
      expect(buttonsI).toStrictEqual([]);
      expect(buttonsM).toStrictEqual([]);
      expect(prices).toStrictEqual([]);
    });
    it("clears all products after clicking clear basket", async () => {
      await setup();
      const buttons = screen.queryByRole("button", {name: "Clear"});
      await userEvent.click(buttons);
      const buttonsI = await screen.queryAllByRole("button", {name: "+"});
      const buttonsM = await screen.queryAllByRole("button", {name: "-"});
      const prices = await screen.queryAllByTestId("basketPrices");
      expect(buttonsI).toStrictEqual([]);
      expect(buttonsM).toStrictEqual([]);
      expect(prices).toStrictEqual([]);
    });
    it("after clicking increase buttons sends api request to backend with products name", async () => {
      await setup();
      const buttonsI = await screen.findAllByRole("button", {name: "+"});
      for (let i = 0; i < 4; i++) {
        await userEvent.click(buttonsI[i]);
        expect(operationType).toBe(INCREASE);
        expect(name).toBe(basketData[i].name);
      }
    });
    it("after clicking decrease buttons sends api request to backend with products name", async () => {
      server.use(
        rest.get("/list", (req, res, ctx) => {
          listType = req.url.searchParams.get("type");
          if (listType === "BASKET") {
            return res(ctx.status(200), ctx.json(basketDataDecrease));
          } else {
            return res(ctx.status(501), ctx.json(notImplemented));
          }
        })
      );
      await setup();
      const buttonsM = await screen.findAllByRole("button", {name: "-"});
      for (let i = 0; i < 4; i++) {
        await userEvent.click(buttonsM[i]);
        expect(operationType).toBe(DECREASE);
        expect(name).toBe(basketData[i].name);
      }
      expect(counter).toBe(4);
    });
    it("disables decrease buttons while product quantity is 1", async () => {
      await setup();
      const buttonsM = await screen.findAllByRole("button", {name: "-"});
      for (const button of buttonsM) {
        expect(button).toBeDisabled();
      }
    });
    it("after clicking clear button sends api request to backend", async () => {
      await setup();
      const buttons = screen.queryByRole("button", {name: "Clear"});
      await userEvent.click(buttons);
      expect(counter).toBe(1);
    });
    it("after clicking delete buttons sends api request to backend with products name", async () => {
      await setup();
      const buttonsM = await screen.findAllByRole("button", {name: "Delete"});
      for (let i = 0; i < 4; i++) {
        await userEvent.click(buttonsM[i]);
        expect(operationType).toBe("REMOVE");
        expect(name).toBe(basketData[i].name);
      }
      expect(counter).toBe(4);
    });
  });
  describe("Routing", () => {
    it("has link to shopping page", async () => {
      await setup();
      const link = await screen.queryByText("Shopping Page");
      expect(link).toBeInTheDocument();
    });
    it("displays basket page at /basket path", async () => {
      await setup();
      const homePage = screen.queryByTestId("basket-page");
      expect(homePage).toBeInTheDocument();
    });
  });
});


const success = "200";
const notImplemented = "501 not implemented.";
const expectedOne = [50000, 500, 650, 5000];
const basketData = [
  {
    "name": "Car",
    "price": 50000,
    "inbasket": true,
    "basketquantity": 1,
    "basketprice": 50000
  },
  {
    "name": "Cable",
    "price": 500,
    "inbasket": true,
    "basketquantity": 1,
    "basketprice": 500
  },
  {
    "name": "Shirt",
    "price": 650,
    "inbasket": true,
    "basketquantity": 1,
    "basketprice": 650
  },
  {
    "name": "Table",
    "price": 5000,
    "inbasket": true,
    "basketquantity": 1,
    "basketprice": 5000
  }
];
const basketDataDecrease = [
  {
    "name": "Car",
    "price": 50000,
    "inbasket": true,
    "basketquantity": 3,
    "basketprice": 50000
  },
  {
    "name": "Cable",
    "price": 500,
    "inbasket": true,
    "basketquantity": 3,
    "basketprice": 500
  },
  {
    "name": "Shirt",
    "price": 650,
    "inbasket": true,
    "basketquantity": 3,
    "basketprice": 650
  },
  {
    "name": "Table",
    "price": 5000,
    "inbasket": true,
    "basketquantity": 3,
    "basketprice": 5000
  }
];
