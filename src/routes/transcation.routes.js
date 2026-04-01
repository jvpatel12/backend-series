const auth =  require('../middleware/auth.middlware')
const transactionController = require('../controller/transcation.controller')


const routes  = require('express').Router();


routes.post('/',auth.authMiddleware,transactionController.createTransaction);
routes.post('/system/initial-funds',auth.authSystemUserMiddleware,transactionController.createSystemInitialFunds);
routes.get('/balance/:accountId',auth.authMiddleware,transactionController.getBalance);

module.exports = routes;
