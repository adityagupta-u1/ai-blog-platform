import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  return (
    <aside className='sticky top-0 left-0 z-50'>
        <nav className='w-72 h-screen bg-gray-800 text-white px-8 py-8 flex flex-col justify-between'>
            <div className='flex flex-col gap-8'>
                <div className='text-2xl font-bold mb-4'>
                    AI BLog Plat.
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='text-lg  capitalize cursor-pointer'>
                        <Link href='/dashboard'>
                            overview
                        </Link>
                    </div>
                    <div className='text-lg  capitalize cursor-pointer'>
                    <Link href='/dashboard'>
                            posts
                        </Link>
                    </div>
                    <div className='text-lg  capitalize cursor-pointer'>
                        <Link href='/dashboard'>
                            Tags & Categories
                        </Link>
                    </div>
                    <div className='text-lg  capitalize cursor-pointer'>
                        <Link href='/dashboard'>
                            Analytics
                        </Link>
                    </div>
                    <div className='text-lg  capitalize cursor-pointer'>
                        <Link href='/dashboard'>
                            SEO
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex justify-between'>
                <div>
                    user icon
                </div>
                <div>
                    sign out option
                </div>
            </div>
        </nav>
    </aside>
  )
}
