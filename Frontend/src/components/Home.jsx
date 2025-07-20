
import home from '../assets/home.png'

function Home() {

  return (
    <div className='w-[100%] h-[89vh] rounded-[10px] flex items-center justify-center bg-gray-800 '>
      <div className=''>
        <img className='w-[400px]'  src={home} alt="" />
        <p className='text-center text-[25px] text-gray-400'>Start a Chat </p>
      </div>
    </div>
  );
}

export default Home;