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

app.post("/budget", (req, res) => {
  console.log(req.body);
  res.end();
});

app.post("/webhook", async (req: Request, res: Response) => {
  const project = req.body.project;
  // Get email adres
  const user = await fetch(`https://vladscompany3.teamwork.com/people/${req.body.eventCreator.id}.json`, {
    headers: {
      Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
    },
  }).then((data) => data.json());
  /////////////////////////////////////////////////////////////////////
  const account = await fetch("https://api.timelyapp.com/1.1/accounts", {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  ////////////////////////////////////////////////////////////////////////
  const clients = await fetch(`https://api.timelyapp.com/1.1/${account[0].id}/clients`, {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  const clientId = clients[0].id;
  ////////////////////////////////////////////////////////////////////////////
  const tiamlyUser = await fetch(`https://api.timelyapp.com/1.1/${account[0].id}/users/current`, {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  console.log(tiamlyUser);

  console.log(`UserId=${tiamlyUser.id}`, `Client_id=${clientId}`, `Name=${project.name}`);

  const dataForProject = {
    project: {
      name: project.name,
      rate_type: "project",
      color: "67a3bc",
      client_id: clientId,
      users: [{ user_id: tiamlyUser.id }],
    },
  };

  try {
    const CreatedProject = await fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects`, {
      method: "POST",
      body: JSON.stringify(dataForProject),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
      },
    }).then((data) => data.json());
    console.log(CreatedProject);
  } catch (e) {
    console.log(e);
  }

  res.end();
});

// const data = await fetch(
//   `https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://careful-wig-cow.cyclic.app/getToknes&code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code`,
//   { method: "POST" }
// );
// const json = await data.json();

app.get("/getToknes", (req, res) => {
  console.log(req.query.code);
  code = req.query.code as string;
  res.json("Llalala");
});

app.listen(3000, () => {
  console.log("working");
});
