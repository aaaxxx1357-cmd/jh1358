"use client"

import React, { useEffect, useState } from "react"

type HeroData = {
  titleName: string
  tagline: string
  description: string
  email: string
  github: string
  location: string
}

const defaultHeroData: HeroData = {
  titleName: "박준형",
  tagline:
    "PF·NPL·주택금융을 공부하며, 실물 자산과 도시를 함께 보는 부동산 금융 전문가",
  description:
    "단국대학교 도시계획부동산학부에서 부동산 금융과 도시·정책·법을 함께 공부하고 있습니다. PF 구조, NPL, 리츠, 주택금융을 통해 ‘부동산을 돈의 흐름과 리스크’의 관점에서 보고, 실제 IM·개발 IM·임장 경험으로 도시와 자산, 금융 구조를 함께 연결하는 연습을 하고 있습니다.",
  email: "your-email@example.com",
  github: "github.com/your-github-id",
  location: "경기 성남시 · 단국대학교 도시계획부동산학부",
}

const HERO_STORAGE_KEY = "heroData"
const HERO_IMAGE_KEY = "heroProfileImage"

export function Hero() {
  const [data, setData] = useState<HeroData>(defaultHeroData)
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // 초기 로드: 텍스트 + 이미지 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = window.localStorage.getItem(HERO_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<HeroData>
        setData({ ...defaultHeroData, ...parsed })
      } catch {
        // ignore
      }
    }

    const savedImg = window.localStorage.getItem(HERO_IMAGE_KEY)
    if (savedImg) {
      setProfileImage(savedImg)
    }
  }, [])

  const handleChange = (field: keyof HeroData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(data))
      if (profileImage) {
        window.localStorage.setItem(HERO_IMAGE_KEY, profileImage)
      }
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultHeroData)
    setProfileImage(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(HERO_STORAGE_KEY)
      window.localStorage.removeItem(HERO_IMAGE_KEY)
    }
    setEditMode(false)
  }

  // 파일 인풋으로 사진 올리기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(HERO_IMAGE_KEY, reader.result)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white py-16 md:py-20 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 relative">
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
                className="rounded-full border border-slate-500 px-3 py-1 text-slate-200 hover:bg-slate-900"
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
              className="rounded-full border border-slate-500 px-3 py-1 text-slate-300 hover:bg-slate-900"
            >
              편집
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start md:items-stretch">
          {/* 왼쪽: 소개 텍스트 */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] tracking-[0.24em] uppercase text-slate-300">
              <span>Real Estate · Finance · Urban</span>
            </div>

            <div className="space-y-3">
              {editMode ? (
                <input
                  className="w-full max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-3xl md:text-4xl font-extrabold text-slate-900"
                  value={data.titleName}
                  onChange={e => handleChange("titleName", e.target.value)}
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  {data.titleName}
                </h1>
              )}

              {editMode ? (
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base font-semibold text-slate-700"
                  rows={2}
                  value={data.tagline}
                  onChange={e => handleChange("tagline", e.target.value)}
                />
              ) : (
                <p className="text-sm md:text-base font-semibold text-slate-100">
                  {data.tagline}
                </p>
              )}
            </div>

            <div className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {editMode ? (
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-800"
                  rows={4}
                  value={data.description}
                  onChange={e => handleChange("description", e.target.value)}
                />
              ) : (
                <p>{data.description}</p>
              )}
            </div>

            {/* 연락 정보 */}
            <div className="mt-4 grid gap-2 text-[11px] text-slate-300 sm:grid-cols-3">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {editMode ? (
                  <input
                    className="w-full border border-slate-500 rounded-md px-2 py-1 text-[11px] text-slate-100 bg-slate-900"
                    value={data.location}
                    onChange={e => handleChange("location", e.target.value)}
                  />
                ) : (
                  <span>{data.location}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                {editMode ? (
                  <input
                    className="w-full border border-slate-500 rounded-md px-2 py-1 text-[11px] text-slate-100 bg-slate-900"
                    value={data.email}
                    onChange={e => handleChange("email", e.target.value)}
                  />
                ) : (
                  <span>{data.email}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                {editMode ? (
                  <input
                    className="w-full border border-slate-500 rounded-md px-2 py-1 text-[11px] text-slate-100 bg-slate-900"
                    value={data.github}
                    onChange={e => handleChange("github", e.target.value)}
                  />
                ) : (
                  <span>{data.github}</span>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 프로필 카드 (조금 아래로 내려감) */}
          <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-20">
            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/85 px-6 py-6 md:px-8 md:py-7 shadow-xl shadow-emerald-500/25">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                    Real Estate Finance
                  </p>
                  <h3 className="mt-1 text-base font-semibold">
                    PF · NPL · 주택금융
                  </h3>
                </div>
                <span className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-300">
                  편집 모드에서 사진 업로드
                </span>
              </div>

              <p className="mt-3 text-[11px] text-slate-200 leading-relaxed">
                실물 IM · 개발 IM · 임장, 그리고 도시·정책·법 과제를 연결해 숫자와
                공간을 동시에 보는 시각을 만들고 있습니다.
              </p>

              {/* 프로필 사진 + 설명 */}
              <div className="mt-4 flex items-center gap-4">
                <div className="w-50 h-50 md:w-50 md:h-50 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-[11px] text-slate-400">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="프로필 사진"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>사진 추가</span>
                  )}
                </div>
                <div className="flex-1 text-[11px] text-slate-300 leading-relaxed">
                  <p>
                    PF·NPL·주택금융을 축으로 실물 자산과 도시를 함께 보는
                    부동산 금융 전문가를 지향합니다.
                  </p>
                </div>
              </div>

              {/* 편집 모드에서만 보이는 사진 업로드 버튼 */}
              {editMode && (
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                    <span className="px-2 py-1 rounded-full border border-slate-500 hover:bg-slate-800">
                      사진 선택
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="text-slate-500">JPG/PNG 업로드</span>
                  </label>
                </div>
              )}

              {/* 태그 카드들 */}
              <div className="mt-5 flex flex-wrap gap-3 text-[11px]">
                <div className="rounded-2xl bg-slate-800/70 px-3 py-2">
                  <p className="text-slate-400">트랙</p>
                  <p className="mt-1 text-slate-100">부동산 금융</p>
                </div>
                <div className="rounded-2xl bg-slate-800/70 px-3 py-2">
                  <p className="text-slate-400">관심</p>
                  <p className="mt-1 text-slate-100">PF · NPL · 리츠</p>
                </div>
                <div className="rounded-2xl bg-slate-800/70 px-3 py-2">
                  <p className="text-slate-400">강점</p>
                  <p className="mt-1 text-slate-100">데이터 & 글쓰기</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
