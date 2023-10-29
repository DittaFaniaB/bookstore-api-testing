import dotenv from 'dotenv';
dotenv.config();

const auth = require('../auth/authentication');
const bookEndpoint = require('../endpoint/book.endpoint');

describe("Bookstore Swagger", () => {
	let basicToken;
	let userId = process.env.UUID;
	let bearerToken = "";
	let username = process.env.USERNAMEBOOKSTORE;
	let pass = process.env.PASSWORD;
	let listOfBook;

	before(async () => {
		basicToken = await auth.generateBasicToken(username, pass);
		const res = await auth.generateAuthToken(username, pass, basicToken);
		expect(res.status).toBe(200);
		bearerToken = res.body.token;
		console.log(bearerToken);

	});

	afterEach(async () => {
		// await storeBook(basicToken, userId, await getBookList()[1]);
	});

	describe('Auth', function() {
		it("[TC001] Get User with valid api token bearer", async () => {
			const res = await auth.getUser(username, pass, basicToken, bearerToken, userId);
			expect(res.status).toBe(200);
		});

		it("[TC002] Get User with invalid api token bearer", async () => {
			const res = await auth.getUser(username, pass, basicToken, "invalid token", userId);
			expect(res.status).toBe(401);
		});
	})

	describe('List of Book', function() {
		it("[TC003] Get list of book", async () => {
			const res = await bookEndpoint.getBookList();
			expect(res.status).toBe(200);
		});

		it("[TC004] Get list of isbn", async () => {
			await bookEndpoint.getIsbnList();
		});
	})

	describe('Store Book', function() {
		before(async () => {
			listOfBook = await bookEndpoint.getIsbnList();
		});

		it("[TC005] Store valid ISBN book", async () => {
			// listOfBook = await bookEndpoint.getIsbnList();
			const res = await bookEndpoint.storeBook(basicToken, userId, listOfBook[1], true, bearerToken);

			expect(res.status).toBe(201);
			expect(res.body.books[0].isbn).toEqual(listOfBook[1]);
		});

		it("[TC006] Store book with ISBN that already exist", async () => {

			await bookEndpoint.storeBook(basicToken, userId, listOfBook[0], true, bearerToken);

			const res = await bookEndpoint.storeBook(basicToken, userId, listOfBook[0], false, bearerToken);

			expect(res.status).toBe(400);
			expect(res.body.code).toBe("1210");
			expect(res.body.message).toBe("ISBN already present in the User's Collection!");
		});

		it("[TC007] Store books with ISBNs that are not registered in the system", async () => {
			const res = await bookEndpoint.storeBook(basicToken, userId, "0".repeat(13), false, bearerToken);

			expect(res.status).toBe(400);
			expect(res.body.code).toBe("1205");
			expect(res.body.message).toBe("ISBN supplied is not available in Books Collection!");
		});

		it("[TC008] Store a book with invalid UUID", async () => {
			const res = await bookEndpoint.storeBook(basicToken, "invalid uuid", listOfBook[1], true, bearerToken );

			expect(res.status).toBe(401);
			expect(res.body.code).toBe("1207");
			expect(res.body.message).toBe("User Id not correct!");
		});

		it("[TC009] Store a book with invalid bearer token", async () => {
			const res = await bookEndpoint.storeBook(basicToken, userId, listOfBook[2], true, 'bearer token invalid');

			expect(res.status).toBe(401);
			expect(res.body.code).toBe("1200");
			expect(res.body.message).toBe("User not authorized!");
		});
	});
	
	// delete
	
	describe('Delete Book', function() {
		before(async () => {
			listOfBook = await bookEndpoint.getIsbnList();
		});

		afterEach(async () => {
			await bookEndpoint.storeBook(basicToken, userId, listOfBook[1], true, bearerToken);
		});

		it("[TC010] Delete valid stored book", async () => {
			const res = await bookEndpoint.deleteBookCollection(basicToken, userId, bearerToken);

			expect(res.status).toBe(204);
		});

		it("[TC011] Delete books for users who have an empty book list", async () => {
			await bookEndpoint.deleteBookCollection(basicToken, userId, bearerToken);
			const res = await bookEndpoint.deleteBookCollection(basicToken, userId, bearerToken);
			expect(res.status).toBe(204);
		});

		it("[TC012] Delete stored book with invalid bearer token", async () => {
			const res = await bookEndpoint.deleteBookCollection(basicToken, userId, 'invalid bearer token');

			expect(res.status).toBe(401);
			expect(res.body.code).toBe("1200");
			expect(res.body.message).toBe("User not authorized!");
		});

		it("[TC013] Delete stored book of invalid/unexisting user", async () => {
			const res = await bookEndpoint.deleteBookCollection(basicToken, "invalid-user", bearerToken);

			expect(res.status).toBe(401);
			expect(res.body.code).toBe("1207");
			expect(res.body.message).toBe("User Id not correct!");
		});
	});


});