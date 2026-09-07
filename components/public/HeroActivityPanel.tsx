"use client";

import { useEffect, useState } from "react";

interface FeedItem {
  day: string;
  tag: string;
  msgEn: string;
  msgAr: string;
}

const FEED: FeedItem[] = [
  { day: "mon", tag: "scope", msgEn: "Mawrid: cut v1 to dispatch and proof of delivery", msgAr: "موارد: تحديد الإصدار الأول للتوزيع وإثبات التسليم" },
  { day: "tue", tag: "design", msgEn: "Job board reviewed with two dispatchers", msgAr: "مراجعة لوحة المهام مع منسقين اثنين" },
  { day: "thu", tag: "build", msgEn: "Driver assignment shipped behind a flag", msgAr: "إطلاق تعيين السائقين خلف علم تجريبي" },
  { day: "fri", tag: "deploy", msgEn: "Ledgerline 1.4 live — invoice run down to 4 minutes", msgAr: "ليدجرلاين 1.4 مباشر — تشغيل الفواتير إلى 4 دقائق" },
];

const HOLD_TICKS = 3;
const TICK_MS = 1200;

/** Decorative "we ship constantly" widget — fixed content, matching ATOI Studio.html exactly. */
export function HeroActivityPanel({ locale }: { locale: "en" | "ar" }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let hold = 0;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= FEED.length) {
          hold += 1;
          if (hold < HOLD_TICKS) return c;
          hold = 0;
          return 1;
        }
        return c + 1;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const visible = FEED.slice(0, count);

  return (
    <>
      <div className="panel-strip">
        <span className="status">atoi — {locale === "ar" ? "هذا الأسبوع" : "this week"}</span>
        <span>{locale === "ar" ? "مباشر" : "live"}</span>
      </div>
      <div className="studio-metrics">
        <div>
          <strong>128</strong>
          <span>{locale === "ar" ? "التزامات" : "commits"}</span>
        </div>
        <div>
          <strong>14</strong>
          <span>{locale === "ar" ? "عمليات نشر" : "deploys"}</span>
        </div>
        <div>
          <strong>42/42</strong>
          <span>{locale === "ar" ? "اختبارات" : "tests"}</span>
        </div>
      </div>
      <div className="studio-feed">
        {visible.map((item, i) => (
          <div className="activity-item" key={item.day + i}>
            <p className="font-display text-xs text-accent">
              {item.day} · {item.tag}
            </p>
            <p className="mt-1 text-sm text-muted">
              {locale === "ar" ? item.msgAr : item.msgEn}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
