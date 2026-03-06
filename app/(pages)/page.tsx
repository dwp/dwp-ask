"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, H1, Main, Paragraph } from "../components";
import "./test.css";

export default function LandingPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const verifyPassword = () => {
    try {
      const CORRECT_PASSWORD = password === "test";
      if (CORRECT_PASSWORD) {
        router.push("/agreement");
      }

      setError("Incorrect password. Please try again.");
      return;
    } catch (error: any) {
      if (!error?.message?.includes("NEXT_REDIRECT")) {
        console.error(error.message);
        setError("An error occurred. Please try again.");
      }
    }
  };

  const verifyPasswordOnEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && event.shiftKey == false) {
      event.preventDefault();
      verifyPassword();
    }
  };

  return (
    <Main className="test-page-wrapper">
      <H1>Start the test</H1>
      <Paragraph>
        This prototype has been created for research purposes and is not the
        full live tool.
      </Paragraph>
      <Paragraph>Any feedback we collect will be anonymised.</Paragraph>
      <Paragraph>
        Once you have been prompted by the session facilitator, click
        &apos;Start&apos; to begin using the prototype.
      </Paragraph>

      {error && (
        <Paragraph className={`${error ? "govuk-error-message" : ""}`}>
          {error}
        </Paragraph>
      )}

      <input
        onKeyDown={verifyPasswordOnEnter}
        type="password"
        aria-label="password"
        id="query-text-area"
        autoComplete="off"
        className={`govuk-textarea ${error ? "govuk-textarea--error" : ""}`}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          resize: "none",
        }}
        value={password}
        placeholder="Enter password"
      />

      <Button onClick={verifyPassword}>Start</Button>
    </Main>
  );
}
