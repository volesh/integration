import express, { Request, Response } from "express";
import { config } from "dotenv";
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let code = "";

app.get("/", (req, res) => {
  res.json("Working");
});

app.post("/webhook", async (req: Request, res: Response) => {
  const project = req.body.project;

  // Get email adres
  const user = await fetch(`https://vladscompany3.teamwork.com/people/${req.body.eventCreator.id}.json`, {
    headers: {
      Authorization: "Basic " + "twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":a",
    },
  }).then((data) => data.json());

  const account = await fetch("https://api.timelyapp.com/1.1/accounts", {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json())[0];
  console.log("User", user);
  console.log("Account", account);

  // const data = await fetch(
  //   `https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://careful-wig-cow.cyclic.app/getToknes&code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code`,
  //   { method: "POST" }
  // );
  // const json = await data.json();
  console.log("its data", req.body);
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
