import React from 'react'
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center">
                        <Link href='/'>
                            <Image src='/homeLogo.svg' alt='V-Chef logo'
                                width={180} height={56} priority/>
                        </Link>


                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a
                                href="#"
                                className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="#features"
                                className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#demo"
                                className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Demo
                            </a>
                            <a
                                href="#about"
                                className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50 mr-2"
                        >
                            <Link href='/sign-in'>
                            Login
                            </Link>
                            
                        </Button>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                           <Link href='/sign-up'>
                            Sign Up
                            </Link>
                            </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-orange-600"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar
