import React from 'react'

const Footer = () => {
    return (
        <footer
            id="contact"
            className="bg-gray-800 text-white py-12 px-4 md:px-8 lg:px-16"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Cook Smart with AI</h3>
                        <p className="text-gray-300">
                            Transform your ingredients into delicious recipes with our
                            AI-powered cooking assistant.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Features</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Voice-Guided Cooking
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Instant Recipe Suggestions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Zero Waste Meals
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Personalized Flavors
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Blog
                                </a>
                            </li>
                    
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">                            
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Cookie Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} V-Chef. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
