'use client';
import { useEffect, useRef } from 'react';
import { post } from '@/lib/api';

export default function AdBanner({ ad }) {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ad) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        post(`/ads/${ad.id}/impression`).catch(() => {});
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ad]);

  const handleClick = () => {
    if (!ad) return;
    post(`/ads/${ad.id}/click`).catch(() => {});
    window.open(ad.target_url, '_blank');
  };

  if (!ad) return null;

  return (
    <div ref={ref} onClick={handleClick} className="rounded-lg overflow-hidden cursor-pointer relative group block mb-4 border">
      <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur z-10">Sponsored</span>
      <img src={ad.banner_url} alt="Advertisement" className="w-full h-auto object-cover group-hover:opacity-90 transition" />
    </div>
  );
}
