'use client'
import { useUser, UserButton} from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image";
import Logo from "../../assets/Asset12.png"; 

const StoreNavbar = () => {

    const {user} = useUser()

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/store" className="relative text-4xl font-semibold text-slate-700">
                  <Image
                              src={Logo}  
                              alt="dQui Logo"
                              width={180}
                              height={48}
                              className="object-contain"
                              priority
                            />
            </Link>
            <div className="flex items-center gap-3">
                <p>Hi, {user?.firstName}</p>
                <UserButton />
            </div>
        </div>
    )
}

export default StoreNavbar