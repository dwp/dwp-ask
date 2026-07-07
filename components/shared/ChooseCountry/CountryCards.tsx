"use client";

import { usePathname } from "next/navigation";
import { Card } from "@/components";
import { LOCATIONS } from "@/constants/Locations";
import type { CountryCardsProps, LocationType } from "@/types";
import styles from "./CountryCards.module.css";

/**
 * Renders clickable country selection cards for each supported location.
 * Hidden on view-details pages.
 */
export default function CountryCards({ onClickHandler }: CountryCardsProps) {
  const pathname = usePathname();
  const HIDE_COUNTRY_CARDS_PATHS = [
    "/chat/view-details",
    "/admin/view-details",
  ];

  if (HIDE_COUNTRY_CARDS_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <div data-testid="country-cards" className={styles.countryCardsContainer}>
      {LOCATIONS.map((location: NonNullable<LocationType>) => (
        <Card
          key={location}
          text={location}
          className={styles.countryCard}
          onClick={() => onClickHandler(location)}
        />
      ))}
    </div>
  );
}
