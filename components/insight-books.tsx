"use client"

import React, { useEffect, useState } from "react"

type InsightBookItem = {
  id: string
  category: string
  title: string
  highlight: string
  description: string
  imageData: string | null // 업로드된 이미지(Base64)
}

type InsightBooksData = {
  sectionTitle: string
  sectionSubtitle: string
  items: InsightBookItem[]
}

const STORAGE_KEY = "insightBooksData-v2"

const defaultInsightBooksData: InsightBooksData = {
  sectionTitle: "Insight Books",
  sectionSubtitle:
    "부동산·도시·금융을 바라보는 시각에 영향을 준 책들입니다.",
  items: [
    {
      id: "book-1",
      category: "도시는 무엇으로 사는가",
      title: "도시는 무엇으로 사는가",
      highlight: "도시와 사람, 공간의 관계를 다시 보게 해 준 책",
      description:
        "도시가 단순한 배경이 아니라, 사람과 정책, 자본이 끊임없이 상호작용하는 유기체라는 감각을 심어 주었습니다.",
      imageData: null,
    },
    {
      id: "book-2",
      category: "더 인간적인 건축",
      title: "더 인간적인 건축",
      highlight: "멋진 건물보다 ‘살고 싶은 도시’를 고민하게 만든 책",
      description:
        "반복적인 스카이라인 뒤에 가려진 일상의 보행 경험을 생각하게 하며, 개발이 사람의 삶과 어떻게 만나야 하는지 돌아보게 합니다.",
      imageData: null,
    },
    {
      id: "book-3",
      category: "지리의 힘",
      title: "지리의 힘",
      highlight: "입지와 구조를 함께 보는 시각",
      description:
        "각 국가와 도시의 입지가 경제·정치·문화에 미치는 영향을 통해, ‘입지’가 부동산 가치의 핵심 축이라는 사실을 다시 확인하게 해 준 책입니다.",
      imageData: null,
    },
  ],
}

function InsightBooksInner() {
  const [data, setData] = useState<InsightBooksData>(defaultInsightBooksData)
  const [editMode, setEditMode] = useState(false)

  // 최초 로드 시 localStorage에서 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as InsightBooksData
      setData({
        sectionTitle: parsed.sectionTitle || defaultInsightBooksData.sectionTitle,
        sectionSubtitle:
          parsed.sectionSubtitle || defaultInsightBooksData.sectionSubtitle,
        items:
          parsed.items && parsed.items.length > 0
            ? parsed.items.map((item, idx) => ({
                ...defaultInsightBooksData.items[idx],
                ...item,
              }))
            : defaultInsightBooksData.items,
      })
    } catch {
      // ignore
    }
  }, [])

  const handleHeaderChange = (
    field: keyof Pick<InsightBooksData, "sectionTitle" | "sectionSubtitle">,
    value: string,
  ) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const updateItemField = (
    id: string,
    field: keyof InsightBookItem,
    value: InsightBookItem[keyof InsightBookItem],
  ) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? ({ ...item, [field]: value } as InsightBookItem) : item,
      ),
    }))
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultInsightBooksData)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setEditMode(false)
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
        updateItemField(id, "imageData", reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = (id: string) => {
    updateItemField(id, "imageData", null)
  }

  return (
    <section
      id="insight-books"
      className="bg-neutral-950 text-white py-20 border-t border-neutral-800"
    >
      <div className="max-w-6xl mx-auto px-4 relative space-y-8">
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

        {/* 섹션 타이틀 */}
        <header className="space-y-2">
          {editMode ? (
            <>
              <input
                className="w-full max-w-xs rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-2xl font-bold text-neutral-50"
                value={data.sectionTitle}
                onChange={e =>
                  handleHeaderChange("sectionTitle", e.target.value)
                }
              />
              <textarea
                className="w-full max-w-xl rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-200"
                rows={2}
                value={data.sectionSubtitle}
                onChange={e =>
                  handleHeaderChange("sectionSubtitle", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold">
                {data.sectionTitle}
              </h2>
              <p className="text-sm text-neutral-300">
                {data.sectionSubtitle}
              </p>
            </>
          )}
        </header>

        {/* 큰 안쪽 박스 + 카드 3개 (스크린샷 레이아웃 그대로) */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/70 px-6 py-6 md:px-8 md:py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {data.items.map(item => (
              <article
                key={item.id}
                className="flex flex-col rounded-3xl border border-neutral-800 bg-black/60 p-5 md:p-6"
              >
                {/* 상단 이미지/그라디언트 영역 */}
                <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-emerald-700/50 via-teal-600/40 to-purple-700/50">
                  <div className="w-full h-32 md:h-40">
                    {item.imageData ? (
                      <img
                        src={item.imageData}
                        alt={`${item.title} 이미지`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* 편집 모드일 때만 사진 업로드 버튼 표시 */}
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
                        onChange={e => handleImageChange(item.id, e)}
                      />
                    </label>
                    {item.imageData && (
                      <button
                        type="button"
                        onClick={() => handleClearImage(item.id)}
                        className="text-red-300 hover:text-red-200"
                      >
                        사진 삭제
                      </button>
                    )}
                  </div>
                )}

                {/* 텍스트 영역 */}
                <div className="mt-1 space-y-2 text-[11px] leading-relaxed">
                  {editMode ? (
                    <>
                      <input
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-neutral-50"
                        value={item.category}
                        onChange={e =>
                          updateItemField(
                            item.id,
                            "category",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-neutral-50"
                        value={item.title}
                        onChange={e =>
                          updateItemField(item.id, "title", e.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] text-emerald-300"
                        value={item.highlight}
                        onChange={e =>
                          updateItemField(
                            item.id,
                            "highlight",
                            e.target.value,
                          )
                        }
                      />
                      <textarea
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-[11px] text-neutral-200"
                        rows={4}
                        value={item.description}
                        onChange={e =>
                          updateItemField(
                            item.id,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] font-semibold text-neutral-50">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-emerald-400">
                        {item.highlight}
                      </p>
                      <p className="mt-2 text-[11px] text-neutral-300">
                        {item.description}
                      </p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// 🔹 실제로 쓰일 컴포넌트 export (이름 여러 개로 동시에 내보내기)
export function InsightBooks() {
  return <InsightBooksInner />
}

// 페이지에서 혹시 <InsightBook />으로 쓰고 있을 수도 있으니까 alias
export const InsightBook = InsightBooks

// default export 도 같이
export default InsightBooks
