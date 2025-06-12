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
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-40">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint="food dish"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-md">{dish.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{dish.description}</p>
        <p className="text-lg font-semibold text-primary">${dish.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
