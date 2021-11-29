import {render, screen} from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {rest} from "msw";
import {setupServer} from "msw/node";
import App from "../../pages/ShoppingPage";

let counter = 0;
let listType;
let name;
const server = setupServer(
    rest.get("/list", (req, res, ctx) => {
        listType = req.url.searchParams.get("type");
        if (listType === "ALL") {
            return res(ctx.status(200), ctx.json(shoppingData));
        } else {
            return res(ctx.status(501), ctx.json(notImplemented));
        }
    }),
    rest.put("/putIn", (req, res, ctx) => {
        name = req.url.searchParams.get("name");
        counter += 1;
        return res(ctx.status(200), ctx.json(success));
    })
);
beforeAll(() => server.listen());
beforeEach(() => {
    counter = 0;
    name = "";
    server.resetHandlers();
});
afterAll(() => server.close());

const setup = async () => {
    await render(App);
};

describe("Shopping Page", () => {
    describe("Layout", () => {
        it("has shopping page header", async () => {
            await setup();
            const heading = await screen.queryByRole("heading", {name: "Welcome To ShoppingPage"});
            expect(heading).toBeInTheDocument();
        });
        it("initially displays 10 product card", async () => {
            await setup();
            const cards = await screen.findAllByText(/Product/);
            expect(cards.length).toBe(10);
        });
        it("initially displays 10 addToBasket button", async () => {
            await setup();
            const buttons = await screen.findAllByRole("button", {name: "ADD",exact:true});
            expect(buttons.length).toBe(10);
        });
        it("initially enables addToBasket buttons", async () => {
            await setup();
            const buttons = await screen.findAllByRole("button", {name: "ADD",exact:true});
            for (const button of buttons) {
                expect(button).toBeEnabled();
            }
        });
    });
    describe("Interactions", () => {
        it("after clicking buttons sends api request 10 times", async () => {
            await setup();
            const buttons = await screen.findAllByRole("button", {name: "ADD",exact:true});
            for (const button of buttons) {
                await userEvent.click(button);
            }
            expect(counter).toBe(10);
        });
        it("after clicking buttons sends api request with products name", async () => {
            await setup();
            const buttons = await screen.findAllByRole("button", {name: "ADD",exact:true});
            for (let i = 0; i < 10; i++) {
                await userEvent.click(buttons[i]);
                expect(name).toBe(shoppingData[i].name);
            }
        });
    });
    describe("Routing", () => {
        it("has link to basket page", async () => {
            await setup();
            const link = await screen.queryByText("Basket Page");
            expect(link).toBeInTheDocument();
        });
        it("displays shopping page at / path", async () => {
            await setup();
            const homePage = screen.queryByTestId("shopping-page");
            expect(homePage).toBeInTheDocument();
        });
    });
});

const success = "200";
const notImplemented = "501 not implemented.";
const shoppingData = [
    {
        "name": "Computer",
        "price": 25000,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Cable",
        "price": 500,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Camera",
        "price": 1250,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Mouse",
        "price": 1600,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Shirt",
        "price": 650,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Couch",
        "price": 2100,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Chair",
        "price": 1100,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Table",
        "price": 5000,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Monitor",
        "price": 7500,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    },
    {
        "name": "Car",
        "price": 50000,
        "inbasket": false,
        "basketquantity": 0,
        "basketprice": 0
    }
];
