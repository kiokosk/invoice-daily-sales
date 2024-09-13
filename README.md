

## Description
A system where users can create invoices for sales transactions. The system automatically generates a daily sales summary report and sends it via email at 12:00 PM each day. The report is sent through a RabbitMQ queue, where a separate consumer service  process the email sending.


## Project setup

```bash
$ npm install
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
##  API

postman
<!--  POST -->
localhost:3000/invoices/

<!-- get all -->
get
localhost:3000/invoices/

<!-- get one by id -->
get 
localhost:3000/invoices/id

<!-- sales-report -->
http://localhost:3000/email/send-sales-report



