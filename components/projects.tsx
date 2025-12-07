"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

const STORAGE_KEY = "projectsData-v3"

type EditableProjectField = "tag" | "title" | "summary" | "detail"

type ProjectItem = {
  id?: string
  tag: string
  title: string
  summary: string
  detail: string
  fileKey?: string
}

type ProjectSection = {
  id: string
  title: string
  subtitle: string
  items: ProjectItem[]
}

type ProjectsData = {
  introTitle: string
  introSubtitle: string
  sections: ProjectSection[]
}

type FlatProject = ProjectItem & {
  id: string
  sectionId: string
  sectionTitle: string
}

type ViewerFile = {
  id: string
  title: string
  url: string
}

// ------------------- PDF 매핑 -------------------
const projectPdfMap: Record<string, { title: string; url: string }> = {
  "URID-0": {
    title: "래미안목동아델리체_개발IM_유리드15기_1팀 (PDF)",
    url: "/files/래미안목동아델리체_개발IM_유리드15기_1팀.pdf",
  },
  "URID-1": {
    title: "래미안목동아델리체_개발IM_CashFlow_유리드15기_1팀 (EXCEL)",
    url: "/files/래미안목동아델리체_개발IM_CashFlow_유리드15기_1팀.xlsx",
  },
  "URID-2": {
    title: "용산아이파크몰 임장보고서_유리드15기_1조 (PDF)",
    url: "/files/용산아이파크몰 임장보고서_유리드15기_1조.pdf",
  },
  "URID-3": {
    title: "씨티센터타워_실물IM_유리드14기 (PDF)",
    url: "/files/씨티센터타워_실물IM_유리드14기.pdf",
  },
  "URID-4": {
    title: "씨티센터타워 실물IM 1팀_CASH FLOW_유리드14기 (EXCEL)",
    url: "/files/씨티센터타워 실물IM 1팀_CASH FLOW_유리드14기.xlsx",
  },
  "URID-5": {
    title: "성수권역_임장리포트_유리드14기 (PDF)",
    url: "/files/성수권역_임장리포트_유리드14기.pdf",
  },
  "URID-6": {
    title:
      "PF대출은 어떻게 한국판 서브프라임이 되었는가 레고랜드 사태를 시작으로 (PDF)",
    url: "/files/PF대출은 어떻게 한국판 서브프라임이 되었는가 레고랜드 사태를 시작으로.pdf",
  },
  "finance-0": {
    title:
      "PF 대출 부실화 대응 방안으로서의 개인참여형 구조화 NPL 펀드 도입 가능성 연구 (PDF)",
    url: "/files/PF 대출 부실화 대응 방안으로서의 개인참여형 구조화 NPL 펀드 도입 가능성 연구.pdf",
  },
  "finance-1": {
    title:
      "PF 대출 부실화 대응 방안으로서의 개인참여형 구조화 NPL 펀드 도입 가능성 연구_발표 PPT",
    url: "/files/PF 대출 부실화 대응 방안으로서의 개인참여형 구조화 NPL 펀드 도입 가능성 연구_발표 PPT.pdf",
  },
  "finance-2": {
    title:
      "PF금융구조의 문제점과 개선방안 제안 및 적용 가능성과 유익성 분석 현대건설 둔촌주공 재건축사업을 중심으로 (PDF)",
    url: "/files/PF금융구조의 문제점과 개선방안 제안 및 적용 가능성과 유익성 분석 현대건설 둔촌주공 재건축사업을 중심으로.pdf",
  },
  "finance-3": {
    title:
      "실물 매입 금융기법 분석 및 평가와 리스크분석 및 헷징의 개선방안 제안 신한알파리츠 GS서초타워를 중심으로 (PDF)",
    url: "/files/실물 매입 금융기법 분석 및 평가와 리스크분석 및 헷징의 개선방안 제안 신한알파리츠 GS서초타워를 중심으로.pdf",
  },
  "finance-4": {
    title:
      "DSR 정책이 주택금융시장에 미친 단기적 · 장기적 영향 분석 및 문제점과 개선방안의 정책적 제언 가계부채와 주택시장 안정성 측면에서 (PDF)",
    url: "/files/DSR 정책이 주택금융시장에 미친 단기적 · 장기적 영향 분석 및 문제점과 개선방안의 정책적 제언 가계부채와 주택시장 안정성 측면에서.pdf",
  },
  "finance-5": {
    title: "주택금융분석_보고서",
    url: "/files/주택금융분석_보고서.pdf",
  },
  "finance-6": {
    title: "주택금융분석_엑셀",
    url: "/files/주택금융분석_엑셀.xlsx",
  },
  "economics-0": {
    title: "부동산가격결정요인_실증분석_보고서 (PDF)",
    url: "/files/부동산가격결정요인_실증분석_보고서.pdf",
  },
  "economics-1": {
    title: "부동산가격결정요인_실증분석_엑셀 (EXCEL)",
    url: "/files/부동산가격결정요인_실증분석_엑셀.xlsx",
  },
  "economics-2": {
    title:
      "인구구조 및 가구구성의 변화에 따른 주택 수요 및 가격의 변화와 전망과 주택정책 및 도시계획의 정책적 제언성남시 원도심을 중심으로 (PDF)",
    url: "/files/인구구조 및 가구구성의 변화에 따른 주택 수요 및 가격의 변화와 전망과 주택정책 및 도시계획의 정책적 제언성남시 원도심을 중심으로.pdf",
  },
  "economics-3": {
    title:
      "부동산 경제학의 수요-공급 모델과 실제 시장데이터를 활용한 정책의 실질적 평가 2.4. 공급대책을 중심으로 (PDF)",
    url: "/files/부동산 경제학의 수요-공급 모델과 실제 시장데이터를 활용한 정책의 실질적 평가 2.4. 공급대책을 중심으로.pdf",
  },
  "economics-4": {
    title:
      "주택 수요 및 공급 변화 추이의 이론 · 실제차이에 따른 경제적 · 사회적 · 정책적 요인과 주택가격 안정을 위한 정책적 제언 성남시 원도심을 중심으로 (PDF)",
    url: "/files/주택 수요 및 공급 변화 추이의 이론 · 실제차이에 따른 경제적 · 사회적 · 정책적 요인과 주택가격 안정을 위한 정책적 제언 성남시 원도심을 중심으로.pdf",
  },
  "IM-0": {
    title:
      "꼬마빌딩(역삼동 810-18) 매입타당성 분석 GBD권역을 중심으로 (PDF)",
    url: "/files/꼬마빌딩(역삼동 810-18) 매입타당성 분석 GBD권역을 중심으로.pdf",
  },
  "IM-1": {
    title:
      "꼬마빌딩(역삼동 810-18) 매입타당성 분석 GBD권역을 중심으로_엑셀 (EXCEL)",
    url: "/files/꼬마빌딩(역삼동 810-18) 매입타당성 분석 GBD권역을 중심으로_엑셀.xlsx",
  },
  marketing: {
    title: "전통적 방식과 프롭테크 방식을 활용한 부동산 마케팅 (PDF)",
    url: "/files/전통적 방식과 프롭테크 방식을 활용한 부동산 마케팅.pdf",
  },
  urban: {
    title:
      "성남시의 도시계획적 역사 및 비전과 목표 분당구와 대비되는 수정구 · 중원구 (PDF)",
    url: "/files/성남시의 도시계획적 역사 및 비전과 목표 분당구와 대비되는 수정구 · 중원구.pdf",
  },
  "law-policy-0": {
    title: "법률행위 목적의 사회적 타당성 사례 분석 (PDF)",
    url: "/files/법률행위 목적의 사회적 타당성 사례 분석.pdf",
  },
  "law-policy-1": {
    title:
      "도시군관리계획의 입안과 결정에 대한 도시군기본계획(수립과 승인)의 대조적 해석 (PDF)",
    url: "/files/도시군관리계획의 입안과 결정에 대한 도시군기본계획(수립과 승인)의 대조적 해석.pdf",
  },
  "law-policy-2": {
    title:
      "공동주택 공시가격 현실화율 69% 동결과 감정평가 해석 시장가치, 가격제원칙, 공시제도를 중심으로 (PDF)",
    url: "/files/law.pdf",
  },
  "law-policy-3": {
    title:
      "특성가구별 주거실태 및 주거지원정책 분석과 향후 정책 방향 (PDF)",
    url: "/files/특성가구별 주거실태 및 주거지원정책 분석과 향후 정책 방향.pdf",
  },
}

