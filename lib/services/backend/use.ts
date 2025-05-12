import { type DependencyList, useEffect, useState } from "react"
import { state } from "@/lib/services/backend/state"

type useBackend = <T>(
  promiseDataFunction: () => Promise<any>,
  deps?: DependencyList,
  options?: {
    key?: string
    transform?: (data: any, params: { prev: T | null }) => any
    haveTo?: boolean
  }
) => {
  data: T | null
  loading: boolean
  error: any
}

export const useBackend: useBackend = (
  promiseDataFunction,
  deps = [],
  options = {}
) => {
  const [data, setData] = useState(() =>
    options.key ? state[options.key] : undefined
  )

  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (options.haveTo !== undefined && !options.haveTo) return

    if (!data) setLoading(true)
    ;(async () => {
      let _data: any
      try {
        const res = await promiseDataFunction()

        if (!res) return

        _data = options.transform ? options.transform(res, { prev: data }) : res

        if (options.key) state[options.key] = _data
        setData(_data)
      } catch (error) {}

      setLoading(false)
    })()
  }, deps)

  return { loading, error, data }
}

function hash(string: string) {
  return string
    .replace(/\s+/g, "")
    .trim()
    .split("")
    .reduce((a, b) => {
      const _a = (a << 5) - a + b.charCodeAt(0)
      return _a & _a
    }, 0)
}
