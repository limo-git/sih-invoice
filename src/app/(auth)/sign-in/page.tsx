"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
    // <div className="flex flex-col items-center justify-center min-h-screen py-2">
    //     <h1>{loading ? "Processing" : "Signup"}</h1>
    //     <hr />
    //     <label htmlFor="username">username</label>
    //     <input 
    //     className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
    //         id="username"
    //         type="text"
    //         value={user.username}
    //         onChange={(e) => setUser({...user, username: e.target.value})}
    //         placeholder="username"
    //         />
    //     <label htmlFor="email">email</label>
    //     <input 
    //     className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
    //         id="email"
    //         type="text"
    //         value={user.email}
    //         onChange={(e) => setUser({...user, email: e.target.value})}
    //         placeholder="email"
    //         />
    //     <label htmlFor="password">password</label>
    //     <input 
    //     className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
    //         id="password"
    //         type="password"
    //         value={user.password}
    //         onChange={(e) => setUser({...user, password: e.target.value})}
    //         placeholder="password"
    //         />
    //         <button
    //         onClick={onSignup}
    //         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{buttonDisabled ? "No signup" : "Signup"}</button>
    //         <Link href="/login">Visit login page</Link>

            
    //     </div>
    <div className=" w-full flex justify-center items-center translate-y-2/3">
        <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input  placeholder="Enter Username" id="username"
             type="text"
             value={user.username}
             onChange={(e) => setUser({...user, username: e.target.value})}
     />
            </div>
            
            <div className="flex flex-col space-y-1.5" >
              <Label htmlFor="name">Email</Label>
              <Input id="name" placeholder="Enter Email" type="text"
            value={user.email}
           onChange={(e) => setUser({...user, email: e.target.value})} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Password</Label>
              <Input id="name" placeholder="Enter Password" type="password"
             value={user.password}
             onChange={(e) => setUser({...user, password: e.target.value})}/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
      <Button><Link href="/login">Login</Link></Button>
      <button onClick={onSignup} className="px-4 py-2 rounded-[1rem] border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Sign Up
     </button>

        
      </CardFooter>
    </Card>
    </div>
        
    )

}