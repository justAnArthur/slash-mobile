export function getItem(key: string): string | null {
  console.log("getItem localStorage")
  return localStorage.getItem(key)
}

export function setItem(key: string, value: string): void {
  localStorage.setItem(key, value)
}
