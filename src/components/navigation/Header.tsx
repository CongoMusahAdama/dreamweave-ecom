import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  variant?: 'solid' | 'transparent';
}

const Header = ({ variant = 'solid' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const isProductsPage = location.pathname === '/products';
  const isTransparent = variant === 'transparent';

  const navItems = [
    { path: '/products', label: 'Products' },
    { path: '/gallery', label: 'Gallery' }
  ];

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isHomePage 
      ? isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
        : 'bg-transparent'
      : 'bg-white/95 backdrop-blur-sm shadow-sm'
    }
  `;

  // Professional scroll behavior for homepage
  const navbarStyle = isHomePage ? {
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95) !important' : 'transparent !important',
    backdropFilter: isScrolled ? 'blur(8px) !important' : 'none !important',
    boxShadow: isScrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1) !important' : 'none !important',
    border: 'none !important',
    transition: 'all 0.3s ease-in-out !important'
  } : {};



  const textColorClass = isHomePage && !isScrolled ? 'text-white' : 'text-foreground';
  const navTextColorClass = isHomePage && !isScrolled ? 'text-white/90 hover:text-white' : 'text-muted-foreground hover:text-army-green';
  const activeNavTextColorClass = isHomePage && !isScrolled ? 'text-white' : 'text-army-green';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <header className={headerClasses} style={navbarStyle}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Navigation */}
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? activeNavTextColorClass
                      : navTextColorClass
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5b904431-50ea-45f9-a2e1-42008eaf5466.png" 
                alt="HARV DREAMS" 
                className="h-12 w-auto md:h-16"
              />
            </Link>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {(isHomePage || isProductsPage) && (
                <>
                  {isSearchOpen ? (
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 h-9 text-sm"
                        autoFocus
                      />
                      <Button type="submit" size="sm" variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="ghost" 
                        onClick={toggleSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <Button variant="outline" size="sm" onClick={toggleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  )}
                </>
              )}
              {(isHomePage || isProductsPage) && (
                <Link to="/products">
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shop
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-army-green text-white text-xs">
                      0
                    </Badge>
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isHomePage && !isScrolled ? 'text-white hover:bg-white/10' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isHomePage && !isScrolled ? 'bg-black/20 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? isHomePage && !isScrolled ? 'text-white bg-white/10' : 'text-army-green bg-army-green/10'
                      : isHomePage && !isScrolled ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-army-green'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-4 pt-4 space-y-2">
                {(isHomePage || isProductsPage) && (
                  <form onSubmit={handleSearch} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 h-9 text-sm"
                      />
                      <Button type="submit" size="sm" variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}
                {(isHomePage || isProductsPage) && (
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full relative"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Shop
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-army-green text-white text-xs">
                        0
                      </Badge>
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
