import { useEffect, useLayoutEffect } from 'react'

/**
 * The signature is identical to useEffect, but it fires synchronously after all DOM mutations.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
