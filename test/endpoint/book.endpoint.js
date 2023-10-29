import dotenv from 'dotenv';
dotenv.config();

import supertest from "supertest";

async function deleteBookCollection(token, userId, bearerToken) {
	var headers = {
		"authorization": "Basic " + token,
		"Authorization": "Bearer " + bearerToken,
		"Content-Type": "application/json",
        "accept": "application/json",
		"Accept-Encoding": "gzip, deflate, br",
		"Connection": "keep-alive",
		"Cache-Control": "no-cache"
	};

	const query = {
		"UserId": userId
	};

	try {
		return await supertest(process.env.BASE_URL)
			.delete(process.env.BOOKSTORE)
			.set(headers)
			.query(query);
	} catch (error) {
		console.log(error);
	}
}

async function getBookList() {
	try {
		return await supertest(process.env.BASE_URL)
			.get(process.env.BOOKSTORE);
			// .expect((res) => {
			// 	console.log(res.body)
			//    });    
	} catch (error) {
		console.log(error);
	}
}

async function getIsbnList(){
	let isbnList = [];
	try {
		const res = await getBookList();

		for (let i = 0; i < res.body.books.length; i++) {
			const isbn = res.body.books[i].isbn;
			isbnList.push(isbn);
		}

		return isbnList;
	} catch (error) {
		console.log(error);
	}
}

async function storeBook(basicToken, userId, isbn, safeMode = false, bearerToken) {
    var headers = {
		"authorization": "Basic " + basicToken,
		"Authorization": "Bearer " + bearerToken,
		"Content-Type": "application/json",
        "accept": "application/json",
		"Accept-Encoding": "gzip, deflate, br",
		"Connection": "keep-alive",
		"Cache-Control": "no-cache"
	};

    const payload = {
        "userId": userId,
        "collectionOfIsbns": [
            {
                "isbn": isbn
            }
        ]
    };

    try {
        if (safeMode) await deleteBookCollection(basicToken, userId, bearerToken);
        return await supertest(process.env.BASE_URL)
            .post(process.env.BOOKSTORE)
            .set(headers)
            .send(payload);

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    deleteBookCollection: deleteBookCollection,
    getBookList: getBookList,
	getIsbnList: getIsbnList,
	storeBook: storeBook
}