import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Calendar, Clock, ArrowRight, BookOpen, Lightbulb, TrendingUp } from 'lucide-react'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with 2D Floor Planning',
      excerpt: 'Learn how to create professional floor plans using our intuitive 2D design tools. From drawing walls to adding rooms, master the basics in minutes.',
      category: 'Tutorial',
      date: '2024-01-15',
      readTime: '5 min read',
      icon: BookOpen
    },
    {
      id: 2,
      title: '10 Interior Design Trends for 2024',
      excerpt: 'Discover the latest trends in interior design, from minimalist aesthetics to sustainable materials. Get inspired for your next project.',
      category: 'Trends',
      date: '2024-01-10',
      readTime: '8 min read',
      icon: TrendingUp
    },
    {
      id: 3,
      title: 'Maximizing Small Spaces with Smart Design',
      excerpt: 'Expert tips on making the most of compact living spaces. Learn space-saving furniture arrangements and clever storage solutions.',
      category: 'Tips',
      date: '2024-01-05',
      readTime: '6 min read',
      icon: Lightbulb
    },
    {
      id: 4,
      title: 'Using AI to Generate Room Layouts',
      excerpt: 'Explore how our AI-powered design tools can help you create optimal room layouts automatically. Save time and get professional results.',
      category: 'Features',
      date: '2024-01-01',
      readTime: '7 min read',
      icon: BookOpen
    },
    {
      id: 5,
      title: 'Color Psychology in Interior Design',
      excerpt: 'Understand how different colors affect mood and perception in your living spaces. Choose the perfect palette for every room.',
      category: 'Design',
      date: '2023-12-28',
      readTime: '9 min read',
      icon: Lightbulb
    },
    {
      id: 6,
      title: 'Exporting and Sharing Your 3D Designs',
      excerpt: 'A complete guide to exporting your designs as 3D models and sharing them with clients, contractors, and team members.',
      category: 'Tutorial',
      date: '2023-12-25',
      readTime: '4 min read',
      icon: BookOpen
    }
  ]

  const categories = ['All', 'Tutorial', 'Trends', 'Tips', 'Features', 'Design']

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <section className="py-16 sm:py-20 responsive-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Design <span className="text-green-400">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Learn, get inspired, and stay updated with the latest in interior design, tips, tutorials, and industry trends.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === 'All' ? 'default' : 'outline'}
                className={cat === 'All' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <post.icon className="h-5 w-5 text-green-400" />
                    <span className="text-xs text-green-400 font-semibold uppercase">{post.category}</span>
                  </div>
                  <CardTitle className="text-white text-xl sm:text-2xl mb-3">{post.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base mb-4">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="glass-panel bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-700">
              <CardContent className="py-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Stay Updated</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  Subscribe to our newsletter and never miss a design tip, tutorial, or industry update.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                  <Button className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

