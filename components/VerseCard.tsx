"use client";

import React, { forwardRef } from "react";

interface VerseCardProps {
  template: "warm" | "light" | "dark" | "royal" | "image";
  backgroundImage?: string;
  textColor: string;
  accentColor: string;
  fontScale: number;
  language1Text: string;
  language1Ref: string;
  language2Text: string;
  language2Ref: string;
  showWatermark: boolean;
  watermarkImage?: string;
  watermarkOpacity: number;
  watermarkPosition: "corner" | "center" | "top-right";
  languageMode: "english" | "telugu" | "bilingual";
  width: number;
  height: number;
}

const templateStyles = {
  warm: "bg-gradient-to-br from-[#F8F5F0] to-[#EDE4D8]",
  light: "bg-gradient-to-br from-[#FFFFFF] to-[#ECECEC]",
  dark: "bg-gradient-to-br from-[#1E1E1E] to-[#3A3A3A]",
  royal: "bg-gradient-to-br from-[#2C2C54] to-[#40407A]",
  image: "",
};

const VerseCard = forwardRef<HTMLDivElement, VerseCardProps>(
  (
    {
      template,
      backgroundImage,
      textColor,
      accentColor,
      fontScale,
      language1Text,
      language1Ref,
      language2Text,
      language2Ref,
      showWatermark,
      watermarkImage,
      watermarkOpacity,
      watermarkPosition,
      languageMode,
      width,
      height,
    },
    ref
  ) => {

    const baseEnglishSize = 42;
    const baseTeluguSize = 46;
    const baseRefSize = 22;

    const isGradient = backgroundImage?.startsWith("linear-gradient");

    const containerStyle = {
      width: `${width}px`,
      height: `${height}px`,
      ...(template === "image" && backgroundImage
        ? (isGradient
            ? { backgroundImage }
            : {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
          )
        : {})
    };

    const isSingleLang = languageMode !== "bilingual";
    const singleLangBonus = isSingleLang ? 1.3 : 1;

    // Smart Verses Text Fitting: Length based scaling
    const getLengthMultiplier = (text: string) => {
      if (!text) return 1;
      const len = text.length;
      if (len < 50) return 1.3;
      if (len > 350) return 0.55;
      if (len > 250) return 0.7;
      if (len > 150) return 0.85;
      return 1;
    };

    const engMulti = getLengthMultiplier(language1Text);
    const telMulti = getLengthMultiplier(language2Text);

    // Dynamic Font Boundary
    // If we're showing two languages, the max font scale needs a harder cap to account for two blocks of text.
    const bilingualPenalty = isSingleLang ? 1 : 0.65;
    
    // Limit font scale bounding box explicitly based on height so it never leaks
    const layoutMultiplier = (height / 1080) * 0.9;
    
    // Safety max clamp
    const safeMaxFontScale = Math.min(fontScale, 1.8 * layoutMultiplier * bilingualPenalty);

    const finalEnglishSize = baseEnglishSize * safeMaxFontScale * engMulti * singleLangBonus;
    const finalTeluguSize = baseTeluguSize * safeMaxFontScale * telMulti * singleLangBonus;
    const finalRefSize = baseRefSize * safeMaxFontScale * singleLangBonus;

    const showEnglish = languageMode === "english" || languageMode === "bilingual";
    const showTelugu = languageMode === "telugu" || languageMode === "bilingual";

    // Smart Layout padding scaling based on aspect ratio width
    const paddingX = Math.max(40, width * 0.08);

    // Adapt the gap between languages depending on available height so it doesn't push the telugu text out
    const gapHeight = isSingleLang ? 0 : Math.min(60, height * 0.05);

    return (
      <div
        ref={ref}
        className={`
          flex
          flex-col
          justify-center
          items-center
          text-center
          relative
          rounded-[20px] 
          overflow-hidden 
          shadow-2xl
          ${template !== "image" ? templateStyles[template] : ""}
        `}
        style={{ ...containerStyle, paddingLeft: paddingX, paddingRight: paddingX }}
      >

        {/* English Text */}
        {showEnglish && (
          <>
            <p
              style={{
                fontSize: `${finalEnglishSize}px`,
                color: textColor,
              }}
              className="leading-[1.7] max-w-[85%]"
            >
              {language1Text}
            </p>

            <p
              style={{
                fontSize: `${finalRefSize}px`,
                color: accentColor,
              }}
              className="mt-[20px]"
            >
              — {language1Ref}
            </p>
          </>
        )}

        {showEnglish && showTelugu && (
          <div style={{ height: `${gapHeight}px` }} />
        )}

        {/* Telugu Text */}
        {showTelugu && (
          <>
            <p
              style={{
                fontSize: `${finalTeluguSize}px`,
                color: textColor,
              }}
              className="leading-[1.8] max-w-[85%]"
            >
              {language2Text}
            </p>

            <p
              style={{
                fontSize: `${finalRefSize}px`,
                color: accentColor,
              }}
              className="mt-[20px]"
            >
              — {language2Ref}
            </p>
          </>
        )}

        {/* Watermark */}
        {showWatermark && watermarkImage && (
          <img
            src={watermarkImage}
            alt="watermark"
            className="absolute"
            style={{
              width: watermarkPosition === "center" ? "400px" : "150px",
              opacity: watermarkOpacity,
              ...(watermarkPosition === "corner" ? { bottom: "2rem", right: "2rem" } : {}),
              ...(watermarkPosition === "top-right" ? { top: "2rem", right: "2rem" } : {}),
              ...(watermarkPosition === "center" ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" } : {}),
            }}
          />
        )}
      </div>
    );
  }
);

VerseCard.displayName = "VerseCard";

export default VerseCard;