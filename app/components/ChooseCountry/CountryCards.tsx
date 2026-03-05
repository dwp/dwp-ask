"use client";

import { locations } from "../Landing/config";
import Card from "../Packages/Card/Card";
import styles from "./CountryCards.module.css";

type CountryCardsProps = {
  onClickHandler: (countryCode: string) => void;
};

export default function CountryCards({ onClickHandler }: CountryCardsProps) {
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
