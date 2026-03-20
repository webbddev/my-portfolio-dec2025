"use client";

import { Link, useRouter } from "../../i18n/navigation";

interface RouteTransitionLinkProps {
  href: string;
  locale: string;
  className?: string;
  children: React.ReactNode;
}

export const RouteTransitionLink = ({ href, locale, className, children }: RouteTransitionLinkProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new Event("start-page-transition"));
    
    setTimeout(() => {
      router.push(href as any);
      
      setTimeout(() => {
        window.dispatchEvent(new Event("end-page-transition"));
      }, 100);
    }, 100); // Wait for the transition overlay (400ms fade-in)
  };

  return (
    <Link 
      href={href as any} 
      locale={locale as any} 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};
