import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function validateEnvironmentVariables() {
  if (!process.env.NEXT_PUBLIC_VERCEL_URL) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_VERCEL_URL");
  }
  // Add any additional environment variable checks here as needed
}

export function createUrl(path: string, params: URLSearchParams): string {
  return `${path}?${params.toString()}`;
}

