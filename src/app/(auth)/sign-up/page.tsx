import { signIn } from "@/auth"
 
//this would be a separate function for sign in with google
export default function SignInWithGoogle() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 