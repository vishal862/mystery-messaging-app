import {z} from "zod"

export const usernameVerified = z
.string()
.min(2, "username must have atleast 2 characters")
.max(8, "username must have at most 8 characters")
.regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")

export const signUpSchema = z.object({
    username : usernameVerified,
    email : z.string().email({message : "invalid email"}),
    password : z.string().min(6,{message:"password must atleast 2 characters"})
})