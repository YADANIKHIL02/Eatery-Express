import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} passHref>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="restaurant food"
          />
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-lg">{restaurant.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <Badge variant="secondary" className="mb-2">{restaurant.cuisine}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
