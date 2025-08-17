
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DishCard from '@/components/common/DishCard';
import { mockDishes } from '@/data/mock';
import type { Dish } from '@/types';
import { SearchX, ChevronLeft, Loader2 } from 'lucide-react';
import SearchBar from '@/components/common/SearchBar';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX, even with mock data
    setLoading(true);
    const timer = setTimeout(() => {
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        const results = mockDishes.filter(dish => 
          dish.name.toLowerCase().includes(lowerCaseQuery) || 
          dish.description.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredDishes(results);
      } else {
        setFilteredDishes([]);
      }
      setLoading(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/home" passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="w-full sm:w-auto sm:max-w-md">
            <SearchBar />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : query ? (
        <>
          <h1 className="text-3xl font-bold font-headline">
            Search Results for "{query}"
          </h1>
          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SearchX className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-bold font-headline mb-4">No Dishes Found</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't find any dishes matching your search for "{query}". Try a different search term.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
            <SearchX className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold font-headline mb-4">Enter a Search Term</h2>
            <p className="text-muted-foreground">
                Please enter something in the search bar to see results.
            </p>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <SearchResults />
    </Suspense>
  )
}
