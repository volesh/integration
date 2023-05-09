import express, { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let code = "";

app.get("/", (req, res) => {
  res.json("Working");
});

app.post("/webhook", async (req: Request, res: Response) => {
  const data = await fetch(
    `https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://misty-erin-armadillo.cyclic.app/getToknes&code=${code}&client_id=bZS8omITNNblYpEA-AI1bVTWQ_pB_rgE8n_kyySrz7A&client_secret=T-9KGYgTiZqmVaYoqSckUPHPnvhiFy7-IG0tv-lpdq4&grant_type=authorization_code`,
    { method: "POST" }
  );
  console.log(data);
  res.end();
});

app.get("/getToknes", (req, res) => {
  console.log(req.query.code);
  code = req.query.code as string;
  res.json("Llalala");
});

app.listen(3000, () => {
  console.log("working");
});
