import express from "express"
import { addTransaction, fetchTransactions } from "../controllers/transaction.controller.js"
import { isAuth } from "../middleware/isAuth.js"

const router = express.Router()

router.post('/add', isAuth, addTransaction)
router.get("/fetch/:year_month", isAuth, fetchTransactions)
router.put("/update/:id", isAuth)

export default router
