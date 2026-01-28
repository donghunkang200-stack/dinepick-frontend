// 지역/주소 관련 유틸

export function filterByRegion(items, region) {
  if (!region || region === "ALL") return items;
  return items.filter((r) => String(r.address || "").includes(region));
}

export function paginate(items, page, size) {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;

  return {
    content: items.slice(start, start + size),
    totalElements,
    totalPages,
    number: page,
  };
}

export const REGION_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "대구", label: "대구" },
  { value: "인천", label: "인천" },
  { value: "광주", label: "광주" },
  { value: "대전", label: "대전" },
  { value: "울산", label: "울산" },
  { value: "세종", label: "세종" },
  { value: "경기", label: "경기" },
  { value: "강원", label: "강원" },
  { value: "충북", label: "충북" },
  { value: "충남", label: "충남" },
  { value: "전북", label: "전북" },
  { value: "전남", label: "전남" },
  { value: "경북", label: "경북" },
  { value: "경남", label: "경남" },
  { value: "제주", label: "제주" },
];