// ------------------- 기본 데이터 -------------------
const defaultProjectsData: ProjectsData = {
  introTitle: "Projects & Experience",
  introSubtitle:
    "PF·NPL·주택금융을 축으로, 실물 IM·개발 IM·임장, 도시·정책·법·마케팅·자산관리까지 연결한 프로젝트들입니다.",
  sections: [
    {
      id: "finance",
      title: "Core Finance Projects",
      subtitle: "PF·NPL·주택금융 등 금융·구조화 중심 프로젝트",
      items: [
        {
          id: "finance-0",
          fileKey: "finance-0",
          tag: "구조화 NPL 펀드",
          title:
            "PF 대출 부실화 대응 방안으로서의 개인참여형 구조화 NPL 펀드 도입 가능성 연구",
          summary:
            "레고랜드 사태 이후 PF 대출 부실 문제를 계기로, 개인도 참여 가능한 구조화 NPL 펀드 모델을 설계한 보고서입니다.",
          detail:
            "PF-ABCP 시장의 신용 붕괴 원인과 공공 위주의 부실 정리 구조 한계를 분석하고, 선·후순위 트랜치·신용보강·정보공시·투자자 요건을 포함한 개인참여형 NPL 펀드 구조를 제안했습니다.",
        },
        {
          id: "finance-1",
          fileKey: "finance-1",
          tag: "발표 자료",
          title: "구조화 NPL 펀드 연구 – 발표 자료",
          summary:
            "연구 보고서를 바탕으로 학회·수업 발표용으로 정리한 PPT 자료입니다.",
          detail:
            "핵심 리스크 구조, 투자자 관점 수익 프로파일, 제도 개선 포인트를 슬라이드 중심으로 재구성했습니다.",
        },
        {
          id: "finance-2",
          fileKey: "finance-2",
          tag: "재건축 PF",
          title:
            "PF금융구조의 문제점과 개선방안 제안 – 둔촌주공 재건축 PF 사례",
          summary:
            "국내 최대 재건축 사업인 둔촌주공을 중심으로 PF 금융구조의 한계와 개선 방안을 분석한 보고서입니다.",
          detail:
            "기존 PF 구조의 레버리지·보증 구조를 정리하고, 분양률·분양가·금리 시나리오에 따른 DSCR·IRR 변화를 검토했습니다.",
        },
        {
          id: "finance-3",
          fileKey: "finance-3",
          tag: "실물 리츠",
          title:
            "실물 매입 금융기법 분석 – 신한알파리츠 GS서초타워 편입 사례",
          summary:
            "리츠 구조를 통해 오피스 자산을 편입하는 과정에서의 자금조달 구조와 리스크 관리 방식을 분석했습니다.",
          detail:
            "에쿼티·우선주·대출 비중, 배당 여력, 공실·금리 상승 시 스트레스 시나리오를 함께 검토했습니다.",
        },
        {
          id: "finance-4",
          fileKey: "finance-4",
          tag: "DSR 정책",
          title:
            "DSR 정책이 주택금융시장에 미친 단·장기 영향 분석 및 정책 제언",
          summary:
            "DSR 규제가 가계부채와 주택거래·가격에 미친 영향을 데이터로 검토한 정책 분석 과제입니다.",
          detail:
            "주요 규제 변화 시점별 대출 잔액·연체율·거래량 변화를 비교하고, 부작용·보완 방안을 제시했습니다.",
        },
        {
          id: "finance-5",
          fileKey: "finance-5",
          tag: "주택금융 리포트",
          title: "주택금융분석 리포트",
          summary:
            "금리·거래·가격 데이터를 결합해 국내 주택금융시장의 구조와 리스크를 정리한 종합 보고서입니다.",
          detail:
            "주택담보대출 구조, 고정·변동금리 비중, 만기·상환 방식, DSR·LTV 규제와의 관계를 정리했습니다.",
        },
        {
          id: "finance-6",
          fileKey: "finance-6",
          tag: "엑셀 모델",
          title: "주택금융분석 엑셀 모델",
          summary:
            "주택금융 분석에 사용한 데이터와 계산 로직을 엑셀로 구현한 파일입니다.",
          detail:
            "시계열 데이터 정리, 지표 계산, 그래프 자동 생성 구조를 설계해 재사용 가능한 템플릿으로 만들었습니다.",
        },
      ],
    },

    {
      id: "URID",
      title: "URID – 실물 IM · 개발 IM · 임장",
      subtitle: "유리드 활동으로 수행한 실물·개발 IM과 임장 프로젝트",
      items: [
        {
          id: "URID-0",
          fileKey: "URID-0",
          tag: "재개발 개발 IM",
          title: "래미안 목동 아델리체 개발 IM (유리드 15기 1팀)",
          summary:
            "신정2-1구역 재개발 사업을 대상으로 사업성과 PF 구조를 분석한 개발 IM입니다.",
          detail:
            "사업구조, 법규 검토, 입지·시장분석, 분양가 산정, IRR·NPV 및 민감도 분석을 통해 투자 타당성을 검토했습니다.",
        },
        {
          id: "URID-1",
          fileKey: "URID-1",
          tag: "Cash Flow 모델",
          title:
            "래미안 목동 아델리체 개발 IM Cash Flow (엑셀, 유리드 15기 1팀)",
          summary:
            "개발 IM에 사용된 월별 Cash Flow와 PF 구조를 엑셀로 구현한 모델입니다.",
          detail:
            "분양수입·공사비·금융비용·조합원 분담금과 PF 대출 상환 구조를 시나리오별로 계산할 수 있도록 설계했습니다.",
        },
        {
          id: "URID-2",
          fileKey: "URID-2",
          tag: "임장 리포트",
          title: "용산아이파크몰 임장 보고서 (유리드 15기 1조)",
          summary:
            "용산 아이파크몰을 대상으로 상권·테넌트 구성·임대료 수준을 분석한 임장 보고서입니다.",
          detail:
            "MD 구성, 유동인구, 경쟁 상권과의 비교를 통해 자산 포지셔닝과 향후 리포지셔닝 방향을 제시했습니다.",
        },
        {
          id: "URID-3",
          fileKey: "URID-3",
          tag: "CBD 오피스 실물 IM",
          title: "씨티센터타워 실물 IM (유리드 14기)",
          summary:
            "서울 중구 씨티센터타워를 대상으로 투자자 관점의 실물 투자제안서를 작성한 프로젝트입니다.",
          detail:
            "자산 개요, 임차인 구성, 임대료·공실률, CAPEX·OPEX 계획, Exit 전략과 수익률 시나리오를 정리했습니다.",
        },
        {
          id: "URID-4",
          fileKey: "URID-4",
          tag: "Cash Flow 모델",
          title: "씨티센터타워 실물 IM Cash Flow (유리드 14기)",
          summary:
            "씨티센터타워 실물 IM의 임대·운영·매각 시나리오를 수치화한 엑셀 Cash Flow입니다.",
          detail:
            "NOI, LTV, DSCR, 배당 가능 현금흐름을 기간별로 계산해 리츠 편입 시 수익 구조를 검토했습니다.",
        },
        {
          id: "URID-5",
          fileKey: "URID-5",
          tag: "성수권역 임장",
          title: "성수권역 임장 리포트 (유리드 14기)",
          summary:
            "성수권역 주요 자산을 대상으로 임대료·공실률·개발 호재를 정리한 임장 리포트입니다.",
          detail:
            "상업·업무·주거 복합 자산의 포지셔닝을 비교하고, 향후 개발 방향과 투자 포인트를 제시했습니다.",
        },
        {
          id: "URID-6",
          fileKey: "URID-6",
          tag: "PF 리스크 분석",
          title:
            "PF대출은 어떻게 한국판 서브프라임이 되었는가 – 레고랜드 사태를 시작으로",
          summary:
            "레고랜드 사태를 계기로 PF 대출 구조의 취약성을 분석하고, 시스템 리스크 요인을 정리한 글입니다.",
          detail:
            "PF-ABCP, 보증 구조, 차환 리스크를 짚어 보고, 향후 규제·시장 구조 개선 방향을 논의했습니다.",
        },
      ],
    },

    {
      id: "economics",
      title: "Real Estate Economics & Market",
      subtitle: "가격결정요인, 수요·공급, 인구·가구 구조를 다룬 경제 분석",
      items: [
        {
          id: "economics-0",
          fileKey: "economics-0",
          tag: "가격결정 실증분석",
          title: "부동산 가격결정요인 실증분석 보고서",
          summary:
            "실거래가 데이터를 활용해 주택 가격에 영향을 미치는 요인을 회귀모형으로 분석한 보고서입니다.",
          detail:
            "입지·면적·연식·역세권 여부 등의 변수로 모델을 구성하고, 계수 해석과 정책적 시사점을 정리했습니다.",
        },
        {
          id: "economics-1",
          fileKey: "economics-1",
          tag: "데이터·엑셀",
          title: "부동산 가격결정요인 실증분석 엑셀",
          summary:
            "가격결정요인 실증분석에 사용한 데이터와 회귀분석 결과를 정리한 엑셀 파일입니다.",
          detail:
            "데이터 전처리, 변수 생성, 회귀 결과 테이블·그래프를 정리해 재사용 가능한 분석 템플릿으로 만들었습니다.",
        },
        {
          id: "economics-2",
          fileKey: "economics-2",
          tag: "인구·가구 구조",
          title:
            "인구·가구구성 변화에 따른 주택 수요·가격 변화와 정책 제언 – 성남 원도심",
          summary:
            "성남 원도심의 인구·가구 구조 변화를 바탕으로 주택 수요와 가격 변화를 분석한 보고서입니다.",
          detail:
            "연령대·가구 유형·이동 패턴을 정리하고, 소형·임대 수요 확대와 정비·공급 정책 방향을 제시했습니다.",
        },
        {
          id: "economics-3",
          fileKey: "economics-3",
          tag: "수요·공급 모형",
          title:
            "부동산 경제학의 수요·공급 모델과 실제 시장데이터를 활용한 정책 평가 – 2.4 공급대책",
          summary:
            "교과서적 수요·공급 모형과 실제 시장 데이터를 비교하며 2·4 공급대책의 효과를 검토한 과제입니다.",
          detail:
            "공급 충격이 가격·거래량에 미치는 영향을 이론·실증 관점에서 비교하고, 정책 한계와 보완점을 논의했습니다.",
        },
        {
          id: "economics-4",
          fileKey: "economics-4",
          tag: "수요·공급 추이",
          title:
            "주택 수요·공급 변화 추이와 경제·사회·정책 요인 – 성남 원도심",
          summary:
            "장기적인 수요·공급 추이를 통해 성남 원도심 주택시장의 구조적 변화를 분석한 보고서입니다.",
          detail:
            "인구·가구·소득·금리·정비사업 등 요인을 함께 고려해 향후 주택시장 안정화 방안을 제안했습니다.",
        },
      ],
    },

    {
      id: "IM",
      title: "Individual Assets – Investment Memorandum",
      subtitle: "개별 자산 매입 타당성 분석 및 Cash Flow 모델",
      items: [
        {
          id: "IM-0",
          fileKey: "IM-0",
          tag: "꼬마빌딩 매입 IM",
          title:
            "꼬마빌딩(역삼동 810-18) 매입 타당성 분석 – GBD 권역 중심",
          summary:
            "역삼동 꼬마빌딩을 대상으로 입지·임대·매각 시나리오를 검토한 매입 타당성 분석 IM입니다.",
          detail:
            "GBD 오피스·상권 흐름, 임대료·공실률, CAPEX, Exit 가격을 가정해 IRR·NPV를 계산했습니다.",
        },
        {
          id: "IM-1",
          fileKey: "IM-1",
          tag: "Cash Flow 모델",
          title:
            "꼬마빌딩(역삼동 810-18) 매입 타당성 분석 Cash Flow (엑셀)",
          summary:
            "꼬마빌딩 매입 IM에 사용한 현금흐름 구조를 엑셀로 구현한 파일입니다.",
          detail:
            "임대수입, 공실·운영비, 대출 상환, Exit 시나리오를 기간별로 계산해 민감도 분석이 가능하도록 설계했습니다.",
        },
      ],
    },

    {
      id: "marketing",
      title: "Real Estate Marketing & PropTech",
      subtitle: "전통적 방식과 프롭테크를 결합한 마케팅 전략",
      items: [
        {
          id: "marketing-0",
          fileKey: "marketing",
          tag: "부동산 마케팅",
          title:
            "전통적 방식과 프롭테크 방식을 활용한 부동산 마케팅 전략",
          summary:
            "오프라인 중개·광고와 프롭테크 기반 타겟 마케팅을 결합한 부동산 마케팅 전략을 정리한 보고서입니다.",
          detail:
            "VR 모델하우스, AI 가격추정, 코어 타겟 광고, 유튜브 콘텐츠 등을 활용한 고객 여정 설계를 제안했습니다.",
        },
      ],
    },

    {
      id: "urban",
      title: "Urban & Policy – 성남시 도시계획",
      subtitle: "성남시 도시계획의 역사와 비전, 원도심과 분당의 대비",
      items: [
        {
          id: "urban-0",
          fileKey: "urban",
          tag: "도시계획",
          title:
            "성남시의 도시계획적 역사와 비전 – 분당구와 대비되는 수정·중원구",
          summary:
            "성남시의 개발 역사와 도시계획 비전을 정리하고, 분당구와 원도심(수정·중원구)의 차이를 분석한 보고서입니다.",
          detail:
            "신도시·구도심의 형성 배경, 기반시설·주거환경·인구 구조 차이를 비교하며 향후 도시재생 방향을 논의했습니다.",
        },
      ],
    },

    {
      id: "law-policy",
      title: "Law & Policy / 감정평가 / 주거정책",
      subtitle: "법·제도·감정평가·주거정책을 함께 보는 과제 모음",
      items: [
        {
          id: "law-policy-0",
          fileKey: "law-policy-0",
          tag: "민법·사회질서",
          title: "법률행위 목적의 사회적 타당성 사례 분석",
          summary:
            "민법상 사회질서 위반 여부를 중심으로, 실제 판례와 유사 사례를 검토한 과제입니다.",
          detail:
            "계약 자유와 공공질서 사이의 긴장을 짚어 보고, 부동산 거래·개발에서 자주 등장하는 쟁점을 정리했습니다.",
        },
        {
          id: "law-policy-1",
          fileKey: "law-policy-1",
          tag: "국토계획법",
          title:
            "도시·군관리계획 입안·결정과 도시·군기본계획(수립·승인)의 대조적 해석",
          summary:
            "국토계획법 체계에서 기본계획과 관리계획의 관계를 비교·분석한 보고서입니다.",
          detail:
            "계층 구조, 법적 구속력, 실무상 활용 차이를 정리하며 개발·인허가 과정에서의 의미를 설명했습니다.",
        },
        {
          id: "law-policy-2",
          fileKey: "law-policy-2",
          tag: "감정평가론",
          title:
            "공동주택 공시가격 현실화율 69% 동결과 감정평가 해석 – 시장가치·가격제원칙·공시제도",
          summary:
            "공시가격 현실화율 동결 정책을 감정평가 이론 관점에서 해석한 과제입니다.",
          detail:
            "시장가치 개념, 가격제 원칙, 공시제도의 목적을 비교하며 현실화율 정책의 한계와 부작용을 논의했습니다.",
        },
        {
          id: "law-policy-3",
          fileKey: "law-policy-3",
          tag: "주거정책",
          title:
            "특성가구별 주거실태 및 주거지원정책 분석과 향후 정책 방향",
          summary:
            "청년·신혼부부·고령층 등 특성가구의 주거실태와 정책을 비교·분석한 보고서입니다.",
          detail:
            "계층별 소득·주거비·거주 형태를 정리하고, 맞춤형 지원 필요성과 정책 방향을 제시했습니다.",
        },
      ],
    },
  ],
}

