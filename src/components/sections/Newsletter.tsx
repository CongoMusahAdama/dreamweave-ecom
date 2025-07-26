import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription via Supabase
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-army-green text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 animate-scale-in">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            JOIN THE <span className="text-white/80">DREAM</span>
          </h2>
          
          <p className="text-lg text-white/80 mb-8 animate-fade-in">
            Be the first to know about new drops, exclusive campaigns, and 
            behind-the-scenes stories from HARV DREAMS.
          </p>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-slide-up">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
              />
              <Button 
                type="submit"
                className="bg-white text-army-green hover:bg-white/90 font-semibold px-8 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="animate-scale-in">
              <div className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">Welcome to the Dream!</h3>
                <p className="text-white/80">You're now part of the HARV DREAMS community.</p>
              </div>
            </div>
          )}

          {/* Social Proof */}
          <p className="text-sm text-white/60 mt-6">
            Join 1,000+ dreamers already in the community
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;