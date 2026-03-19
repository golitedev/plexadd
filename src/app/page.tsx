import type { Metadata } from "next";
import { PlexaddApp } from "@/components/plexadd-app";

export const metadata: Metadata = {
  title: "plexadd",
  description: "Collect movie, TV, and music requests for your Plex library.",
};

export default function Home() {
  return <PlexaddApp />;
}
