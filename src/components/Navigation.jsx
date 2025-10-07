import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Menu, X, Zap, ChevronDown, User, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { authAPI } from '../apis/auth'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      const isAuth = authAPI.isAuthenticated()
      const userData = authAPI.getStoredUser()
      setIsAuthenticated(isAuth)
      setUser(userData)
    }
    
    checkAuth()
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => { checkAuth() }
    // Listen for in-app auth changes (login/logout/register)
    const handleAuthChanged = () => { checkAuth() }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth-changed', handleAuthChanged)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-changed', handleAuthChanged)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setIsAuthenticated(false)
      setUser(null)
      toast.success('Logged out successfully!')
      // Redirect to home page
      window.location.hash = ''
    } catch (error) {
      toast.error('Error logging out. Please try again.')
      console.error('Logout error:', error)
    }
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto responsive-padding">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2 z-50">
              <Zap className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-white hidden sm:block">DesignSpace 3D</span>
              <span className="text-xl font-bold text-white sm:hidden">DS3D</span>
            </a>

            <div className="hidden lg:flex items-center space-x-8">
              <a href="#create" className="text-gray-300 hover:text-green-400 transition-colors">Create</a>
              <div className="relative group">
                {/* <button className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                  Tools <ChevronDown className="ml-1 h-4 w-4" />
                </button> */}
                <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md border border-gray-700 glass-panel shadow-lg z-50
                                opacity-0 translate-y-1 pointer-events-none transition-all duration-150 ease-out
                                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                  {/* <div className="py-2 text-sm text-gray-300">
                    <a href="#ai-tools" className="block px-3 py-2 hover:bg-gray-800/70 hover:text-green-400 rounded-sm">AI Tools</a>
                    <a href="#create-2d" className="block px-3 py-2 hover:bg-gray-800/70 hover:text-green-400 rounded-sm">2D Editor</a>
                    <a href="#create-3d" className="block px-3 py-2 hover:bg-gray-800/70 hover:text-green-400 rounded-sm">3D Viewer</a>
                  </div> */}
                </div>
              </div>
              {/* <a href="#pricing" className="text-gray-300 hover:text-green-400 transition-colors">Pricing</a> */}
              <a href="#blog" className="text-gray-300 hover:text-green-400 transition-colors">Blog</a>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Welcome, {user?.firstName || 'User'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <a href="#signin"><Button className="bg-green-600 hover:bg-green-700 glow-green-hover">Login</Button></a>
                </>
              )}
            </div>

            <div className="lg:hidden z-50">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="mobile-menu-open lg:hidden">
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <div className="flex-1 space-y-6">
              <a href="#create" className="block text-2xl font-semibold text-white hover:text-green-400 transition-colors" onClick={closeMenu}>Create</a>
              <a href="#templates" className="block text-2xl font-semibold text-white hover:text-green-400 transition-colors" onClick={closeMenu}>Templates</a>
              <a href="#ai-tools" className="block text-2xl font-semibold text-white hover:text-green-400 transition-colors" onClick={closeMenu}>AI Tools</a>
              <a href="#pricing" className="block text-2xl font-semibold text-white hover:text-green-400 transition-colors" onClick={closeMenu}>Pricing</a>
              <a href="#blog" className="block text-2xl font-semibold text-white hover:text-green-400 transition-colors" onClick={closeMenu}>Blog</a>
            </div>
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-300 mb-4">
                    <User className="h-5 w-5" />
                    <span>Welcome, {user?.firstName || 'User'}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                    className="w-full text-lg py-3 border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <a href="#signin" onClick={closeMenu}><Button className="w-full text-lg py-3 bg-green-600 hover:bg-green-700 glow-green-hover">Login</Button></a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}



