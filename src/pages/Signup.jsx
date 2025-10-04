import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Checkbox } from '../components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Zap } from 'lucide-react'
import { toast } from 'react-toastify'
import { authAPI, authValidation } from '../apis/auth'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeToTerms: false 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validate form
    const validation = authValidation.validateRegistrationForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsLoading(false)
      return
    }

    try {
      const result = await authAPI.register(formData)
      
      if (result.success) {
        toast.success(result.message || 'Account created successfully! Welcome to DesignSpace 3D!')
        // Redirect to create page after successful registration
        setTimeout(() => {
          window.location.hash = '#create'
        }, 1500)
      } else {
        toast.error(result.message || 'Registration failed. Please try again.')
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4"><Zap className="h-12 w-12 text-green-400" /></div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start designing amazing spaces today</p>
        </div>
        <Card className="glass-panel glow-green">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign Up</CardTitle>
            <CardDescription className="text-center text-gray-400">Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="space-y-3">
              <Button variant="outline" className="w-full border-gray-600 hover:border-green-400 hover:bg-green-400/10">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full border-gray-600 hover:border-green-400 hover:bg-green-400/10">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Continue with Facebook
              </Button>
            </div> */}
            <div className="relative">
              {/* <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div> */}
              {/* <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span></div> */}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="John" 
                      value={formData.firstName} 
                      onChange={(e) => handleInputChange('firstName', e.target.value)} 
                      className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Doe" 
                    value={formData.lastName} 
                    onChange={(e) => handleInputChange('lastName', e.target.value)} 
                    className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                    className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create a strong password" 
                    value={formData.password} 
                    onChange={(e) => handleInputChange('password', e.target.value)} 
                    className={`pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-green-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="confirmPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                    className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)} 
                  className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" 
                />
                <Label htmlFor="terms" className="text-sm text-gray-400">I agree to the <a href="#terms" className="text-green-400 hover:text-green-300">Terms of Service</a> and <a href="#privacy" className="text-green-400 hover:text-green-300">Privacy Policy</a></Label>
              </div>
              {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 glow-green-hover" 
                size="lg" 
                disabled={!formData.agreeToTerms || isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-gray-400">Already have an account? <a href="#signin" className="text-green-400 hover:text-green-300 font-medium">Sign in</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


