import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useUnsavedChanges = (unsavedChanges: boolean) => {
  const router = useRouter()
  useEffect(() => {
    const warningText = 'Are you sure you want to leave the page? All changes will be lost.'
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChanges) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }
    const handleBrowseAway = () => {
      if (!unsavedChanges) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [router.events, unsavedChanges])
}
