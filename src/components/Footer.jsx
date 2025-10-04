import { Facebook, Twitter, Instagram, Youtube, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-white">DesignSpace 3D</span>
            </div>
            <p className="text-gray-400">Design in 2D & 3D with AI-powered tools. Create stunning interior designs effortlessly.</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <a href="#create" className="block text-gray-400 hover:text-green-400 transition-colors">Create Design</a>
              <a href="#templates" className="block text-gray-400 hover:text-green-400 transition-colors">Templates</a>
              <a href="#ai-tools" className="block text-gray-400 hover:text-green-400 transition-colors">AI Tools</a>
              <a href="#pricing" className="block text-gray-400 hover:text-green-400 transition-colors">Pricing</a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#blog" className="block text-gray-400 hover:text-green-400 transition-colors">Blog</a>
              <a href="#help" className="block text-gray-400 hover:text-green-400 transition-colors">Help Center</a>
              <a href="#tutorials" className="block text-gray-400 hover:text-green-400 transition-colors">Tutorials</a>
              <a href="#community" className="block text-gray-400 hover:text-green-400 transition-colors">Community</a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <a href="#about" className="block text-gray-400 hover:text-green-400 transition-colors">About Us</a>
              <a href="#contact" className="block text-gray-400 hover:text-green-400 transition-colors">Contact</a>
              <a href="#careers" className="block text-gray-400 hover:text-green-400 transition-colors">Careers</a>
              <a href="#privacy" className="block text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DesignSpace 3D. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}



