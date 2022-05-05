import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useWarningOnLeavePage = (
  unsavedChanges: boolean,
  text = 'Are you sure you want to leave the page? All changes will be lost.',
) => {
  const router = useRouter()
  useEffect(() => {
    const warningText = text
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
  }, [router.events, text, unsavedChanges])
}
