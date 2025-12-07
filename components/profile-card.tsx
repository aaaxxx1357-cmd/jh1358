"use client"

import React, { useEffect, useState } from "react"

type ProfileCardData = {
  titleLine: string
  name: string
  major: string
  address: string
  birth: string
  interest: string
  phone: string
  email: string
  github: string
  eduText: string
  certText: string
  activityText: string
}

const defaultProfileCardData: ProfileCardData = {
  titleLine: "PORTFOLIO · REAL ESTATE & FINANCE",
  name: "박준형",
  major: "단국대학교 도시계획부동산학부생",
  address: "성남시 수정구 태평로 65",
  birth: "2002년생",
  interest: "부동산금융 · 구조화금융 · PF · 자산관리",
  phone: "010-7629-2269",
  email: "aaaxxx1359@naver.com",
  github: "https://jh1358.vercel.app/",
  eduText: "단국대학교 도시계획부동산학부 재학중",
  certText: "공인중개사 1차 합격\n워드프로세서 필기 합격\n컴퓨터활용능력 2급 필기 합격",
  activityText: "단국대학교 부동산학회 URID 활동\nPF·IM·임장 프로젝트 다수 수행",
}

const PROFILE_STORAGE_KEY = "profileCardData"
const PROFILE_IMAGE_KEY = "profileCardImage"

function renderLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

export function ProfileCard() {
  const [data, setData] = useState<ProfileCardData>(defaultProfileCardData)
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<ProfileCardData>
        setData({ ...defaultProfileCardData, ...parsed })
      } catch {
        // ignore
      }
    }

    const savedImg = window.localStorage.getItem(PROFILE_IMAGE_KEY)
    if (savedImg) {
      setProfileImage(savedImg)
    }
  }, [])

  const handleChange = (field: keyof ProfileCardData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
      if (profileImage) {
        window.localStorage.setItem(PROFILE_IMAGE_KEY, profileImage)
      }
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultProfileCardData)
    setProfileImage(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY)
      window.localStorage.removeItem(PROFILE_IMAGE_KEY)
    }
    setEditMode(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PROFILE_IMAGE_KEY, reader.result)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="bg-neutral-950 py-20 text-neutral-900">
      <div className="max-w-5xl mx-auto px-4 relative">
        
        

        {/* 제목(원하면 숨겨도 됨) */}
        <h2 className="text-xl font-semibold text-white">Profile</h2>

        {/* 메인 카드 */}
        <div className="bg-white text-neutral-900 rounded-3xl shadow-xl p-8 md:p-10 grid gap-8 md:grid-cols-[1.1fr,2fr] mt-6">
          {/* 왼쪽: 사진 + 기본 정보 */}
          <div className="space-y-6">
            {/* 사진 + 이름 블록 */}
            <div className="flex flex-col items-center gap-3">
              {/* Details 라벨 */}
              <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                Details
              </span>

              {/* 프로필 사진 */}
              <div className="w-28 h-28 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-xs text-neutral-500">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>사진</span>
                )}
              </div>

              {/* 편집 모드에서 사진 업로드 */}
              {editMode && (
                <label className="mt-1 inline-flex items-center gap-2 cursor-pointer text-[11px] text-neutral-600">
                  <span className="px-2 py-1 rounded-full border border-neutral-400 hover:bg-neutral-100">
                    사진 선택
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <span>JPG/PNG 업로드</span>
                </label>
              )}

              {/* 이름 / 타이틀 */}
              <div className="text-center space-y-1 mt-2">
                {editMode ? (
                  <>
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-[10px] text-neutral-500 text-center"
                      value={data.titleLine}
                      onChange={e =>
                        handleChange("titleLine", e.target.value)
                      }
                    />
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-lg font-semibold text-center"
                      value={data.name}
                      onChange={e => handleChange("name", e.target.value)}
                    />
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-xs text-neutral-500 text-center"
                      value={data.major}
                      onChange={e => handleChange("major", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                      {data.titleLine}
                    </p>
                    <h3 className="text-xl font-semibold">{data.name}</h3>
                    <p className="text-xs text-neutral-500">{data.major}</p>
                  </>
                )}
              </div>
            </div>

            {/* 기본사항 + 연락처 */}
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-semibold mb-2">기본사항</h3>
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1"
                      value={data.address}
                      onChange={e =>
                        handleChange("address", e.target.value)
                      }
                    />
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1"
                      value={data.birth}
                      onChange={e => handleChange("birth", e.target.value)}
                    />
                    <textarea
                      className="w-full border border-neutral-300 rounded-lg px-2 py-2"
                      rows={2}
                      value={data.interest}
                      onChange={e =>
                        handleChange("interest", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <ul className="space-y-1">
                    <li>거주지: {data.address}</li>
                    <li>생년: {data.birth}</li>
                    <li>관심분야: {data.interest}</li>
                  </ul>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">연락처</h3>
                {editMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1"
                      value={data.phone}
                      onChange={e => handleChange("phone", e.target.value)}
                    />
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1"
                      value={data.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                    <input
                      className="w-full border border-neutral-300 rounded-lg px-2 py-1"
                      value={data.github}
                      onChange={e => handleChange("github", e.target.value)}
                    />
                  </div>
                ) : (
                  <ul className="space-y-1">
                    <li>휴대전화: {data.phone}</li>
                    <li>Email: {data.email}</li>
                    <li>GitHub: {data.github}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 학력 / 자격 / 활동 */}
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">학력사항</h3>
              {editMode ? (
                <textarea
                  className="w-full border border-neutral-300 rounded-lg px-2 py-2"
                  rows={3}
                  value={data.eduText}
                  onChange={e => handleChange("eduText", e.target.value)}
                />
              ) : (
                <ul className="space-y-1 text-sm">
                  {renderLines(data.eduText).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">자격사항</h3>
              {editMode ? (
                <textarea
                  className="w-full border border-neutral-300 rounded-lg px-2 py-2"
                  rows={3}
                  value={data.certText}
                  onChange={e => handleChange("certText", e.target.value)}
                />
              ) : (
                <ul className="space-y-1">
                  {renderLines(data.certText).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">활동사항</h3>
              {editMode ? (
                <textarea
                  className="w-full border border-neutral-300 rounded-lg px-2 py-2"
                  rows={3}
                  value={data.activityText}
                  onChange={e =>
                    handleChange("activityText", e.target.value)
                  }
                />
              ) : (
                <ul className="space-y-1">
                  {renderLines(data.activityText).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
