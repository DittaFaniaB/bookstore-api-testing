import dotenv from 'dotenv';
dotenv.config();

import supertest from "supertest";
const auth = require('../auth/authentication');


describe('Bookstore Swagger', function() {
    describe('Auth', function() {
        let basicToken;
        let userId;
        let username = process.env.USERNAMEBOOKSTORE;
        let pass = process.env.PASSWORD;
        let bearer_token = "";

        before(async function() {
            // basicToken = await auth.generateBasicToken(process.env.USERNAME, process.env.PASSWORD);
            // console.log(basicToken);
            userId = process.env.UUID;
        });

        it.skip("Check Authorization", async () => {
            // console.log(basicToken);
            const res = await auth.authCheck(username, pass, basicToken);
            expect(res.status).toBe(200);
        });

        it.skip("Get token Authorization", async () => {
            const res = await auth.generateAuthToken(username, pass, basicToken);
            expect(res.status).toBe(200);
            bearer_token = res.body.token;
        });

        it.skip("Get User", async () => {
            const res = await auth.getUser(username, pass, basicToken, bearer_token, userId);
            expect(res.status).toBe(200);
        });


    })
})

