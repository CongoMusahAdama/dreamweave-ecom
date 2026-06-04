const Story = () => {
  return (
    <section className="py-24 md:py-40 bg-white border-t border-black/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="flex-1 max-w-2xl">
            <p className="label-caps mb-6">Brand Philosophy</p>
            <h2 className="heading-display text-2xl md:text-4xl text-black mb-10">
              Crafted in Takoradi, <br />
              <span className="text-black/40">Worn globally.</span>
            </h2>

            <div className="space-y-8 text-black/70">
              <p className="text-sm md:text-base leading-[1.7]">
                &quot;HARV DREAMS was born for the youth chasing dreams that are almost far-fetched.&quot;
              </p>
              <p className="text-sm leading-[1.7] border-l-2 border-black pl-6 py-2">
                Every thread is a reminder: doubt less, dream more, and live your vision. 
                Our collections are not just clothing; they are the uniform of those daring to defy limits 
                and redefine what's possible in the heart of Ghana.
              </p>
              
              <div className="pt-6">
                <div className="w-12 h-[1px] bg-black mb-4" />
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase">The Visionary Spirit</p>
              </div>
            </div>
          </div>

          {/* Minimalist Image Display (Conceptual) */}
          <div className="flex-1 relative group">
            <div className="aspect-[4/5] bg-black/5 relative overflow-hidden">
              <img 
                src="/lovable-uploads/1a92e154-86f8-492d-b1ac-9e03726763f5.png" 
                alt="Brand Story" 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            {/* Absolute accent */}
            <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-32 md:w-48 aspect-square bg-[#e5e5e5] -z-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Story;