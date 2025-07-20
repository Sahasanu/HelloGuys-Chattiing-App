import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Chat from "./Chat"
import { Outlet } from "react-router-dom"

import Home from "./Home";

export default function Layout() {
    return (
        <div className=' h-[100vh] w-[100vw]'>
            <Navbar />
            <div className="flex gap-[10px] ">
                <div className="left  w-[28%] h-[90vh] ml-[5px]"><Sidebar /></div>
                <div className="w-[79%] mt-[5px] h-[90vh] rounded-[5px]">
                    <Outlet /> {/* This will render either Home or Chat based on route */}
                </div>
            </div>

        </div>
    )
}
