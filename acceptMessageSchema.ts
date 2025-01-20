import {z} from "zod"

const acceptMessageSchema = z.object({
    isAccepting : z.boolean()
})