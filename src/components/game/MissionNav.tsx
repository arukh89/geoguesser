"use client";

import { useMemo } from "react";
import { Home, User, Trophy, Upload, BookText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

interface MissionNavProps {
  onExplore?: () => void;
  onProfile?: () => void;
  onLeaderboard?: () => void;
}

export default function MissionNav({ onExplore, onProfile, onLeaderboard }: MissionNavProps) {
  const items: Item[] = useMemo(() => [
    { key: 'explore', label: 'Explore', icon: <Home className="w-4 h-4" />, onClick: () => onExplore?.() },
    { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, onClick: () => onProfile?.() },
    { key: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" />, onClick: () => onLeaderboard?.() },
    { key: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" />, onClick: () => window.open('https://www.mapillary.com/desktop-uploader', '_blank') },
    { key: 'blog', label: 'Blog', icon: <BookText className="w-4 h-4" />, onClick: () => window.open('https://blog.mapillary.com/', '_blank') },
    { key: 'website', label: 'Mapillary.com', icon: <ExternalLink className="w-4 h-4" />, onClick: () => window.open('https://www.mapillary.com/', '_blank') },
  ], [onExplore, onProfile, onLeaderboard]);

  return (
    <nav className="w-60 p-2 rounded-xl mx-panel text-[var(--text)]">
      <div className="space-y-1">
        {items.map((it) => (
          <Button
            key={it.key}
            onClick={it.onClick}
            variant="ghost"
            size="lg"
            className="w-full justify-start gap-3 text-base hover:bg-[rgba(0,255,65,0.08)]"
          >
            {it.icon}
            <span>{it.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
