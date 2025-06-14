
import Image from 'next/image';
import Link from 'next/link';
import type { Restaurant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            fill
            className="object-cover"
            data-ai-hint={restaurant.imageHint || "restaurant food"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="font-headline text-xl">{restaurant.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pt-0">
          <Badge variant="secondary" className="mb-2 text-xs">{restaurant.cuisine}</Badge>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
