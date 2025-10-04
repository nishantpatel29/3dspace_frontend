import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Check, X, Zap, Crown, Building, ArrowRight } from 'lucide-react'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      yearlyPrice: '$0',
      period: 'forever',
      description: 'Perfect for getting started with basic design tools',
      icon: Zap,
      popular: false,
      features: [
        { name: '2D Floor Plans', included: true },
        { name: 'Basic 3D Visualization', included: true },
        { name: '5 Projects', included: true },
        { name: 'Standard Templates', included: true },
        { name: 'Basic Furniture Library', included: true },
        { name: 'HD Renders', included: false },
        { name: 'AI Design Tools', included: false },
        { name: 'Premium Templates', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Team Collaboration', included: false },
      ],
    },
    {
      name: 'Pro',
      price: '$19',
      yearlyPrice: '$15',
      period: 'per month',
      description: 'Advanced tools for professional designers and enthusiasts',
      icon: Crown,
      popular: true,
      features: [
        { name: '2D Floor Plans', included: true },
        { name: 'Advanced 3D Visualization', included: true },
        { name: 'Unlimited Projects', included: true },
        { name: 'All Templates', included: true },
        { name: 'Premium Furniture Library', included: true },
        { name: '4K HD Renders', included: true },
        { name: 'AI Design Tools', included: true },
        { name: 'Premium Templates', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Team Collaboration', included: false },
      ],
    },
    {
      name: 'Enterprise',
      price: '$49',
      yearlyPrice: '$39',
      period: 'per month',
      description: 'Complete solution for teams and design agencies',
      icon: Building,
      popular: false,
      features: [
        { name: '2D Floor Plans', included: true },
        { name: 'Advanced 3D Visualization', included: true },
        { name: 'Unlimited Projects', included: true },
        { name: 'All Templates', included: true },
        { name: 'Premium Furniture Library', included: true },
        { name: '8K HD Renders', included: true },
        { name: 'AI Design Tools', included: true },
        { name: 'Premium Templates', included: true },
        { name: '24/7 Priority Support', included: true },
        { name: 'Team Collaboration', included: true },
      ],
    },
  ]

  const faqs = [
    { question: 'Can I change my plan at any time?', answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle." },
    { question: 'Is there a free trial for paid plans?', answer: "Yes, we offer a 14-day free trial for both Pro and Enterprise plans. No credit card required." },
    { question: 'What happens to my projects if I downgrade?', answer: "Your projects will remain accessible, but some premium features may be limited based on your new plan." },
    { question: 'Do you offer refunds?', answer: "We offer a 30-day money-back guarantee for all paid plans if you're not satisfied with our service." },
    { question: 'Can I use DesignSpace 3D offline?', answer: "DesignSpace 3D is a web-based application that requires an internet connection. However, we're working on offline capabilities for future releases." },
    { question: 'Is there a student discount?', answer: 'Yes! Students and educators can get 50% off Pro and Enterprise plans with valid academic credentials.' },
  ]

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName)
    alert(`Selected ${planName} plan! Redirecting to checkout...`)
  }

  return (
    <div className="pt-16 min-h-screen">
      <section className="py-16 sm:py-20 responsive-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"><span className="neon-underline">Choose Your Plan</span></h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">Start free and upgrade as your design needs grow</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={isYearly} onChange={e => setIsYearly(e.target.checked)} />
              <div className={`w-14 h-7 rounded-full cursor-pointer transition-colors ${isYearly ? 'bg-green-600' : 'bg-gray-700'}`} onClick={() => setIsYearly(!isYearly)}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isYearly ? 'translate-x-8' : 'translate-x-1'}`}></div>
              </div>
            </div>
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
            {isYearly && (<Badge className="bg-green-600 text-white ml-2">Save 20%</Badge>)}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map(plan => {
              const Icon = plan.icon
              const currentPrice = isYearly ? plan.yearlyPrice : plan.price
              const savings = isYearly && plan.name !== 'Free' ? `Save $${(parseInt(plan.price.replace('$', '')) - parseInt(plan.yearlyPrice.replace('$', ''))) * 12}/year` : null
              return (
                <Card key={plan.name} className={`glass-panel relative transition-all duration-300 hover:scale-105 ${plan.popular ? 'glow-green border-green-400 scale-105' : 'glow-green-hover'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white px-4 py-1 text-sm">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full ${plan.popular ? 'bg-green-600' : 'bg-gray-800'}`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                    <div className="mt-4"><span className="text-4xl sm:text-5xl font-bold text-white">{currentPrice}</span><span className="text-gray-400 ml-2">/{plan.period}</span></div>
                    {savings && (<div className="text-green-400 text-sm mt-2">{savings}</div>)}
                    <CardDescription className="text-gray-400 mt-2 text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button onClick={() => handlePlanSelect(plan.name)} className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700 glow-green-hover' : 'bg-gray-700 hover:bg-gray-600'}`} size="lg" disabled={selectedPlan === plan.name}>
                      {selectedPlan === plan.name ? 'Selected' : (<><span>{plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}</span><ArrowRight className="ml-2 h-4 w-4" /></>)}
                    </Button>
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">What's included:</h4>
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {feature.included ? (<Check className="h-5 w-5 text-green-400 flex-shrink-0" />) : (<X className="h-5 w-5 text-gray-500 flex-shrink-0" />)}
                          <span className={`text-sm ${feature.included ? 'text-white' : 'text-gray-500'}`}>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="glass-panel max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-xl">Need a custom solution?</CardTitle>
                <CardDescription className="text-gray-400">Contact our sales team for enterprise pricing and custom features</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="#contact"><Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900">Contact Sales</Button></a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <a href="#contact"><Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900">Contact Support</Button></a>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 responsive-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to start designing?</h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-8">Join thousands of designers creating amazing spaces</p>
          <a href="#signup"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green-hover text-lg px-8 py-4">Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Button></a>
        </div>
      </section>
    </div>
  )
}


