import supertest from "supertest";
async function generateBasicToken(username, password) {
	try {
		return Buffer.from(`${username}:${password}`).toString("base64");
	} catch (error) {
		console.error(error);
	}
}

async function authCheck(username, password, token) {
    var headers = {
		"authorization": "Basic " + token,
		"Content-Type": "application/json",
        "accept": "application/json"
	};
	var payload = {
        "userName": username,
  		"password": password
    };

    try {
		return await supertest(process.env.BASE_URL)
			.post('Account/v1/Authorized')
			.set(headers)
			.send(payload);
	} catch (error) {
		console.log(error);
	}
}

async function generateAuthToken(username, password, token) {
    var headers = {
		"authorization": "Basic " + token,
		"Content-Type": "application/json",
        "accept": "application/json"
	};
	var payload = {
        "userName": username,
  		"password": password
    };

    try {
		return await supertest(process.env.BASE_URL)
			.post('Account/v1/GenerateToken')
			.set(headers)
			.send(payload);
			// .expect((res) => {
			// 	console.log(res.body)
			//    });
	} catch (error) {
		console.log(error);
	}
}

async function getUser(username, password, token, bearer_token, user_id) {
	
    var headers = {
		"authorization": "Basic " + token,
		"Authorization": "Bearer " + bearer_token,
		"Content-Type": "application/json",
        "accept": "application/json",
		"Accept-Encoding": "gzip, deflate, br",
		"Connection": "keep-alive",
		"Cache-Control": "no-cache"
	};
	var payload = {
        "userName": username,
  		"password": password
    };

	var path_get_user = "Account/v1/User/" + user_id;
    try {
		return await supertest(process.env.BASE_URL)
			.get(path_get_user)
			.set(headers);
			// .expect((res) => {
			// 	console.log(res.body)
			//    });
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
    generateBasicToken: generateBasicToken,
    authCheck: authCheck,
	generateAuthToken: generateAuthToken,
	getUser: getUser
}