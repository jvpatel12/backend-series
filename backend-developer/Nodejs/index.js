const express = require('express');
const app = express();
const json = require('./MOCK_DATA.json');

app.use(express.json()); // to parse JSON bodies

app.get('/', (req, res) => {
    res.send('Hello World from Node.js!');
});

app.get("/api/users", (req, res) => {
    return res.json(json);
});

app.get("/users", (req, res) => {
    const html = `<ul>
        ${json.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>`;
    res.send(html);
});

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = json.find(user => user.id === id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    })
    .patch((req, res) => {
        res.json({ status: "Pending" });
    })
    .delete((req, res) => {
        res.json({ status: "Pending" });
    });

app.post("/api/users", (req, res) => {
    res.json({ status: "Pending" });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
