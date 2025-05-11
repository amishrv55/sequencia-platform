import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    image: "/images/slide1.jpg",
    headline: "Will India become a 5 Trillion Dollar Economy by 2025?",
    caption: "Top economists weigh in with forecasts",
    cta: "View Predictions",
    ctaLink: "/questions/economy-2025"
  },
  {
    image: "/images/slide2.jpg",
    headline: "Can AI solve climate change?",
    caption: "Explore global predictions on green tech",
    cta: "Explore Tech Forecasts",
    ctaLink: "/questions/ai-climate"
  },
  {
    image: "/images/slide3.jpg",
    headline: "Will Bitcoin hit $100k this year?",
    caption: "Crypto community is divided",
    cta: "See Crypto Predictions",
    ctaLink: "/questions/bitcoin-100k"
  },
];

const HeroSlider = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12 mb-16">
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={6000}
        transitionTime={800}
        showArrows={true}
        renderArrowPrev={(clickHandler, hasPrev) => (
          <button
            onClick={clickHandler}
            disabled={!hasPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        renderArrowNext={(clickHandler, hasNext) => (
          <button
            onClick={clickHandler}
            disabled={!hasNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <button
            type="button"
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`Slide ${index + 1}`}
            className={`mx-1 w-3 h-3 rounded-full transition-all duration-300 ${isSelected ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
          />
        )}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[70vh] max-h-[600px] rounded-xl overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
            <img 
              src={slide.image} 
              alt={`Slide ${index + 1}`} 
              className="h-full w-full object-cover z-0" 
              loading={index === 0 ? "eager" : "lazy"}
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-left z-10 px-12 lg:px-24">
              <div className="max-w-2xl">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {slide.headline}
                </h2>
                <p className="text-xl text-gray-100 mb-8 drop-shadow-md">
                  {slide.caption}
                </p>
                <a
                  href={slide.ctaLink}
                  className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider;