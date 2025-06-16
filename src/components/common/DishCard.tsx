
"use client";

import Image from 'next/image';
import type { Dish } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(dish);
    toast({
      title: `${dish.name} added to cart!`,
      description: "You can view your cart or continue shopping.",
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-40">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover"
          data-ai-hint={dish.imageHint || "food dish"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg leading-tight">{dish.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 h-8">{dish.description}</p>
        <p className="text-base font-semibold text-primary">${dish.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
