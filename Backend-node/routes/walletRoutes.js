const router = require('express').Router()
const { createWallet, getBalance, chargeMoney, payMoney } = require('../controllers/walletController')
const { checkAuth } = require('../middleware/checkAuth')

router.route('/userWallet')
  .post(checkAuth, createWallet)
  .get(checkAuth, getBalance)

router.post('/userWallet/charge', checkAuth, chargeMoney)
router.post('/userWallet/pay', checkAuth, payMoney)

module.exports = router