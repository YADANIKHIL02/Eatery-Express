
import { Button } from '@/components/ui/button';
import RestaurantCard from '@/components/common/RestaurantCard';
import SearchBar from '@/components/common/SearchBar';
import RecommendationForm from '@/components/sections/RecommendationForm';
import { mockRestaurants } from '@/data/mock';
import type { Restaurant } from '@/types';
import { Utensils } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const restaurants: Restaurant[] = mockRestaurants; // In a real app, fetch this data

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary/20 via-background to-accent/10 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6 text-center text-primary">
            QuickPlate: Your next meal, delivered.
          </h1>
          <p className="text-lg text-foreground/80 mb-10 max-w-xl mx-auto text-center">
            Discover top-rated restaurants and enjoy fast delivery to your doorstep.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Restaurant Browsing Section */}
      <section id="restaurants">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">
          Explore Restaurants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
      
      {/* Recommendation Engine Section */}
      <section id="recommendations" className="py-10">
         <h2 className="text-3xl font-bold font-headline mb-8 text-center">
          Need a Suggestion?
        </h2>
        <RecommendationForm />
      </section>

      {/* Example URL Section */}
      <section className="text-center py-10">
        <h3 className="text-xl font-semibold mb-4">Example External Link</h3>
        <p className="text-muted-foreground">
          Here's an example of how you might link to an external website:
        </p>
        <a 
          href="https://example.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline font-medium"
        >
          Visit Example.com
        </a>
      </section>
    </div>
  );
}
