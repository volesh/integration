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
app.post("/hours", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    console.log(`https://api.timelyapp.com/1.1${req.body.payload.entity_path}`);
    const account = yield fetch("https://api.timelyapp.com/1.1/accounts", {
        headers: {
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    console.log("Get data for create from timely");
    const data = yield fetch(`https://app.timelyapp.com/${account[0].id}${req.body.payload.entity_path}`, {
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
    const { people } = yield fetch(`https://vladscompany3.teamwork.com/people.json`, {
        headers: {
            Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
        },
    }).then((data) => data.json());
    console.log("Get projects");
    const { projects } = yield fetch(`https://vladscompany3.teamwork.com/projects.json`, {
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
        userEmail,
        date,
        description,
        hours,
        minutes,
        userId,
    };
    console.log("create time at timework");
    console.log("URl=", `https://vladscompany3.teamwork.com/projects/api/v3/projects/${projectId}/time.json`);
    const created = yield fetch(`https://vladscompany3.teamwork.com/projects/api/v3/projects/${projectId}/time.json`, {
        body: JSON.stringify(body),
        headers: {
            Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
        },
    }).then((data) => data.json());
    console.log("Created", created);
    res.end();
}));
app.post("/budget", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const projectId = req.body.budget.projectId;
    const { project } = yield fetch(`https://vladscompany3.teamwork.com/projects/${projectId}.json`, {
        headers: {
            Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
        },
    }).then((data) => data.json());
    console.log("Teamwork project", project);
    const projectName = project.name;
    const account = yield fetch("https://api.timelyapp.com/1.1/accounts", {
        headers: {
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    // console.log("Account", account);
    const projectsArr = yield fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects`, {
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
    }
    else {
        body.budget_type = "M";
        body.budget = req.body.budget.capacity / 100;
    }
    const selectedProject = projectsArr.find((elem) => elem.name === projectName);
    // console.log("Selected project=", selectedProject);
    const updatedProject = yield fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects/${selectedProject.id}`, {
        body: JSON.stringify(body),
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    // console.log("UpdatedProject = ", updatedProject);
    res.end();
}));
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = req.body.project;
    // Get email adres
    const user = yield fetch(`https://vladscompany3.teamwork.com/people/${req.body.eventCreator.id}.json`, {
        headers: {
            Authorization: "Basic " + Buffer.from("twp_B8MG9eAALkD2fS8QTPHh3djd1O8T" + ":" + "password").toString("base64"),
        },
    }).then((data) => data.json());
    /////////////////////////////////////////////////////////////////////
    const account = yield fetch("https://api.timelyapp.com/1.1/accounts", {
        headers: {
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    ////////////////////////////////////////////////////////////////////////
    const clients = yield fetch(`https://api.timelyapp.com/1.1/${account[0].id}/clients`, {
        headers: {
            Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
        },
    }).then((data) => data.json());
    const clientId = clients[0].id;
    ////////////////////////////////////////////////////////////////////////////
    const tiamlyUser = yield fetch(`https://api.timelyapp.com/1.1/${account[0].id}/users/current`, {
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
        const CreatedProject = yield fetch(`https://api.timelyapp.com/1.1/${account[0].id}/projects`, {
            method: "POST",
            body: JSON.stringify(dataForProject),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + "VgGvnfBPk-c7oeohnQz6JEAp1AveEeyxpAwdsDNqw6I",
            },
        }).then((data) => data.json());
        console.log(CreatedProject);
    }
    catch (e) {
        console.log(e);
    }
    res.end();
}));
// const data = await fetch(
//   `https://api.timelyapp.com/1.1/oauth/token?redirect_uri=https://careful-wig-cow.cyclic.app/getToknes&code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code`,
//   { method: "POST" }
// );
// const json = await data.json();
app.get("/getToknes", (req, res) => {
    console.log(req.query.code);
    code = req.query.code;
    res.json("Llalala");
});
app.listen(3000, () => {
    console.log("working");
});
//# sourceMappingURL=index.js.map