"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Default behavior: navigate to a search results page
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="relative w-full max-w-xl">
      <Input
        type="search"
        placeholder="Search for dishes or cuisines..."
        className="pl-10 pr-4 py-3 text-base rounded-lg border-2 focus:border-primary focus:ring-primary"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </form>
  );
}
