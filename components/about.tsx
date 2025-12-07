"use client"

import React, { useEffect, useState } from "react"

type InsightBook = {
  id: string
  title: string
  subtitle: string
  summary: string
  imageData: string | null
}

type AboutData = {
  subtitle: string
  introText: string
  activitiesText: string
  strengthsText: string
  insightText: string
  insightBooks: InsightBook[]
}

const STORAGE_KEY = "aboutData-v3"

const defaultAboutData: AboutData = {
  subtitle: "부동산 실물과 금융을 함께 이해하는 분석가 지망생입니다.",
  introText: `저는 부동산 실물과 금융을 함께 이해하는 분석가를 목표로 공부하고 있습니다. 단국대학교 도시계획부동산학부에서 PF·NPL·주택금융, 자산관리, 도시계획·주택정책·공법·사법 과목을 수강하며 공부해 왔습니다.

프로젝트에서는 PF 구조와 NPL, 리츠, 주택금융, 성남 원도심 주택시장, 마케팅·자산관리까지 연결하며 “도시 위의 숫자”를 읽는 연습을 하고 있습니다. 실물 IM·개발 IM·임장 경험을 통해 자산을 현장에서 보고, 도시·정책·법의 틀 안에서 이해한 뒤, 금융 구조로 연결하는 시각을 키워가고 있습니다.`,
  activitiesText: `· 단국대학교 도시계획부동산학부 재학
· 부동산학회 URID 활동 (실물 IM·개발 IM·임장)
· PF·NPL·주택금융 분석 과제 수행
· 성남 원도심 주택시장·인구구조 분석 리포트 작성`,
  strengthsText: `· 숫자와 텍스트를 함께 보는 능력
· 현장·정책·법·금융을 연결하려는 시도
· 디테일을 끝까지 맞추는 집요함
· 복잡한 내용을 구조화해 설명하는 힘`,
  insightText:
    "“부동산을 한 채의 집이 아니라, 도시·사람·자본이 만나는 구조로 바라보려 합니다.”",
  insightBooks: [
    {
      id: "book-1",
      title: "도시는 무엇으로 사는가",
      subtitle: "도시와 사람, 공간의 관계를 다시 보게 해 준 책",
      summary:
        "도시가 단순한 배경이 아니라, 사람과 정책, 자본이 끊임없이 상호작용하는 유기체라는 감각을 심어 주었습니다.",
      imageData: null,
    },
    {
      id: "book-2",
      title: "더 인간적인 건축",
      subtitle: "멋진 건물보다 ‘살고 싶은 도시’를 고민하게 만든 책",
      summary:
        "반복적인 스카이라인 뒤에 가려진 일상과 보행 경험을 생각하게 하며, 개발이 사람의 삶과 어떻게 만나야 하는지 돌아보게 합니다.",
      imageData: null,
    },
    {
      id: "book-3",
      title: "지리의 힘",
      subtitle: "입지와 구조를 함께 보는 시각",
      summary:
        "각 국가와 도시의 입지가 경제·정치·문화에 미치는 영향을 통해, ‘입지’가 부동산 가치의 핵심 축이라는 사실을 다시 확인하게 해 준 책입니다.",
      imageData: null,
    },
  ],
}

