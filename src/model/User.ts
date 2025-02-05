import mongoose,{Schema,Document} from "mongoose";

export interface IMessage extends Document{
    content : string,
    createdAt : Date
}
 
const messageSchema = new Schema<IMessage>({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IUser extends Document{
    username : string,
    email : string,
    phoneNumber : string
    password : string,
    verifyCode : string
    verifyCodeExpiry : Date,
    isVerified : boolean
    isAcceptingMessages : boolean,
    message : IMessage[]
}

const userSchema = new Schema<IUser>({
    username : {
        type : String,
        required : [true, "username is required"],
        trim : true,
        unique : true 
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    phoneNumber : {
        type : String,
        required : [true, "Phone Number is required"],
        match: [/^(?:\+91|91)?[789]\d{9}$/, 'Invalid phone number format'],
    },
    password : {
        type : String,
        required : [true, "password is required"],
    },
    verifyCode : {
        type : String,
        required : [true, "vefification code is required"]
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "vefification code is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
      },
    message : [messageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || (mongoose.model<IUser>('User',userSchema))

export default UserModel