// File where sitemap function is defined

import { getCollections, getPages, getProducts } from '../lib/shopify';
import { validateEnvironmentVariables } from '../lib/utils';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

// Set base URL using environment variable or fallback to localhost
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Validate necessary environment variables
  validateEnvironmentVariables();

  const routesMap: Route[] = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // Fetch collections, products, and pages, then map them to routes
  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt
    }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt
    }))
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt
    }))
  );

  let fetchedRoutes: Route[] = [];

  // Handle errors in promises
  try {
    fetchedRoutes = (await Promise.all([collectionsPromise, productsPromise, pagesPromise])).flat();
  } catch (error) {
    throw new Error(`Error fetching routes: ${JSON.stringify(error, null, 2)}`);
  }

  // Return sitemap combining static and dynamic routes
  return [...routesMap, ...fetchedRoutes];
}
