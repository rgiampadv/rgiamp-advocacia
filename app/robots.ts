const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rgiamp.adv.com";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/area-do-cliente"] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
