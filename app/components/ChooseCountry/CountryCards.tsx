"use client";

import { usePathname } from "next/navigation";
import { locations } from "../Landing/config";
import Card from "../Packages/Card/Card";
import styles from "./CountryCards.module.css";

type CountryCardsProps = {
  onClickHandler: (countryCode: string) => void;
};

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
      {locations.map((location) => (
        <Card
          key={location}
          text={location}
          className={styles.countryCard}
          onClick={(location: string) => onClickHandler(location)}
        />
      ))}
    </div>
  );
}