function AboutSection() {
  const [data, setData] = useState<AboutData>(defaultAboutData)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as AboutData
      setData({
        ...defaultAboutData,
        ...parsed,
        insightBooks:
          parsed.insightBooks && parsed.insightBooks.length > 0
            ? parsed.insightBooks.map((b, idx) => ({
                ...defaultAboutData.insightBooks[idx],
                ...b,
              }))
            : defaultAboutData.insightBooks,
      })
    } catch {
      // ignore
    }
  }, [])

  const handleChange = (field: keyof AboutData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleBookChange = (
    id: string,
    field: keyof InsightBook,
    value: string | null,
  ) => {
    setData(prev => ({
      ...prev,
      insightBooks: prev.insightBooks.map(book =>
        book.id === id ? { ...book, [field]: value as any } : book,
      ),
    }))
  }

  const handleImageChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleBookChange(id, "imageData", reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultAboutData)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setEditMode(false)
  }

  const activities = data.activitiesText.split("\n").filter(Boolean)
  const strengths = data.strengthsText.split("\n").filter(Boolean)

  return (
    <section
      id="about"
      className="bg-neutral-950 text-white py-20 border-t border-neutral-800"
    >
      <div className="max-w-6xl mx-auto px-4 space-y-16 relative">
        {/* 편집 버튼 */}
        <div className="absolute right-0 -top-4 flex gap-2 text-xs">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-900 hover:bg-white"
              >
                저장
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="rounded-full border border-slate-500 px-3 py-1 text-slate-200 hover:bg-neutral-900"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="rounded-full border border-red-300 px-3 py-1 text-red-300 hover:bg-red-950"
              >
                초기화
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="rounded-full border border-slate-500 px-3 py-1 text-slate-300 hover:bg-neutral-900"
            >
              편집
            </button>
          )}
        </div>

        {/* About 본문 */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-2">About</h2>
          {editMode ? (
            <input
              className="w-full max-w-xl border border-neutral-700 rounded-lg px-3 py-1 text-sm text-neutral-100 bg-neutral-900"
              value={data.subtitle}
              onChange={e => handleChange("subtitle", e.target.value)}
            />
          ) : (
            <p className="text-sm text-neutral-300">{data.subtitle}</p>
          )}

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr),minmax(0,1.1fr)]">
            <div>
              {editMode ? (
                <textarea
                  className="w-full min-h-[220px] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 bg-neutral-900 leading-relaxed"
                  value={data.introText}
                  onChange={e => handleChange("introText", e.target.value)}
                />
              ) : (
                <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-line">
                  {data.introText}
                </p>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-neutral-400 mb-2">
                  활동
                </h3>
                {editMode ? (
                  <textarea
                    className="w-full min-h-[120px] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 bg-neutral-900"
                    value={data.activitiesText}
                    onChange={e =>
                      handleChange("activitiesText", e.target.value)
                    }
                  />
                ) : (
                  <ul className="space-y-1.5 text-xs text-neutral-200">
                    {activities.map((line, idx) => (
                      <li key={idx}>{line.replace(/^·\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-neutral-400 mb-2">
                  강점
                </h3>
                {editMode ? (
                  <textarea
                    className="w-full min-h-[120px] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 bg-neutral-900"
                    value={data.strengthsText}
                    onChange={e =>
                      handleChange("strengthsText", e.target.value)
                    }
                  />
                ) : (
                  <ul className="space-y-1.5 text-xs text-neutral-200">
                    {strengths.map((line, idx) => (
                      <li key={idx}>{line.replace(/^·\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insight Books 섹션 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">Insight Books</h3>
            {editMode ? (
              <textarea
                className="w-full max-w-xl border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 bg-neutral-900"
                value={data.insightText}
                onChange={e => handleChange("insightText", e.target.value)}
              />
            ) : (
              <p className="text-sm text-neutral-300">{data.insightText}</p>
            )}
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/70 px-6 py-6 md:px-8 md:py-8">
            <div className="grid gap-6 md:grid-cols-3">
              {data.insightBooks.map(book => (
                <article
                  key={book.id}
                  className="flex flex-col rounded-3xl border border-neutral-800 bg-black/60 p-5 md:p-6"
                >
                  {/* 상단 이미지 / 그라디언트 박스 */}
                  <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-emerald-700/50 via-teal-600/40 to-purple-700/50">
                    <div className="w-full h-32 md:h-40">
                      {book.imageData ? (
                        <img
                          src={book.imageData}
                          alt={`${book.title} 이미지`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <div className="mb-3 flex items-center justify-between text-[11px] text-neutral-300">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <span className="px-2 py-1 rounded-full border border-neutral-500 hover:bg-neutral-800">
                          사진 선택
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageChange(book.id, e)}
                        />
                      </label>
                      {book.imageData && (
                        <button
                          type="button"
                          onClick={() =>
                            handleBookChange(book.id, "imageData", null)
                          }
                          className="text-red-300 hover:text-red-200"
                        >
                          사진 삭제
                        </button>
                      )}
                    </div>
                  )}

                  {/* 텍스트 부분 */}
                  <div className="mt-1 space-y-2 text-[11px] leading-relaxed">
                    {editMode ? (
                      <>
                        <input
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-neutral-50"
                          value={book.title}
                          onChange={e =>
                            handleBookChange(book.id, "title", e.target.value)
                          }
                        />
                        <input
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] text-emerald-300"
                          value={book.subtitle}
                          onChange={e =>
                            handleBookChange(
                              book.id,
                              "subtitle",
                              e.target.value,
                            )
                          }
                        />
                        <textarea
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-[11px] text-neutral-200"
                          rows={4}
                          value={book.summary}
                          onChange={e =>
                            handleBookChange(
                              book.id,
                              "summary",
                              e.target.value,
                            )
                          }
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] font-semibold text-neutral-50">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-emerald-400">
                          {book.subtitle}
                        </p>
                        <p className="mt-2 text-[11px] text-neutral-300">
                          {book.summary}
                        </p>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection

export function About() {
  return <AboutSection />
}
