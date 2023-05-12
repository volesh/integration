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

app.post("/hours", async (req, res) => {
  console.log(req.body);
  console.log(`https://api.timelyapp.com/1.1${req.body.payload.entity_path}`);
  const account = await fetch("https://api.timelyapp.com/1.1/accounts", {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());

  console.log("Get data for create from timely");

  const data = await fetch(`https://app.timelyapp.com/${account[0].id}${req.body.payload.entity_path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  const userEmail = data.user.email;
  const date = data.day;
  const description = data.note;
  const hours = data.duration.hours;
  const minutes = data.duration.minutes;
  //https://vladscompany3.teamwork.com/projects/api/v3/projects/911551/time.json

  console.log("Get peoples");

  const { people } = await fetch(`https://vladscompany3.teamwork.com/people.json`, {
    headers: {
      Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
    },
  }).then((data) => data.json());

  console.log("Get projects");

  const { projects } = await fetch(`https://vladscompany3.teamwork.com/projects.json`, {
    headers: {
      Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
    },
  }).then((data) => data.json());

  console.log("Find people id");

  const { id: userId } = people.find((user) => user["email-address"] === userEmail);
  console.log("Find project id");
  console.log("User id=", userId);

  const { id: projectId } = projects.find((project) => project.name === data.project.name);
  console.log("Project id=", projectId);

  const body = {
    timelog: {
      date,
      description,
      isBillable: true,
      hours,
      minutes,
      userId: +userId,
    },
  };
  console.log("body", body);

  console.log("create time at timework");
  console.log("URl=", `https://vladscompany3.teamwork.com/projects/api/v3/projects/${projectId}/time.json`);

  const created = await fetch(`https://vladscompany3.teamwork.com/projects/api/v3/projects/${projectId}/time.json`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
    },
  }).then((data) => data.json());

  console.log("Created", created);

  res.end();
});

app.post("/budget", async (req, res) => {
  console.log(req.body);
  const projectId = req.body.budget.projectId;
  const { project } = await fetch(`https://vladscompany3.teamwork.com/projects/${projectId}.json`, {
    headers: {
      Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
    },
  }).then((data) => data.json());
  console.log("Teamwork project", project);

  const projectName = project.name;
  const account = await fetch("https://api.timelyapp.com/1.1/accounts", {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  // console.log("Account", account);

  const projectsArr = await fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects`, {
    headers: {
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  console.log("Projects arr", projectsArr);

  const body = {
    budget: 0,
    budget_type: "",
  };
  if (req.body.budget.type === "TIME") {
    body.budget_type = "H";
    body.budget = req.body.budget.capacity / 60;
  } else {
    body.budget_type = "M";
    body.budget = req.body.budget.capacity / 100;
  }
  const selectedProject = projectsArr.find((elem) => elem.name === projectName);
  // console.log("Selected project=", selectedProject);

  const updatedProject = await fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects/${selectedProject.id}`, {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
    },
  }).then((data) => data.json());
  // console.log("UpdatedProject = ", updatedProject);

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
