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
  subtitle: "부동산 실물과 금융을 함께 이해하는 부동산 금융 전문가입니다.",
  introText: `부동산 실물과 금융을 함께 이해하며 자산운용사 입사를 목표하고 있습니다.

단국대학교 도시계획부동산학부에서 PF·NPL·주택금융, 부동산자산관리, 부동산경제, 도시계획, 주택정책, 공법·사법 과목을 수강하며 부동산을 ‘도시 위의 자산’으로 바라보는 훈련을 해 왔습니다.

공인중개사 1차를 합격해 기초 법·제도와 세제에 대한 이해도 함께 쌓았습니다.

프로젝트에서는 PF 구조와 NPL, 리츠, 주택금융 시계열 분석, 성남 원도심 주택시장·인구구조 분석, 특성가구별 주거정책, 마케팅·자산관리까지 연결하며 ‘도시 위의 숫자’를 읽는 연습을 하고 있습니다. 부동산학회 URID에서 수행한 씨티센터타워 실물 IM, 래미안 목동 아델리체 개발 IM, 용산·성수 등 임장 리포트를 통해 자산을 현장에서 보고, 도시·정책·법의 틀 안에서 이해한 뒤, 금융 구조로 연결하는 시각을 키워가고 있습니다.

마지막으로, 프로젝트에 대한 열의와 책임감은 그 어느누구 못지 않습니다. 지금 바로 입사하여 실무에 투입되어 딜 소싱부터 클로징까지 책임지고 맡아 해낼 자신이 있습니다. 저에게 입사의 기회를 주신다면 항상 최우선으로 회사를 생각하고 일찍 출근하여 뽑아주신 고마움을 잊지 않고, 제가 있는 회사가 업계 1위가 되도록 일하는 인재가 되겠습니다. 저를 믿고 뽑아주십시오!`,
  activitiesText: `단국대학교 도시계획부동산학부 재학 (부동산학 전공, 3학년)
공인중개사 1차 합격
부동산학회 URID 14기, 15기활동
– 씨티센터타워 실물 IM, 래미안 목동 아델리체 개발 IM, 임장 리포트 작성
PF·NPL·리츠·주택금융 사례 분석 및 시계열·회귀 분석 리포트 작성
성남 원도심 주택시장·인구구조·주거정책 분석, 도시계획 발표 및 공법·사법·감정평가 과제 수행
부동산 마케팅·자산관리 팀 프로젝트 참여
`,
  strengthsText: `숫자와 텍스트를 함께 보는 시각
현장(IM·임장)과 정책·법·금융을 한 흐름으로 연결하려는 시도
디테일을 끝까지 맞추는 집요함과 문서·슬라이드 완성도
복잡한 내용을 구조화해 설명하는 글쓰기 능력`,
  insightText:
    "“제가 감명 깊게 읽은 실물, 개발을 아울러 인간, 도시와 함께 '부동산'의 시야를 넓혀 주었던 도서들입니다.”",
  insightBooks: [
    {
      id: "book-1",
      title: "부동산 금융 프로젝트 바이블",
      subtitle: "PF·NPL·리츠·주택금융 프로젝트를 엮어 놓은 나만의 레퍼런스",
      summary:
        "둔촌주공 재건축 PF, 개인참여형 구조화 NPL 펀드, 신한알파서초리츠의 GS서초타워 인수, 주택금융 시계열 분석과 DSR 정책 리포트까지, 학부 과정에서 수행한 부동산 금융 프로젝트를 한데 모은 책입니다. 각 프로젝트를 통해 자금조달 구조, 이해관계자, 현금흐름·리스크를 정리하며 ‘부동산 금융’이라는 언어를 제 것으로 만드는 과정을 담고 있습니다.",
      imageData: null,
    },
    {
      id: "book-2",
      title: "쉽게 익히는 부동산 개발사업",
      subtitle: "개발 IM과 도시계획·공법을 연결한 개발 입문서",
      summary:
        "래미안 목동 아델리체 개발 IM을 중심으로, 사업구조·분양가 산정·PFV·사업성 민감도 분석을 정리한 책입니다. 여기에 성남 도시계획·도시기본계획, 정비사업 관련 공법 과제 내용을 더해 “개발사업이 어떻게 기획되고 인허가를 통과해 자산이 되는지”를 단계별로 설명합니다. 개발이 ‘도면’이 아니라, 도시계획·법·금융이 동시에 작동하는 종합 프로젝트라는 감각을 정리했습니다.",
      imageData: null,
    },
    {
      id: "book-3",
      title: "기관투자자만 아는 부동산 운영 투자 메뉴얼",
      subtitle: "리츠·자산관리·임장 경험으로 정리한 수익형 자산 운영 노트",
      summary:
        "씨티센터타워 실물 IM과 용산 아이파크몰 임장, 부동산 자산관리 수업 프로젝트를 바탕으로, 오피스·상업시설·꼬마빌딩을 어떻게 운영하고 관리해야 하는지 정리한 책입니다. 임대료·공실·CAPEX를 반영한 Cash Flow, IRR·수익률 분석, 테넌트 믹스·동선·마케팅 전략까지 기관투자자 관점에서 생각해 본 메모들을 담고 있습니다. “좋은 자산을 사는 것”을 넘어, “산 뒤에 어떻게 운영해야 가치가 쌓이는지”에 집중한 노트입니다.",
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
