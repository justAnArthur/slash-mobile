import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNetworkState } from "expo-network"
import { type DependencyList, useEffect, useMemo, useState } from "react"

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

  const networkState = useNetworkState()
  const cacheKey = useMemo(
    () => String(hash(promiseDataFunction.toString())),
    deps
  )

  async function fetchFromNetwork() {
    const res = await promiseDataFunction()

    await AsyncStorage.setItem(cacheKey, JSON.stringify(res))

    const _data = options.transform
      ? options.transform(res, { prev: data })
      : res

    setData(_data)
  }

  async function fetchFromCache() {
    const res = await AsyncStorage.getItem(cacheKey)

    const parsed = res && JSON.parse(res)
    const _data = options.transform
      ? options.transform(parsed, { prev: data })
      : parsed

    setData(_data)
  }

  const networkDependency = networkState?.isInternetReachable ?? true

  useEffect(() => {
    if (options.haveTo !== undefined && !options.haveTo) return

    setLoading(true)

    const shouldFetchFromNetwork = networkState?.isInternetReachable ?? true
    ;(shouldFetchFromNetwork ? fetchFromNetwork() : fetchFromCache())
      .catch((err) => {
        console.warn(err)
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [...deps, networkDependency])

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
