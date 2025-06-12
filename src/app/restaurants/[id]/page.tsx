import Image from 'next/image';
import { mockRestaurants, mockDishes } from '@/data/mock';
import type { Restaurant, Dish } from '@/types';
import DishCard from '@/components/common/DishCard';
import { Star, Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface RestaurantPageParams {
  params: { id: string };
}

// Simulate fetching data
async function getRestaurantDetails(id: string): Promise<Restaurant | undefined> {
  return mockRestaurants.find(r => r.id === id);
}

async function getRestaurantMenu(restaurantId: string): Promise<Dish[]> {
  return mockDishes.filter(d => d.restaurantId === restaurantId);
}

export default async function RestaurantPage({ params }: RestaurantPageParams) {
  const restaurant = await getRestaurantDetails(params.id);
  
  if (!restaurant) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Restaurant not found</h1>
        <Link href="/" passHref>
          <Button variant="link" className="mt-4">Go back to home</Button>
        </Link>
      </div>
    );
  }

  const menu = await getRestaurantMenu(restaurant.id);

  return (
    <div className="space-y-8">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Restaurants
        </Button>
      </Link>

      {/* Restaurant Header */}
      <section className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
          data-ai-hint="restaurant interior"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-white mb-2">{restaurant.name}</h1>
          <div className="flex items-center space-x-4 text-gray-200">
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">{restaurant.cuisine}</Badge>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Menu</h2>
        {menu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This restaurant currently has no items on its menu.</p>
        )}
      </section>
    </div>
  );
}

// Generate static paths for mock restaurants for better performance
export async function generateStaticParams() {
  return mockRestaurants.map((restaurant) => ({
    id: restaurant.id,
  }));
}
