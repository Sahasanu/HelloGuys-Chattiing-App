const DotsLoading = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-screen max-w-screen ">
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
      <div className="h-4 w-4 bg-teal-700 rounded-full animate-bounce"></div>
    </div>
  );
};
export default DotsLoading;