"use client";

import { useState, useRef, useEffect } from "react";
import VerseCard from "@/components/VerseCard";
import * as htmlToImage from "html-to-image";
import { BIBLICAL_BOOKS, TOPICS_MAP, BUILT_IN_BACKGROUNDS } from "@/data/constants";

export default function Home() {

  /* ===============================
     LOAD BIBLE
  =============================== */

  const [englishData, setEnglishData] = useState<any>(null);
  const [teluguData, setTeluguData] = useState<any>(null);
  const [loadingBible, setLoadingBible] = useState(true);

  useEffect(() => {
    const loadBible = async () => {
      try {
        const [engOT, engNT, telOT, telNT] = await Promise.all([
          fetch("/bibles/english-ot.json").then(r => r.json()),
          fetch("/bibles/english-nt.json").then(r => r.json()),
          fetch("/bibles/telugu-ot.json").then(r => r.json()),
          fetch("/bibles/telugu-nt.json").then(r => r.json())
        ]);

        setEnglishData({ ...engOT, ...engNT });
        setTeluguData({ ...telOT, ...telNT });

      } catch (err) {
        console.error("Bible load failed", err);
      } finally {
        setLoadingBible(false);
      }
    };

    loadBible();
  }, []);

  /* ===============================
     VERSE LOGIC
  =============================== */

  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");

  const [chapters, setChapters] = useState<string[]>([]);
  const [verses, setVerses] = useState<string[]>([]);

  const [englishText, setEnglishText] = useState("");
  const [teluguText, setTeluguText] = useState("");

  useEffect(() => {
    if (!book || !englishData) return;
    const bookChapters = Object.keys(englishData[book] || {});
    setChapters(bookChapters);
    setChapter(bookChapters[0] || "");
  }, [book, englishData]);

  useEffect(() => {
    if (!chapter || !englishData) return;
    const chapterVerses =
      Object.keys(englishData[book]?.[chapter] || {});
    setVerses(chapterVerses);
    setVerse(chapterVerses[0] || "");
  }, [book, chapter, englishData]);

  const generateVerse = () => {
    const eng = englishData?.[book]?.[chapter]?.[verse];
    const tel = teluguData?.[book]?.[chapter]?.[verse];

    if (!eng || !tel) {
      alert("Verse not found.");
      return;
    }

    setEnglishText(eng);
    setTeluguText(tel);
  };

  const getRandomVerse = () => {
    if (!englishData) return;
    const isOT = Math.random() > 0.5;
    const bookList = isOT ? BIBLICAL_BOOKS.OldTestament : BIBLICAL_BOOKS.NewTestament;
    const randomBook = bookList[Math.floor(Math.random() * bookList.length)];
    const chaptersList = Object.keys(englishData[randomBook] || {});
    if (!chaptersList.length) return;
    const randomChapter = chaptersList[Math.floor(Math.random() * chaptersList.length)];
    const versesList = Object.keys(englishData[randomBook][randomChapter] || {});
    if (!versesList.length) return;
    const randomVerse = versesList[Math.floor(Math.random() * versesList.length)];
    
    setBook(randomBook);
    setChapter(randomChapter);
    setVerse(randomVerse);
    setTimeout(() => {
      setEnglishText(englishData[randomBook][randomChapter][randomVerse]);
      setTeluguText(teluguData?.[randomBook]?.[randomChapter]?.[randomVerse] || "");
    }, 50);
  };

  const getDailyVerse = () => {
    if (!englishData) return;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const bookList = [...BIBLICAL_BOOKS.OldTestament, ...BIBLICAL_BOOKS.NewTestament];
    let dailyBook = bookList[seed % bookList.length];
    
    if (!englishData[dailyBook]) dailyBook = "Genesis";

    const chaptersList = Object.keys(englishData[dailyBook] || {});
    const dailyChapter = chaptersList[seed % chaptersList.length] || "1";
    const versesList = Object.keys(englishData[dailyBook][dailyChapter] || {});
    const dailyVerse = versesList[seed % versesList.length] || "1";
    
    setBook(dailyBook);
    setChapter(dailyChapter);
    setVerse(dailyVerse);
    setTimeout(() => {
      setEnglishText(englishData[dailyBook]?.[dailyChapter]?.[dailyVerse] || "");
      setTeluguText(teluguData?.[dailyBook]?.[dailyChapter]?.[dailyVerse] || "");
    }, 50);
  };

  const [selectedTopic, setSelectedTopic] = useState("");
  const generateTopicVerse = (topic: string) => {
    setSelectedTopic(topic);
    if (!topic || !TOPICS_MAP[topic]) return;
    const { book: tBook, chapter: tChap, verse: tVerse } = TOPICS_MAP[topic];
    setBook(tBook);
    setChapter(tChap);
    setVerse(tVerse);
    setTimeout(() => {
      setEnglishText(englishData[tBook]?.[tChap]?.[tVerse] || "");
      setTeluguText(teluguData?.[tBook]?.[tChap]?.[tVerse] || "");
    }, 50);
  };

  const goToNextVerse = () => {
    const next = Number(verse) + 1;
    if (englishData?.[book]?.[chapter]?.[next]) {
      setVerse(String(next));
      setTimeout(generateVerse, 0);
    }
  };

  const goToPrevVerse = () => {
    const prev = Number(verse) - 1;
    if (prev > 0) {
      setVerse(String(prev));
      setTimeout(generateVerse, 0);
    }
  };

  /* ===============================
     DESIGN SETTINGS
  =============================== */

  const [template, setTemplate] = useState<
    "warm" | "light" | "dark" | "royal" | "image"
  >("warm");

  const [backgroundImage, setBackgroundImage] =
    useState<string | undefined>();

  const [languageMode, setLanguageMode] = useState<"english" | "telugu" | "bilingual">("bilingual");
  const [exportDimensions, setExportDimensions] = useState({ width: 1080, height: 1080 });
  const [exportSizeLabel, setExportSizeLabel] = useState("1080x1080");

  const handleExportSizeChange = (val: string) => {
    setExportSizeLabel(val);
    if (val === "1080x1080") setExportDimensions({ width: 1080, height: 1080 });
    if (val === "1200x630") setExportDimensions({ width: 1200, height: 630 });
    if (val === "1080x1920") setExportDimensions({ width: 1080, height: 1920 });
  };

  const [textColor, setTextColor] = useState("#2C2C2C");
  const [accentColor, setAccentColor] = useState("#8B6F47");
  const [fontScale, setFontScale] = useState(1);

  const applyAutoContrast = () => {
    if (template === "dark" || template === "royal") {
      setTextColor("#FFFFFF");
      setAccentColor("#F5E6CA");
      return;
    }
    if (template === "warm" || template === "light") {
      setTextColor("#2C2C2C");
      setAccentColor("#8B6F47");
      return;
    }

    if (template === "image" && backgroundImage) {
      // If linear gradient, check the first hex roughly or just default if complex. We'll do a simple fallback.
      if (backgroundImage.startsWith("linear-gradient")) {
        // Gradient dark/purple/blue/sunset/green are generally dark-ish so default to light text
        setTextColor("#FFFFFF");
        setAccentColor("#F5E6CA");
        return;
      }

      // Check image brightness holding the base64 or url
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = backgroundImage;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r, g, b, avg;
        let colorSum = 0;

        // Sample every 4th pixel to save performance
        for (let x = 0, len = data.length; x < len; x += 16) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];
          // Simple perceived brightness calculation
          avg = Math.floor((r * 299 + g * 587 + b * 114) / 1000);
          colorSum += avg;
        }

        const brightness = Math.floor(colorSum / (data.length / 16));

        if (brightness < 128) { // Dark image
          setTextColor("#FFFFFF");
          setAccentColor("#F5E6CA");
        } else { // Light image
          setTextColor("#2C2C2C");
          setAccentColor("#8B6F47");
        }
      };
      img.onerror = () => {
        // Fallback
        setTextColor("#FFFFFF");
        setAccentColor("#F5E6CA");
      };
      return;
    }

    // Default fallback
    setTextColor("#2C2C2C");
    setAccentColor("#8B6F47");
  };

  useEffect(() => {
    applyAutoContrast();
  }, [template, backgroundImage]);

  /* ===============================
     WATERMARK
  =============================== */

  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkImage, setWatermarkImage] =
    useState<string | undefined>();
  const [watermarkOpacity, setWatermarkOpacity] =
    useState(0.6);
  const [watermarkPosition, setWatermarkPosition] =
    useState<"corner" | "top-right" | "center">("corner");

  /* ===============================
     DOWNLOAD
  =============================== */

  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    // Temporarily reset the wrapper's scale transform for a pristine export
    const wrapper = cardRef.current.parentElement;
    const oldTransform = wrapper ? wrapper.style.transform : "";
    if (wrapper) {
      wrapper.style.transform = "scale(1)";
    }

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        canvasWidth: exportDimensions.width,
        canvasHeight: exportDimensions.height,
        width: exportDimensions.width,
        height: exportDimensions.height,
        style: {
          transform: "scale(1)",
        }
      });

      const link = document.createElement("a");
      link.download = `selah-verse-${exportDimensions.width}x${exportDimensions.height}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      if (wrapper) {
        wrapper.style.transform = oldTransform;
      }
    }
  };

  if (loadingBible) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading Bible...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="fixed inset-0 w-full h-full object-cover -z-10"
  >
    <source src="/videos/bg.mp4" type="video/mp4" />
  </video>

  {/* Dark Overlay for readability */}
  <div className="fixed inset-0 bg-black/40 -z-10" />

      {/* HEADER */}
      {/* HEADER */}
<div className="py-20 text-center relative z-10">
  <h1 className="text-6xl font-extrabold tracking-wide bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
    SELAH
  </h1>

  <p className="mt-6 text-lg md:text-xl text-gray-200 font-medium tracking-wide">
    Create beautiful bilingual Bible verses instantly
  </p>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 
                grid grid-cols-1 lg:grid-cols-2 
                gap-12 lg:gap-16 items-start">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-3xl shadow-xl 
                p-6 sm:p-8 lg:p-12 
                space-y-8 sm:space-y-10">

          {/* Scripture Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2b2b2b]">
              Scripture Selection
            </h2>

            <div className="grid grid-cols-3 gap-4">

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Book</label>
                <select value={book} onChange={(e)=>setBook(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                  <optgroup label="Old Testament">
                    {BIBLICAL_BOOKS.OldTestament.map((b)=>(
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                  <optgroup label="New Testament">
                    {BIBLICAL_BOOKS.NewTestament.map((b)=>(
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Chapter</label>
                <select value={chapter} onChange={(e)=>setChapter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                  {chapters.map((c)=>(
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Verse</label>
                <select value={verse} onChange={(e)=>setVerse(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                  {verses.map((v)=>(
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

            </div>

            <button
              onClick={generateVerse}
              className="w-full py-3 rounded-xl bg-[#8b6f47] text-white hover:opacity-90 transition">
              Generate Verse
            </button>

            <div className="flex gap-4">
              <button onClick={goToPrevVerse}
                className="flex-1 py-2 bg-[#5c6473] text-white rounded-xl hover:opacity-90">
                ◀️ Previous
              </button>
              <button onClick={goToNextVerse}
                className="flex-1 py-2 bg-[#5c6473] text-white rounded-xl hover:opacity-90">
                Next ▶️
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={getRandomVerse}
                className="py-2 bg-[#1f2937] text-white rounded-xl hover:opacity-90">
                Random Verse
              </button>
              <button onClick={getDailyVerse}
                className="py-2 bg-[#1f2937] text-white rounded-xl hover:opacity-90">
                Generate Today's Verse
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Select Topic</label>
              <select value={selectedTopic} onChange={(e)=>generateTopicVerse(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                <option value="">-- Choose a Topic --</option>
                {Object.keys(TOPICS_MAP).map((t)=>(
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Design Settings */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2b2b2b]">
              Design Settings
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Primary Language</label>
                <select value={languageMode} onChange={(e)=>setLanguageMode(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                  <option value="english">English</option>
                  <option value="telugu">Telugu</option>
                  <option value="bilingual">Bilingual</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Export Size</label>
                <select value={exportSizeLabel} onChange={(e)=>handleExportSizeChange(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
                  <option value="1080x1080">Instagram (1080×1080)</option>
                  <option value="1200x630">Facebook (1200×630)</option>
                  <option value="1080x1920">WhatsApp (1080×1920)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm text-gray-600">Text Size Adjustment</label>
              </div>
              <input type="range"
                min="0.5" max="2.0" step="0.05"
                value={fontScale}
                onChange={(e)=>setFontScale(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <select value={template}
              onChange={(e)=>setTemplate(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-[#cbb88f] outline-none">
              <option value="warm">Warm</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="royal">Royal</option>
              <option value="image">Custom/Built-in Image</option>
            </select>

            {template==="image" && (
              <div className="flex flex-col gap-3">
                <label className="text-sm text-gray-600">Built-in Background</label>
                <div className="grid grid-cols-5 gap-2 max-h-[160px] overflow-y-auto p-2 border rounded-xl bg-gray-50 border-gray-300">
                  {BUILT_IN_BACKGROUNDS.map((bg) => (
                    <img 
                      key={bg.id} 
                      src={bg.url} 
                      alt={bg.category} 
                      className={`w-full h-12 object-cover rounded-md cursor-pointer border-2 hover:opacity-80 transition ${backgroundImage === bg.url ? 'border-[#8b6f47]' : 'border-transparent'}`}
                      onClick={() => setBackgroundImage(bg.url)}
                      title={bg.category}
                    />
                  ))}
                </div>
                <label className="text-sm text-gray-600 mt-2">Or Upload Image</label>
                <input type="file" accept="image/*"
                  onChange={(e)=>{
                    const file=e.target.files?.[0];
                    if(file){
                      const reader=new FileReader();
                      reader.onloadend=()=>setBackgroundImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#8b6f47] file:text-white file:cursor-pointer hover:file:opacity-90"
                />
              </div>
            )}

            <div className="flex gap-6">
              <input type="color" value={textColor}
                onChange={(e)=>setTextColor(e.target.value)}
                className="w-12 h-12 rounded-lg border"/>
              <input type="color" value={accentColor}
                onChange={(e)=>setAccentColor(e.target.value)}
                className="w-12 h-12 rounded-lg border"/>
            </div>

            <button onClick={applyAutoContrast}
              className="w-full py-2 bg-[#1f2937] text-white rounded-xl hover:opacity-90">
              Auto Adjust Text Color
            </button>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Watermark */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2b2b2b]">
              Watermark
            </h2>

            <label className="flex items-center gap-2 text-gray-800">
              <input type="checkbox"
                checked={showWatermark}
                onChange={(e)=>setShowWatermark(e.target.checked)} />
              Enable Watermark
            </label>

            {showWatermark && (
              <>
                <input type="file" accept="image/*"
                  onChange={(e)=>{
                    const file=e.target.files?.[0];
                    if(file){
                      const reader=new FileReader();
                      reader.onloadend=()=>setWatermarkImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#5c6473] file:text-white file:cursor-pointer hover:file:opacity-90"
                />

                <select value={watermarkPosition}
                  onChange={(e)=>setWatermarkPosition(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border text-gray-800">
                  <option value="corner">Bottom Right</option>
                  <option value="top-right">Top Right</option>
                  <option value="center">Center</option>
                </select>

                <input type="range"
                  min="0.1" max="1" step="0.1"
                  value={watermarkOpacity}
                  onChange={(e)=>setWatermarkOpacity(Number(e.target.value))}
                />
              </>
            )}
          </div>

          <button onClick={downloadImage}
            className="w-full py-3 rounded-xl bg-black text-white hover:opacity-90">
            Download PNG
          </button>

        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex justify-center items-center">
          <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[650px] rounded-3xl">
            <div 
              className="origin-center transition-transform duration-300"
              style={{
                transform: `scale(${Math.min(
                  1, 
                  (typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 550) / exportDimensions.width,
                  550 / exportDimensions.height
                )})`
              }}
            >
              <VerseCard
                ref={cardRef}
                template={template}
                backgroundImage={backgroundImage}
                textColor={textColor}
                accentColor={accentColor}
                fontScale={fontScale}
                language1Text={englishText}
                language1Ref={`${book} ${chapter}:${verse}`}
                language2Text={teluguText}
                language2Ref={`${book} ${chapter}:${verse}`}
                showWatermark={showWatermark}
                watermarkImage={watermarkImage}
                watermarkOpacity={watermarkOpacity}
                watermarkPosition={watermarkPosition}
                languageMode={languageMode}
                width={exportDimensions.width}
                height={exportDimensions.height}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}