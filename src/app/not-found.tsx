
import Link from 'next/link';
import React from 'react'

function NotFound() {
  return (
    <div className="mt-24 max-w-screen  flex flex-col gap-6 items-center justify-center">
      <h1 className='lg:text-7xl md:text-6xl text-3xl font-display'>
        <span className='text-primary'>404!</span> Page Not Found
      </h1>
      <Link className='underline text-primary font-semibold text-sm ' href={"/"}> Go back to home</Link>
    </div>
  );
}

export default NotFound