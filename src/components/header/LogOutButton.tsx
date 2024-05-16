"use client"
import axios from "axios"
import {DOMAIN} from "@/utils/constants"
import {toast} from "react-toastify"
import {useRouter} from 'next/navigation'
const LogOutButton = () => {
  const router = useRouter()
  const logoutHandler = async ()=>{
    try {
      await axios.get(`${DOMAIN}/api/users/logout`)
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.warning("Something went wrong")
      console.log(error)
    }
  }
  return (
    <button onClick={logoutHandler} className="bg-gray-700 text-gray-200">
      log out
    </button>
  )
}

export default LogOutButton