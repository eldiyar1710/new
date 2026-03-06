import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { isAuthed, logout, getUser } from '../lib/auth'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [userName, setUserName] = useState('')
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthed()
      setAuthed(authenticated)
      if (authenticated) {
        const user = getUser()
        setUserName(user?.name || '')
      }
    }
    checkAuth()
    window.addEventListener('auth-change', checkAuth)
    return () => window.removeEventListener('auth-change', checkAuth)
  }, [location])

  const handleLogout = () => {
    logout()
    setAuthed(false)
    setUserName('')
    setIsMenuOpen(false)
  }

  const navLinks = [
    { to: '/universities', label: 'Университеты' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Future Navigator</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.to ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {authed ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Привет, {userName}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Button size="sm">Войти</Button>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {authed ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Выйти
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
