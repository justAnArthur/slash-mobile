import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNetworkState } from "expo-network"
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

  const networkState = useNetworkState()
  const cacheKey = String(hash(promiseDataFunction.toString()))

  async function fetchFromNetwork() {
    const res = await promiseDataFunction()

    console.log("fetchFromNetwork res", res)

    const _data = options.transform
      ? options.transform(res, { prev: data })
      : res

    console.log("fetchFromNetwork _data", _data)

    await AsyncStorage.setItem(cacheKey, JSON.stringify(_data))
    setData(_data)
  }

  async function fetchFromCache() {
    const res = await AsyncStorage.getItem(cacheKey)
    const _data = res && JSON.parse(res)
    setData(_data && _data)
  }

  useEffect(() => {
    if (options.haveTo !== undefined && !options.haveTo) return

    setLoading(true)

    const shouldFetchFromNetwork =
      networkState?.isConnected === undefined || networkState.isConnected

    console.log("shouldFetchFromNetwork", shouldFetchFromNetwork)
    ;(shouldFetchFromNetwork ? fetchFromNetwork() : fetchFromCache())
      .catch((err) => {
        console.warn(err)
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, deps)

  return { loading, error, data }
}

function hash(string: string) {
  return string.split("").reduce((a, b) => {
    const _a = (a << 5) - a + b.charCodeAt(0)
    return a & _a
  }, 0)
}
