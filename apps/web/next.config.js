/** Next.js config for Dhara Luxe */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "images.unsplash.com", "your-supabase-bucket.supabase.co"],
    formats: ["image/avif", "image/webp"]
  }
};

module.exports = nextConfig;
