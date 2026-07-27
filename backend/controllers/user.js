import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid"
import jwt from "jsonwebtoken"
// sign up function
export const signup = async (req, res) => {
    try {
        // step - 1: Check for req.body
        if (!req.body) {
            return res.status(400).json({
                message: "Bad request",
                success: false
            })
        }

        // step - 2: Get user Inputs and check for inputs
        const { name, email, password } = req.body;
        if (!(name && password && email)) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        // step 3: check for user with email
        const existingUser = await sql`
        SELECT email FROM users WHERE email = ${email} LIMIT 1
        `
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Emial already exist",
                success: false
            })
        }

        // step 4: create id and  hash the password
        const id = uuid()
        const hpassword = await bcrypt.hash(password, 10);

        // step 5: insert user to database
        const user = await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${id}, ${name}, ${email}, ${hpassword})
        RETURNING *;
        `

        if (user.length === 0) {
            return res.status(400).json({
                message: "User not creted",
                success: false
            })
        }

        // step-6:  create token
        const token = jwt.sign({ id }, process.env.JWT_SECRET);

        // step 7: send response back to frontend
        res.status(201).json({
            message: "Account created successfully",
            success: true,
            token,
            user: {
                name: user[0].name,
                email: user[0].email,
                id: user[0].id,
                created_at: user[0].created_at
            }
        })


    } catch (error) {
        console.log("Error in signup controller", error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

// login function
export const login = async (req, res) => {
    try {
        // step - 1: Check for req.body
        if (!req.body) {
            return res.status(400).json({
                message: "Bad request",
                success: false
            })
        }

        // step - 2: Get user Inputs and check for inputs
        const { email, password } = req.body;
        if (!(password && email)) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        // step 3: check for user with email
        const user = await sql`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
        `
        if (user.length === 0) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // step 4: Check password
        const isVerified = await bcrypt.compare(password, user[0].password);
        if (!isVerified) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            })
        }

        // step 5: create token 
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);

        // step 6: Send response back to frontend
        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: {
                name: user[0].name,
                email: user[0].email,
                id: user[0].id,
                created_at: user[0].created_at
            }
        })
    } catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// check me
export const checkMe = async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(401).json({
                message: "Unauthorized: No id found",
                success: false
            })
        }

        // check for user with id
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }
        res.status(200).json({
            success: true,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                created_at: user[0].created_at
            },
        })

    } catch (error) {
        console.log("Error in check me controller", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }

}

// chage password
export const changePassword = async (req, res) => {

}