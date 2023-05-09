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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
let code = "";
app.get("/", (req, res) => {
    res.json("Working");
});
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("code in endpoint", code);
    const data = yield fetch(`https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://misty-erin-armadillo.cyclic.app/getToknes&code=${code}&client_id=bZS8omITNNblYpEA-AI1bVTWQ_pB_rgE8n_kyySrz7A&client_secret=T-9KGYgTiZqmVaYoqSckUPHPnvhiFy7-IG0tv-lpdq4&grant_type=authorization_code`, { method: "POST" });
    console.log(data);
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