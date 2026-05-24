import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Need Engine · The Nature of Needs, Desire, Motivation, Consumption & Civilizational Dynamics";
const TITLE_ZH = "需求引擎 · 需求、欲望、动机、消费与文明动力学的本质";
const DESC =
  "A civilization-scale, bilingual exploration of need — from the chemical gradient a bacterium must climb to the algorithm that triggers your wanting before you feel it. Need not as weakness but as the universal grammar of incompleteness: the gap between a conscious system and the state it requires, made into the force that drives biology, economies, technology and civilization itself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://need-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "needs", "desire", "motivation", "consumption", "scarcity", "demand", "drives",
    "hunger", "reward", "dopamine", "reward prediction error", "reinforcement learning",
    "wanting vs liking", "craving", "addiction", "habit formation", "hedonic treadmill",
    "Maslow", "hierarchy of needs", "status", "recognition", "belonging", "esteem",
    "identity", "self-actualization", "attention economy", "advertising", "branding",
    "consumer society", "luxury", "manufactured demand", "recommendation algorithms",
    "social media", "AI personalization", "engineering of desire", "filter bubble",
    "Buddhism", "Stoicism", "psychoanalysis", "neuroscience of motivation", "meaning",
    "purpose", "transcendence", "Viktor Frankl", "Confucian honor", "scarcity and history",
    "resource competition", "migration", "empire", "post-scarcity", "synthetic desire",
    "AI companions", "machine needs", "instrumental convergence", "reward function",
    "behavioral science", "civilization", "Psyverse",
    "需求", "欲望", "动机", "消费", "稀缺", "驱力", "饥饿", "奖赏", "多巴胺",
    "奖赏预测误差", "强化学习", "想要与喜欢", "渴求", "成瘾", "习惯", "享乐跑步机",
    "马斯洛", "需求层次", "地位", "认可", "归属", "尊重", "身份", "自我实现",
    "注意力经济", "广告", "品牌", "消费社会", "奢侈", "被制造的需求", "推荐算法",
    "社交媒体", "人工智能个性化", "欲望工程", "信息茧房", "佛教", "斯多葛主义",
    "精神分析", "动机神经科学", "意义", "目的", "超越", "弗兰克尔", "儒家荣誉",
    "稀缺与历史", "资源竞争", "迁徙", "帝国", "后稀缺", "合成欲望", "AI 伴侣",
    "机器的需求", "工具性趋同", "奖励函数", "行为科学", "文明",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Need Engine · 需求引擎 — The Nature of Need" }],
    title: TITLE_EN,
    description:
      "From a bacterium climbing a gradient to an algorithm that triggers your wanting before you feel it. A bilingual atlas of need — drives, dopamine, status, demand, the attention economy, addiction, meaning, scarcity, synthetic desire, and a unified model of need as the gap that drives civilization.",
    url: "https://need-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "Need is not weakness. It is the universal grammar of incompleteness — the gap between a conscious system and the state it requires, made into the force that drives civilization.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#070510" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://need-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-ink-950 text-ghost-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
