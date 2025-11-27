import './index.css'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { ArrowRight, Cuboid as Cube, Palette, Sparkles, Share2, Brain, Wand2, Star, FolderOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Create from './pages/Create'
import Pricing from './pages/Pricing'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import AiTools from './pages/AiTools'
import Blog from './pages/Blog'

function HomePage() {
  const [stats, setStats] = useState({ users: 0, projects: 0, renders: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setStats({
        users: Math.floor(50000 * progress),
        projects: Math.floor(250000 * progress),
        renders: Math.floor(1000000 * progress)
      })
      if (step >= steps) clearInterval(timer)
    }, increment)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="pt-16">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="float-animation absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-green-400 rounded-lg opacity-30"></div>
          <div className="float-animation absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-blue-400 rounded-full opacity-20" style={{animationDelay: '2s'}}></div>
          <div className="float-animation absolute bottom-40 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 rounded-lg opacity-25" style={{animationDelay: '4s'}}></div>
      </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center responsive-padding">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="neon-underline">Design in 2D & 3D</span>
            <br />
            <span className="text-green-400">with AI-powered tools</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create stunning interior designs effortlessly. From floor plans to 3D renders, bring your vision to life with our advanced design platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#create"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green-hover text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">Get Started <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Button></a>
            <a href="#create"><Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">Browse Templates</Button></a>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.users.toLocaleString()}+</div><div className="text-gray-400">Active Users</div></div>
            <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.projects.toLocaleString()}+</div><div className="text-gray-400">Projects Created</div></div>
            <div className="text-center"><div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.renders.toLocaleString()}+</div><div className="text-gray-400">Renders Generated</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Everything you need to <span className="text-green-400">design</span></h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">Professional-grade tools that make interior design accessible to everyone</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Cube, title: 'Create Floor Plans', desc: 'Design detailed 2D floor plans with precision tools and smart snapping' },
              { icon: Palette, title: 'Design Rooms', desc: 'Visualize your space in stunning 3D with real-time rendering' },
              { icon: Sparkles, title: 'Furnish & Decorate', desc: 'Access thousands of furniture items and materials from top brands' },
              { icon: Share2, title: 'Render & Share', desc: 'Generate photorealistic renders and share your designs instantly' }
            ].map((feature, index) => (
              <Card key={index} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mb-4 mx-auto" />
                  <CardTitle className="text-white text-lg sm:text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"><span className="text-green-400">AI-Powered</span> Design Tools</h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">Let artificial intelligence accelerate your design process</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Brain, title: 'Smart Wizard', desc: 'Auto-generate room layouts based on dimensions and preferences' },
              { icon: Wand2, title: 'Design Generator', desc: 'Get AI-suggested furniture layouts and color schemes' },
              { icon: Share2, title: 'Project Manager', desc: 'Organize, save, and manage all your design projects in one place' }
            ].map((tool, index) => (
              <Card key={index} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <tool.icon className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mb-4" />
                  <CardTitle className="text-white text-lg sm:text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">{tool.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href={tool.title === 'Project Manager' ? '#create' : '#ai-tools'}><Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base">Try {tool.title}</Button></a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Manage your <span className="text-green-400">projects</span> effortlessly</h2>
            <p className="text-lg sm:text-xl text-gray-400">Organize, collaborate, and track all your design projects in one powerful workspace</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: FolderOpen, title: 'Save & Organize', desc: 'Save unlimited projects with custom names and descriptions. Access them anytime, anywhere.' },
              { icon: Share2, title: 'Export & Share', desc: 'Export your designs as 3D models (.glb) or share project files with your team and clients.' },
              { icon: Cube, title: 'Version Control', desc: 'Track changes with undo/redo history. Never lose your work with automatic session saving.' }
            ].map((feature, index) => (
              <Card key={index} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <feature.icon className="h-10 w-10 sm:h-12 sm:h-12 text-green-400 mb-4 mx-auto" />
                  <CardTitle className="text-white text-lg sm:text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">{feature.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="#create"><Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base">Get Started</Button></a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Loved by <span className="text-green-400">designers</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Interior Designer', rating: 5, text: 'DesignSpace 3D has revolutionized my workflow. The AI tools save me hours on every project.' },
              { name: 'Mike Chen', role: 'Architect', rating: 5, text: 'The 3D visualization quality is incredible. My clients love seeing their spaces come to life.' },
              { name: 'Emma Davis', role: 'Homeowner', rating: 5, text: 'As someone with no design experience, this platform made it easy to redesign my entire home.' }
            ].map((testimonial, index) => (
              <Card key={index} className="glass-panel">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-green-400 text-green-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-300 text-base">"{testimonial.text}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding bg-gradient-to-r from-green-900 to-green-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">Ready to start designing?</h2>
          <p className="text-lg sm:text-xl text-green-100 mb-8">Join thousands of designers creating amazing spaces with DesignSpace 3D</p>
          <a href="#signup"><Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 glow-pulse">Start Free Trial <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Button></a>
        </div>
      </section>
      </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const isCreate = route === '#create'
  const isPricing = route === '#pricing'
  const isSignin = route === '#signin'
  const isSignup = route === '#signup'
  const isAiTools = route === '#ai-tools'
  const isBlog = route === '#blog'
  return (
    <div className="dark bg-gray-900 text-gray-100 min-h-screen">
      <Navigation />
      {isCreate ? <Create /> : isPricing ? <Pricing /> : isSignin ? <Signin /> : isSignup ? <Signup /> : isAiTools ? <AiTools /> : isBlog ? <Blog /> : <HomePage />}
      {!isCreate && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151'
        }}
      />
    </div>
  )
}
