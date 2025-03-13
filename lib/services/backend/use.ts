import { type DependencyList, useEffect, useState } from "react"

type useBackend = <T>(
  promiseDataFunction: () => Promise<any>,
  deps?: DependencyList,
  options?: {
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (options.haveTo !== undefined && !options.haveTo) return

    setLoading(true)
    promiseDataFunction()
      .then((res) => {
        // @ts-ignore
        if (options.transform) setData(options.transform(res, data))
        else setData(res)

        setLoading(false)
      })
      .catch((err) => {
        console.warn(err)
        setError(err)
        setLoading(false)
      })
  }, deps)

  return { loading, error, data }
}
