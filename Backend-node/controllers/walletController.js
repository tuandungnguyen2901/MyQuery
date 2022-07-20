const Wallet = require('../model/walletModel')

exports.createWallet = async (req, res, next) => {
  try {
    
    if (!req.userId) return res.status(403).json({ msg: 'Unauthorzied' })
    const wallet = await Wallet.findOne({ userId: req.userId })
    if (wallet) return res.status(400).json({ msg: 'You already created e-wallet' })
    const newWallet = await Wallet.create({
      userId: req.userId
    })
    return res.status(201).json(newWallet)
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Something went wrong' })
  }
}

exports.getBalance = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(403).json({ msg: 'Unauthorzied' })
    const wallet = await Wallet.findOne({ userId: req.userId })
    if (!wallet) return res.status(404).json({ msg: 'E-wallet not found. Please create your e-wallet!' })
    return res.status(200).json(wallet.balance)
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Something went wrong' })
  }
}

exports.chargeMoney = async (req, res, next) => {
  const { amount } = req.body
  try {
    if (isNaN(Number(amount)) || amount < 0)
      return res.status(400).json({ msg: 'Invalid charge amount' })
    if (!req.userId) return res.status(403).json({ msg: 'Unauthorzied' })
    const wallet = await Wallet.findOne({ userId: req.userId })
    if (!wallet) return res.status(404).json({ msg: 'E-wallet not found. Please create your e-wallet!' })
    const updateWallet = await Wallet.findOneAndUpdate({ userId: req.userId }, {
      balance: Number(wallet.balance + amount)
    }, {
      new: true, runValidators: true
    })
    return res.status(200).json(updateWallet)
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Something went wrong' })
  }
}

exports.payMoney = async (req, res, next) => {
  const { amount } = req.body
  try {
    if (isNaN(Number(amount)) || amount < 0)
      return res.status(400).json({ msg: 'Invalid charge amount' })
    if (!req.userId) return res.status(403).json({ msg: 'Unauthorzied' })
    const wallet = await Wallet.findOne({ userId: req.userId })
    if (!wallet) return res.status(404).json({ msg: 'E-wallet not found. Please create your e-wallet!' })
    if (amount > wallet.balance)
      return res.status(400).json({ msg: 'Not enough balance' })
    const updateWallet = await Wallet.findOneAndUpdate({ userId: req.userId }, {
      balance: wallet.balance - amount
    }, {
      new: true, runValidators: true
    })
    return res.status(200).json(updateWallet)
  } catch (error) {
    return res.status(500).json({ msg: error.message || 'Something went wrong' })
  }
}
