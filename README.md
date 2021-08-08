# ATM API example 🏧

This API implements a simple ATM, with balances, deposits, withdrawals and transfers. It benefits from the great [https://github.com/davibaltar/swagger-autogen](swagger-autogen) to generate a [https://swagger.io/](Swagger) OpenAPI documentation on `/docs` route.
The authentication is done using an unencrypted cookie that stores the e-mail of the user logged in (so, please, don't copy the technique if you're using it as a reference for any productive code), and it also works out-of-the-box in Swagger's Try It Out feature.

## Installation 🔧

It is as simple as running the `install` command of your preferred JS package manager. For starters, NPM works just fine:

```
npm install
```

## Running 🚀

The Swagger API specification needs to be generated before the project runs. You can build and then start the project:

```
npm run build
npm start
```

Some sort of filesystem watch was not provided to regenerate the specs during development, but the two commands listed above where encapsulated in an `npm run dev` command for simplicity.

## License 📖

You are free to use this code, modify it and redistribute it as long as you follow the [./LICENSE](MIT license).
If you do something nice with it, please, drop me a message so I can hear what sort of cool things you're up to ☺
