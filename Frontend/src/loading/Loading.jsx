const DotsLoading = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-screen w-screen bg-black">
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce"></div>
    </div>
  );
};
export default DotsLoading;