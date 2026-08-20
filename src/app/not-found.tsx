import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1B5E20] flex items-center justify-center mb-6">
        <Leaf className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-6xl font-bold text-[#1B5E20] mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