// ------------------- 컴포넌트 -------------------
export function Projects() {
  const [data, setData] = useState<ProjectsData>(defaultProjectsData)
  const [editMode, setEditMode] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewerFile, setViewerFile] = useState<ViewerFile | null>(null)

  // localStorage 불러오기 (구버전 데이터면 무시)
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as ProjectsData
      const hasFileKey = parsed.sections?.some(section =>
        section.items?.some(item => "fileKey" in item),
      )
      if (hasFileKey) {
        setData(parsed)
      } else {
        // 예전 형식이면 그냥 버리고 새 구조 사용
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [])

  const flatProjects: FlatProject[] = useMemo(
    () =>
      data.sections.flatMap(section =>
        section.items.map((item, idx) => ({
          ...item,
          id: item.id ?? `${section.id}-${idx}`,
          sectionId: section.id,
          sectionTitle: section.title,
        })),
      ),
    [data],
  )

  useEffect(() => {
    if (!activeId && flatProjects.length > 0) {
      setActiveId(flatProjects[0].id)
    }
  }, [activeId, flatProjects])

  const activeProject =
    flatProjects.find(project => project.id === activeId) || flatProjects[0]

  const handleHeaderChange = (field: keyof ProjectsData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const updateSectionField = (
    sectionIdx: number,
    field: keyof ProjectSection,
    value: string,
  ) => {
    setData(prev => {
      const sections = [...prev.sections]
      sections[sectionIdx] = { ...sections[sectionIdx], [field]: value }
      return { ...prev, sections }
    })
  }

  const updateItemField = (
    sectionIdx: number,
    itemIdx: number,
    field: EditableProjectField,
    value: string,
  ) => {
    setData(prev => {
      const sections = [...prev.sections]
      const items = [...sections[sectionIdx].items]
      items[itemIdx] = { ...items[itemIdx], [field]: value }
      sections[sectionIdx] = { ...sections[sectionIdx], items }
      return { ...prev, sections }
    })
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
    setEditMode(false)
  }

  const handleReset = () => {
    setData(defaultProjectsData)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setEditMode(false)
  }

  return (
    <section
      id="projects"
      className="bg-neutral-900 text-white py-20 border-t border-neutral-800"
    >
      <div className="max-w-6xl mx-auto px-4 space-y-10 relative">
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

        {/* 상단 인트로 */}
        <header className="space-y-2">
          {editMode ? (
            <>
              <input
                className="w-full max-w-xs rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-2xl font-bold text-neutral-50"
                value={data.introTitle}
                onChange={e =>
                  handleHeaderChange("introTitle", e.target.value)
                }
              />
              <textarea
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-200"
                value={data.introSubtitle}
                onChange={e =>
                  handleHeaderChange("introSubtitle", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">{data.introTitle}</h2>
              <p className="text-sm text-neutral-300">
                {data.introSubtitle}
              </p>
            </>
          )}
        </header>

        {/* 메인 레이아웃 */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr),minmax(0,1.75fr)] items-start">
          {/* 좌측 목록 + PDF */}
          <div className="space-y-4">
            {data.sections.map((section, sectionIdx) => (
              <div key={section.id} className="space-y-2">
                {editMode ? (
                  <>
                    <input
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-50"
                      value={section.title}
                      onChange={e =>
                        updateSectionField(
                          sectionIdx,
                          "title",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] text-neutral-300"
                      value={section.subtitle}
                      onChange={e =>
                        updateSectionField(
                          sectionIdx,
                          "subtitle",
                          e.target.value,
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {section.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {section.subtitle}
                    </p>
                  </>
                )}

                <div className="space-y-2 pt-1">
                  {section.items.map((item, itemIdx) => {
                    const itemId = item.id ?? `${section.id}-${itemIdx}`
                    const isActive = activeProject?.id === itemId
                    const pdfInfo = item.fileKey
                      ? projectPdfMap[item.fileKey]
                      : undefined

                    if (editMode) {
                      return (
                        <div
                          key={itemId}
                          className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-3 space-y-1"
                        >
                          <input
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-300"
                            value={item.tag}
                            onChange={e =>
                              updateItemField(
                                sectionIdx,
                                itemIdx,
                                "tag",
                                e.target.value,
                              )
                            }
                          />
                          <input
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs font-semibold text-neutral-50"
                            value={item.title}
                            onChange={e =>
                              updateItemField(
                                sectionIdx,
                                itemIdx,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                          <textarea
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-200"
                            value={item.summary}
                            onChange={e =>
                              updateItemField(
                                sectionIdx,
                                itemIdx,
                                "summary",
                                e.target.value,
                              )
                            }
                          />
                          <textarea
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-400"
                            value={item.detail}
                            onChange={e =>
                              updateItemField(
                                sectionIdx,
                                itemIdx,
                                "detail",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )
                    }

                    return (
                      <div key={itemId} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(itemId)
                            if (pdfInfo) {
                              setViewerFile({
                                id: itemId,
                                title: pdfInfo.title,
                                url: pdfInfo.url,
                              })
                            } else {
                              setViewerFile(null)
                            }
                          }}
                          className={`group flex w-full flex-col items-start rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                            isActive
                              ? "border-emerald-400/80 bg-neutral-950 shadow shadow-emerald-500/30"
                              : "border-neutral-800 bg-neutral-950/60 hover:-translate-y-0.5 hover:border-emerald-400/70"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                            {item.tag}
                          </span>
                          <span className="mt-1 text-xs font-semibold text-neutral-50">
                            {item.title}
                          </span>
                          <span className="mt-1 line-clamp-2 text-[11px] text-neutral-300">
                            {item.summary}
                          </span>
                        </button>

                        {viewerFile && viewerFile.id === itemId && (
                          <div className="rounded-2xl border border-neutral-800 bg-black/40 overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 text-[11px] text-neutral-200">
                              <span className="font-medium">
                                {viewerFile.title}
                              </span>
                              <button
                                onClick={() => setViewerFile(null)}
                                className="px-2 py-1 rounded-full border border-neutral-600 hover:bg-neutral-800 text-[11px]"
                              >
                                닫기
                              </button>
                            </div>
                            <div className="h-[420px] w-full">
                              <iframe
                                key={viewerFile.url}
                                src={viewerFile.url}
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 우측 상세 카드 */}
          {activeProject && (
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-neutral-800 bg-neutral-950/90 p-6 shadow-lg shadow-black/40"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                {
                  flatProjects.find(p => p.id === activeProject.id)
                    ?.sectionTitle
                }
              </p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-50">
                {activeProject.title}
              </h3>
              <p className="mt-2 text-xs text-emerald-300">
                {activeProject.tag}
              </p>

              <div className="mt-4 space-y-3 text-[11px] leading-relaxed text-neutral-200">
                <p>{activeProject.summary}</p>
                <p className="text-neutral-300">{activeProject.detail}</p>
              </div>

              <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 text-[11px] text-neutral-300">
                <p className="font-semibold text-neutral-100">
                  What I focused on
                </p>
                <p className="mt-1 text-[11px] text-neutral-300">
                  
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
