import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Chat from "./Chat"

function Home() {
  return (
    <div className=' h-[100vh]'>
      <Navbar />
      <div className="flex gap-[10px]">
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default Home
