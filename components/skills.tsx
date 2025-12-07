"use client"

import React, { useEffect, useState } from "react"

type SkillItem = {
  label: string
  score: string
}

type SkillsData = {
  title: string
  subtitle: string
  items: SkillItem[]
}

const defaultSkillsData: SkillsData = {
  title: "Skills",
  subtitle: "학회·수업·프로젝트 기반 5점 만점 자기 평가입니다.",
  items: [
    { label: "Real Estate Analysis", score: "4.3 / 5.0" },
    { label: "PF / Project Finance", score: "4.0 / 5.0" },
    { label: "Asset Management / AM", score: "3.8 / 5.0" },
    { label: "Excel / 데이터 분석", score: "3.5 / 5.0" },
    { label: "Python / 시계열 분석 기초", score: "3.3 / 5.0" },
  ],
}

export function Skills() {
  const [data, setData] = useState<SkillsData>(defaultSkillsData)
  const [editMode, setEditMode] = useState(false)

  // 처음 로딩 시 localStorage에서 값 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem("skillsData")
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SkillsData
        setData(parsed)
      } catch {
        // 파싱 실패하면 무시
      }
    }
  }, [])

  const handleItemChange = (
    index: number,
    field: keyof SkillItem,
    value: string,
  ) => {
    setData((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("skillsData", JSON.stringify(data))
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultSkillsData)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("skillsData")
    }
  }

  return (
    <section
      id="skills"
      className="bg-neutral-900 text-white py-16 border-t border-neutral-800"
    >
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* 오른쪽 위 편집 버튼 */}
        <div className="absolute right-0 -top-2 flex gap-2 text-xs">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="rounded-full px-3 py-1 bg-slate-100 text-slate-900 hover:bg-white"
              >
                저장
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="rounded-full px-3 py-1 border border-slate-500 text-slate-200 hover:bg-neutral-800"
              >
                취소
              </button>
              <button
                onClick={handleReset}
                className="rounded-full px-3 py-1 border border-red-300 text-red-300 hover:bg-red-950"
              >
                초기화
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="rounded-full px-3 py-1 border border-slate-500 text-slate-300 hover:bg-neutral-800"
            >
              편집
            </button>
          )}
        </div>

        {/* 제목 / 부제목 */}
        {editMode ? (
          <div className="space-y-2 mb-8 pt-4">
            <input
              className="w-full border border-slate-600 bg-neutral-900 rounded-lg px-3 py-2 text-2xl font-bold"
              value={data.title}
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <input
              className="w-full border border-slate-600 bg-neutral-900 rounded-lg px-3 py-2 text-sm text-neutral-200"
              value={data.subtitle}
              onChange={(e) =>
                setData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
            />
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
            <p className="mb-8 text-neutral-300 text-sm">{data.subtitle}</p>
          </>
        )}

        {/* 스킬 리스트 */}
        <div className="space-y-4 text-sm">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between"
            >
              {editMode ? (
                <>
                  <input
                    className="md:w-1/2 border border-slate-600 bg-neutral-900 rounded-lg px-3 py-1"
                    value={item.label}
                    onChange={(e) =>
                      handleItemChange(index, "label", e.target.value)
                    }
                  />
                  <input
                    className="md:w-1/3 border border-slate-600 bg-neutral-900 rounded-lg px-3 py-1 md:text-right"
                    value={item.score}
                    onChange={(e) =>
                      handleItemChange(index, "score", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-neutral-300 md:text-right">
                    {item.score}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
