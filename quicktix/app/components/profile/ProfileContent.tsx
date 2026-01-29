'use client'

import { useState, useEffect } from 'react'

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '@/app/lib/hooks'
import apiService from '@/app/lib/services'



export default function ProfileContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    bio: ''
  })

  // Address Information
  const [addressInfo, setAddressInfo] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
  })

  // Password Change
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  })

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        bio: user.bio || ''
      })

      setAddressInfo({
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || 'NEPAL'
      })

      setNotifications({
        email_notifications: user.email_notifications ?? true,
        sms_notifications: user.sms_notifications ?? false,
      })
    }
  }, [user])

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedUser = await apiService.user.updateProfile(personalInfo)
      toast.success('Personal information updated successfully!')

      // Update local user state if needed
      if (user) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update personal information'
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedUser = await apiService.user.updateProfile(addressInfo)
      toast.success('Address updated successfully!')

      // Update local user state
      if (user) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update address'
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNotifications = async () => {
    setLoading(true)

    try {
      const updatedUser = await apiService.user.updateProfile(notifications)
      toast.success('Notification preferences updated!')

      // Update local user state
      if (user) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update preferences'
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.new_password2) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await apiService.user.changePassword(passwordData)
      toast.success(response.message || 'Password changed successfully!')

      // Clear password fields
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password2: ''
      })
    } catch (error: any) {
      // Handle specific error messages from backend
      const errorMessage = error.errors?.old_password?.[0] ||
        error.errors?.new_password?.[0] ||
        error.message ||
        'Failed to change password'
      toast.error(errorMessage)
      console.error('Password change error:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const getRoleBadge = () => {
    const roleColors = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      organizer: 'bg-purple-100 text-purple-700 border-purple-200',
      user: 'bg-blue-100 text-blue-700 border-blue-200'
    }

    const roleIcons = {
      admin: Shield,
      organizer: Briefcase,
      user: User
    }

    const color = roleColors[user?.role as keyof typeof roleColors] || roleColors.user
    const Icon = roleIcons[user?.role as keyof typeof roleIcons] || User

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${color}`}>
        <Icon className="w-4 h-4" />
        {user?.role?.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          {/* Profile Picture */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </div>
              <button className="absolute bottom-2 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors duration-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
            {getRoleBadge()}
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Account Stats */}
          {user?.role === 'user' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Account Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{new Date(user.date_joined || '').getFullYear()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'organizer' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Organizer Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Created</span>
                  <span className="font-semibold">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets Sold</span>
                  <span className="font-semibold">589</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Update your personal details</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePersonalInfo} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.first_name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, first_name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.last_name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, last_name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.username}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, username: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={personalInfo.phone_number}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone_number: e.target.value })}
                      className="input pl-10"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={personalInfo.date_of_birth}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, date_of_birth: e.target.value })}
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={personalInfo.bio}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                      rows={4}
                      className="input"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
                  <p className="text-gray-600">Update your location details</p>
                </div>
              </div>

              <form onSubmit={handleUpdateAddress} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={addressInfo.address_line1}
                    onChange={(e) => setAddressInfo({ ...addressInfo, address_line1: e.target.value })}
                    className="input"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressInfo.address_line2}
                    onChange={(e) => setAddressInfo({ ...addressInfo, address_line2: e.target.value })}
                    className="input"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressInfo.city}
                      onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={addressInfo.state}
                      onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={addressInfo.postal_code}
                      onChange={(e) => setAddressInfo({ ...addressInfo, postal_code: e.target.value })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressInfo.country}
                      onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-gray-600">Manage your password and security</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Password Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                      className="input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={passwordData.new_password2}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password2: e.target.value })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication (Future Feature) */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Enable 2FA</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn-outline btn-md">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-gray-600">Choose how you want to be notified</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-5 h-5 text-primary-600" />
                        <h3 className="font-bold text-gray-900">Email Notifications</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Receive booking confirmations, event reminders, and updates via email
                      </p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Booking confirmations</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Event reminders</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-gray-700">Promotional offers</span>
                        </label>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email_notifications}
                        onChange={(e) => {
                          setNotifications({ ...notifications, email_notifications: e.target.checked })
                          handleUpdateNotifications()
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-6 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-primary-600" />
                        <h3 className="font-bold text-gray-900">SMS Notifications</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Get text messages for important updates and reminders
                      </p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-700">Booking confirmations</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-700">Event day reminders</span>
                        </label>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.sms_notifications}
                        onChange={(e) => {
                          setNotifications({ ...notifications, sms_notifications: e.target.checked })
                          handleUpdateNotifications()
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                {user?.role === 'organizer' && (
                  <div className="p-6 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-primary-600" />
                          <h3 className="font-bold text-gray-900">Organizer Notifications</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Get notified about event bookings and updates
                        </p>
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-gray-700">New bookings</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-gray-700">Booking cancellations</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-gray-700">Daily sales reports</span>
                          </label>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Your notification preferences are saved automatically when you toggle any switch.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}