"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function SearchSpecies() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <Input
      placeholder="Search species..."
      className="max-w-xs"
      defaultValue={searchParams.get("query")?.toString()}
      onChange={(e) => {
        router.push("/species?" + createQueryString("query", e.target.value));
      }}
    />
  );
}
