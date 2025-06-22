import React, { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./LazyComponent'));

const App = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    }>
      <LazyComponent />
    </Suspense>
  );
};

export default App;