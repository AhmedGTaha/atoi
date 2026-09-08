"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  saveWebsiteContentAction,
  type WebsiteContentFormState,
} from "@/app/actions/websiteContentActions";
import { Button } from "@/components/ui/Button";
import type { WebsiteContentField } from "@/lib/content/defaultWebsiteContent";
import {
  WEBSITE_PREVIEW_LOCALE,
  WEBSITE_PREVIEW_READY,
  WEBSITE_PREVIEW_UPDATE,
  type WebsitePreviewSection,
} from "@/lib/content/websitePreview";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";

const initialState: WebsiteContentFormState = {};

const SECTION_LABELS: Record<WebsitePreviewSection, string> = {
  hero: "Hero",
  services: "Services",
  process: "Process",
  work: "Selected Work",
  finalCta: "Final CTA",
  footer: "Footer",
};

type Viewport = "desktop" | "tablet" | "mobile";
type WorkspaceView = "edit" | "preview";

export function WebsiteContentForm({
  fields,
  content: initialContent,
}: {
  fields: WebsiteContentField[];
  content: WebsiteContentMap;
}) {
  const [state, formAction, isPending] = useActionState(
    saveWebsiteContentAction,
    initialState,
  );
  const [content, setContent] = useState(initialContent);
  const [locale, setLocale] = useState<Locale>("en");
  const [activeSection, setActiveSection] =
    useState<WebsitePreviewSection>("hero");
  const [openSections, setOpenSections] = useState<WebsitePreviewSection[]>([
    "hero",
  ]);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("edit");
  const [frameVersion, setFrameVersion] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sections = useMemo(
    () =>
      Array.from(new Set(fields.map((field) => field.section))).filter(
        (section): section is WebsitePreviewSection => section !== "about",
      ),
    [fields],
  );

  const sendPreviewUpdate = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: WEBSITE_PREVIEW_UPDATE,
        locale,
        content,
        section: activeSection,
      },
      window.location.origin,
    );
  }, [activeSection, content, locale]);

  useEffect(() => {
    sendPreviewUpdate();
  }, [sendPreviewUpdate, frameVersion]);

  useEffect(() => {
    function receivePreviewMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return;
      }
      if (event.data?.type === WEBSITE_PREVIEW_READY) sendPreviewUpdate();
      if (
        event.data?.type === WEBSITE_PREVIEW_LOCALE &&
        (event.data.locale === "en" || event.data.locale === "ar")
      ) {
        setLocale(event.data.locale);
      }
    }

    window.addEventListener("message", receivePreviewMessage);
    return () => window.removeEventListener("message", receivePreviewMessage);
  }, [sendPreviewUpdate]);

  function updateField(key: string, value: string) {
    setContent((current) => ({
      ...current,
      [key]: {
        ...(current[key] ?? { valueEn: "", valueAr: "" }),
        [locale === "ar" ? "valueAr" : "valueEn"]: value,
      },
    }));
  }

  return (
    <form action={formAction} className="website-content-form">
      {fields.flatMap((field) => {
        const current = content[field.key] ?? {
          valueEn: field.valueEn,
          valueAr: field.valueAr,
        };
        return [
          <input
            key={`${field.key}-en-hidden`}
            type="hidden"
            name={`${field.key}__en`}
            value={current.valueEn}
          />,
          <input
            key={`${field.key}-ar-hidden`}
            type="hidden"
            name={`${field.key}__ar`}
            value={current.valueAr}
          />,
        ];
      })}

      <div className="content-editor-controls">
        <div className="workspace-view-control">
          <span className="content-control-label">Workspace</span>
          <div
            className="content-language-toggle"
            role="group"
            aria-label="Workspace view"
          >
            <button
              type="button"
              aria-pressed={workspaceView === "edit"}
              onClick={() => setWorkspaceView("edit")}
            >
              Edit
            </button>
            <button
              type="button"
              aria-pressed={workspaceView === "preview"}
              onClick={() => setWorkspaceView("preview")}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div
        className="website-content-workspace"
        data-workspace-view={workspaceView}
      >
        <div
          className="content-editor-pane"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="content-pane-heading">
            <div>
              <p className="section-marker">{"// content.editor"}</p>
              <h2>{locale === "ar" ? "المحتوى العربي" : "English content"}</h2>
            </div>
            <span className="content-language-badge">
              {locale === "ar" ? "RTL" : "LTR"}
            </span>
          </div>

          <div className="content-sections">
            {sections.map((section, index) => (
              <details
                key={section}
                className="content-section"
                open={openSections.includes(section)}
                onToggle={(event) => {
                  const isOpen = event.currentTarget.open;
                  setOpenSections((current) => {
                    if (isOpen && !current.includes(section)) {
                      return [...current, section];
                    }
                    if (!isOpen && current.includes(section)) {
                      return current.filter((item) => item !== section);
                    }
                    return current;
                  });
                  if (isOpen) setActiveSection(section);
                }}
                onFocusCapture={() => setActiveSection(section)}
              >
                <summary>
                  <span className="content-section-index">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                  <span>{SECTION_LABELS[section]}</span>
                  <span className="content-section-chevron" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="content-section-fields">
                  {fields
                    .filter((field) => field.section === section)
                    .map((field) => {
                      const current = content[field.key] ?? {
                        valueEn: field.valueEn,
                        valueAr: field.valueAr,
                      };
                      const value =
                        locale === "ar" ? current.valueAr : current.valueEn;
                      const id = `${field.key}-${locale}`;

                      return (
                        <label key={field.key} htmlFor={id}>
                          <span>{field.label}</span>
                          {field.multiline ? (
                            <textarea
                              id={id}
                              value={value}
                              dir={locale === "ar" ? "rtl" : "ltr"}
                              onChange={(event) =>
                                updateField(field.key, event.target.value)
                              }
                              className="input"
                              rows={4}
                            />
                          ) : (
                            <input
                              id={id}
                              value={value}
                              dir={locale === "ar" ? "rtl" : "ltr"}
                              onChange={(event) =>
                                updateField(field.key, event.target.value)
                              }
                              className="input"
                              type="text"
                            />
                          )}
                        </label>
                      );
                    })}
                </div>
              </details>
            ))}
          </div>

          <div className="content-save-bar" dir="ltr">
            <div aria-live="polite">
              {state.error && (
                <p role="alert" className="text-sm text-danger">
                  {state.error}
                </p>
              )}
              {state.success && (
                <p role="status" className="text-sm text-success">
                  Content saved and published.
                </p>
              )}
              {!state.error && !state.success && (
                <p className="text-xs text-muted">
                  Draft changes stay private until you publish.
                </p>
              )}
            </div>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Saving…" : "Save & publish"}
            </Button>
          </div>
        </div>

        <aside
          className="content-preview-pane"
          aria-label="Live website preview"
        >
          <div className="preview-toolbar">
            <div>
              <p className="section-marker">{"// live.preview"}</p>
              <span className="preview-live-label">
                <i aria-hidden="true" />
                Live website preview
              </span>
            </div>
            <div className="preview-toolbar-actions">
              <div
                className="content-language-toggle content-language-toggle--compact"
                role="group"
                aria-label="Content language"
              >
                <button
                  type="button"
                  aria-pressed={locale === "en"}
                  onClick={() => setLocale("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  aria-pressed={locale === "ar"}
                  onClick={() => setLocale("ar")}
                >
                  عربي
                </button>
              </div>
              <div
                className="viewport-switcher"
                role="group"
                aria-label="Preview viewport"
              >
                {(["desktop", "tablet", "mobile"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    title={item[0].toUpperCase() + item.slice(1)}
                    aria-label={`${item} preview`}
                    aria-pressed={viewport === item}
                    onClick={() => setViewport(item)}
                  >
                    <ViewportIcon viewport={item} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="preview-icon-button"
                title="Refresh preview"
                aria-label="Refresh preview"
                onClick={() => setFrameVersion((current) => current + 1)}
              >
                <RefreshIcon />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="preview-icon-button"
                title="Open public website"
                aria-label="Open public website"
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
          <div className="preview-canvas" data-viewport={viewport}>
            <iframe
              key={frameVersion}
              ref={iframeRef}
              src="/admin-preview/website-content"
              title="ATOI public website live preview"
              onLoad={sendPreviewUpdate}
            />
          </div>
        </aside>
      </div>
    </form>
  );
}

function ViewportIcon({ viewport }: { viewport: Viewport }) {
  if (viewport === "mobile") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7.5" y="2" width="9" height="20" rx="1" />
        <path d="M10.5 18.5h3" />
      </svg>
    );
  }
  if (viewport === "tablet") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="2.5" width="14" height="19" rx="1" />
        <path d="M10.5 18.5h3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="1" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.5-4.8L3 9m1-5v5h5M4 13a8 8 0 0 0 14.5 4.8L21 15m-1 5v-5h-5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}
