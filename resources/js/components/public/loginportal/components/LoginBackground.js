import React, { Suspense, lazy } from 'react';

const LazyLoginBackground = lazy(() => import('../../../../../../public/images/loginbackground.svg'));

const LoginBackground = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '18px' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyLoginBackground />
      </Suspense>
    </div>
  );
};

export default LoginBackground;
