import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Brain, Wand2, Camera, Sparkles, ArrowRight, Zap } from 'lucide-react'

export default function AiTools() {
  const tools = [
    { id: 1, name: 'Smart Wizard', description: 'Auto-generate room layouts based on dimensions and preferences', icon: Brain, features: ['Room size optimization', 'Furniture placement', 'Traffic flow analysis', 'Style matching'], badge: 'Most Popular', color: 'from-blue-600 to-purple-600' },
    { id: 2, name: 'Design Generator', description: 'Get AI-suggested furniture layouts and color schemes', icon: Wand2, features: ['Color palette generation', 'Furniture suggestions', 'Style coordination', 'Mood boards'], badge: 'New', color: 'from-green-600 to-teal-600' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6"><div className="p-4 bg-green-600 rounded-full glow-green"><Sparkles className="h-12 w-12 text-white" /></div></div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6"><span className="text-green-400">AI-Powered</span><br /><span className="neon-underline">Design Tools</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Let artificial intelligence accelerate your design process with smart suggestions, automated layouts, and instant 3D modeling</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tools.map(tool => {
              const Icon = tool.icon
              return (
                <Card key={tool.id} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5`}></div>
                  {tool.badge && (<div className="absolute top-4 right-4"><Badge className="bg-green-600 text-white">{tool.badge}</Badge></div>)}
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color}`}><Icon className="h-8 w-8 text-white" /></div>
                      <div><CardTitle className="text-2xl text-white">{tool.name}</CardTitle></div>
                    </div>
                    <CardDescription className="text-gray-400 text-lg">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (<li key={index} className="flex items-center gap-2 text-gray-300"><div className="w-2 h-2 bg-green-400 rounded-full"></div>{feature}</li>))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <a href="#create"><Button className="w-full bg-green-600 hover:bg-green-700 glow-green-hover">Try {tool.name} <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
                      <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">See AI Tools in Action</h2>
            <p className="text-xl text-gray-400">Watch how our AI transforms your design process</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">From Idea to Design in <span className="text-green-400">Seconds</span></h3>
              <div className="space-y-4">
                {[1,2,3].map((n) => (
                  <div className="flex items-start gap-4" key={n}>
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">{n}</div>
                    <div>
                      <h4 className="text-white font-semibold">{n === 1 ? 'Input Your Requirements' : n === 2 ? 'AI Analysis' : 'Instant Results'}</h4>
                      <p className="text-gray-400">{n === 1 ? 'Tell our AI about your space, style preferences, and functional needs' : n === 2 ? 'Our algorithms analyze thousands of design patterns and best practices' : 'Get multiple design options with furniture placement and color schemes'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#create"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green-hover">Start Designing with AI <Zap className="ml-2 h-5 w-5" /></Button></a>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden" />
              <div className="absolute inset-0 flex items-center justify-center"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green rounded-full w-16 h-16"><svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></Button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-green-900 to-green-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Design with AI?</h2>
          <p className="text-xl text-green-100 mb-8">Experience the future of interior design with our AI-powered tools</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#signup"><Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-4 glow-pulse">Start Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Button></a>
            <a href="#create"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800 text-lg px-8 py-4">Try Demo</Button></a>
          </div>
        </div>
      </section>
    </div>
  )
}


