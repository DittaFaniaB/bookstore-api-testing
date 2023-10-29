# End to End API Automation using WDIO

## API

- **API**: BOOKSTORE API in Swagger
- **Link**: https://bookstore.toolsqa.com/swagger/


## API list to test

1. **POST:** /BookStore/v1/Books
2. **DELETE:** /BookStore/v1/Books

## Requirement

- [Node.js](https://nodejs.org/) .

## Getting Started

Follow these steps to get started with the project:

1. Clone this repository to your local machine:

   ```
   git clone <repository_url>
   ```
2. Change into directory project:

```
cd <project_directory>
```

3. Install project dependencies using npm:

```
npm install
```

4. Create .env files

create .env files and variables to use in the project

## Running the Tests
To run the tests, follow these steps:

1. Run the WebdriverIO tests:

```
npm run wdio
```

2. Generate a test report using the Allure command:

```
allure generate
```
