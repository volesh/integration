"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
let code = "";
app.get("/", (req, res) => {
    res.json("Working");
});
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = req.body.project;
    console.log("User id=", req.body.eventCreator.id);
    // Get email adres
    const user = yield fetch(`https://vladscompany3.teamwork.com/people/${req.body.eventCreator.id}.json`, {
        headers: {
            Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
        },
    }).then((data) => data.json());
    const account = yield fetch("https://api.timelyapp.com/1.1/accounts", {
        headers: {
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    console.log("User", user);
    console.log("Account", account);
    // const data = await fetch(
    //   `https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://careful-wig-cow.cyclic.app/getToknes&code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code`,
    //   { method: "POST" }
    // );
    // const json = await data.json();
    console.log("its data", req.body);
    res.end();
}));
app.get("/getToknes", (req, res) => {
    console.log(req.query.code);
    code = req.query.code;
    res.json("Llalala");
});
app.listen(3000, () => {
    console.log("working");
});
//# sourceMappingURL=index.js.map