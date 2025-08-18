const Story = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 animate-fade-in">
            OUR STORY
          </h2>
          <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-6">
            <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <strong className="text-foreground">HARV DREAMS</strong> was born in the city of Takoradi, 
              built for the youth chasing dreams that are almost far-fetched.
            </p>
            <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Every thread is a reminder: doubt less, dream more, and live your vision.
            </p>
            <p className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <strong className="text-foreground">HARV DREAMS</strong> isn't just clothing, 
              it's the uniform of those daring to defy limits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;