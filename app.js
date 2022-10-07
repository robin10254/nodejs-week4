const fs = require('fs');
const express = require('express');

const app = express();
const PORT = 3000;
const fileName = 'writeFile.json';

app.use(express.json());

// With middleware
app.use('/update', (req, res, next) => {
    const person = req.body;

    console.log(`Before the update ${person.name}'s order count was ${person.order_cnt}.`);

    person.order_cnt += 3;

    const data = JSON.stringify(req.body, null, 2);

    // write on json file
    fs.writeFile(fileName, data, (err) => {
        if (err) {
            next(err);
        } else {
            res.send('File successfully updated!');
            next();
        }
    });
});

app.get('/', (req, res) => {
    const display =
        "You could route '/write', '/read', and '/update' URLs for writing, reading, and updating JSON file correspondingly.";
    res.end(display);
});

app.get('/write', (req, res, next) => {
    const person = JSON.stringify(req.body, null, 2);
    const display = 'File successfully written!';

    // write on json file
    fs.writeFile(fileName, person, (err) => {
        if (err) {
            next(err);
        } else {
            console.log(display);
            res.end(display);
        }
    });
});

app.get('/read', (req, res, next) => {
    // read json file
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            next(err);
        } else {
            try {
                const person = JSON.parse(data);
                console.log('File successfully read!');
                // res.json(`JSON file ${person}`); // need to modify
                res.send(person);
                res.end();
            } catch (error) {
                next('Error parsing JSON', error);
            }
        }
    });
});

app.get('/update', (req, res, next) => {
    // read json file
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            next(err);
        } else {
            try {
                const person = JSON.parse(data);
                // console.log(person);

                console.log(
                    `After the update ${person.name}'s order count is ${person.order_cnt} now.`,
                );
                res.send(
                    `After the update ${person.name}'s order count is ${person.order_cnt} now.`,
                );
            } catch (error) {
                next('Error parsing JSON', error);
            }
        }
    });
});

app.get('*', (req, res) => {
    res.status(404).send('Requested URL not found!');
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        next('There was a problem on header send');
    } else if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(500).send('There was an error!');
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server listening on PORT', PORT);
    }
});
