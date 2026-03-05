"use client";

import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { H4, Paragraph, BackLink, SectionBreak, Link } from "@/app/components";
import SourceLink from "../SourceLink/SourceLink";
import { useSidebar, useLocation, useModal } from "@/app/providers";
import { type ChatHistoryType } from "@/app/types";
import { handleCitations } from "@/app/(pages)/version-b/chat/emitCitations";

export default function Sidebar() {
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const { setModalVisible } = useModal();
  const { location } = useLocation();
  const [showContent, setShowContent] = useState(isSidebarVisible);
  const [citationsVisible, setCitationsVisible] = useState<
    ChatHistoryType["citations"]
  >([]);

  // Initialise from stored history on mount and subscribe to updates
  useEffect(() => {
    handleCitations(setCitationsVisible);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowContent(true);
      } else {
        setShowContent(isSidebarVisible);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSidebarVisible) {
          toggleSidebar();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar, isSidebarVisible]);

  return (
    <div
      className={`${styles.sidebarWrapper} ${isSidebarVisible ? styles.open : ""}`}
      role="alert"
      data-testid="sidebar-wrapper"
    >
      {showContent && (
        <div
          className={styles.sidebarClientWrapper}
          data-testid="sidebar-client-wrapper"
        >
          <React.Fragment>
            <Paragraph data-testid="sidebar-claimant-country">
              Claimant country of residence selected:{" "}
              <strong>{location ?? "None selected"}</strong>
            </Paragraph>
            {location && (
              <Link
                data-testid="sidebar-change-country-link"
                onClick={() => setModalVisible("clearChat")}
              >
                Change (will start a new chat)
              </Link>
            )}
            <SectionBreak level="m" visible />
          </React.Fragment>

          {citationsVisible && citationsVisible?.length > 0 && (
            <>
              <H4 className={styles.sidebarUCTitle} data-testid="sidebar-title">
                Universal Learning guidance links
              </H4>
              <Paragraph data-testid="sidebar-description">
                These links are in response to your question. All links open in
                a new tab.
              </Paragraph>
            </>
          )}
          <BackLink
            data-testid="sidebar-backlink"
            className={styles.closeSidebar}
            onClick={() => toggleSidebar()}
          >
            Back to chat
          </BackLink>
          {citationsVisible &&
            citationsVisible?.map((source, index) => (
              <section key={source.title} data-testid="sidebar-source-links">
                <SourceLink index={index} source={source} />
                {citationsVisible && index !== citationsVisible.length - 1 && (
                  <SectionBreak level="m" visible={false} />
                )}
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
