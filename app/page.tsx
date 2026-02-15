import { redirect } from "@/i18n/routing";

export default function RootPage() {
  // Redirect to the default locale (pt)
  redirect({ href: "/pt", locale: "pt" });
}
