"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/bookService";
import CategoryCard from "./CategoryCard";

export default function PopularCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Error loading categories</p>;

  return (
    <section>
      <h2>Popular Categories</h2>

      <div>
        {data.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
