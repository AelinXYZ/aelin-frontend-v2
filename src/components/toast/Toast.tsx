import ms from 'ms'
import { Renderable, Toast, Toaster, toast } from 'react-hot-toast'

import { Failed as FailedIcon } from '@/src/components/assets/Failed'
import { Sent as SentIcon } from '@/src/components/assets/Sent'
import { Success as SuccessIcon } from '@/src/components/assets/Success'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { ERROR_TYPE, SENT_TYPE, SUCCESS_TYPE } from '@/src/components/toast/types'

type ToastType = typeof ERROR_TYPE | typeof SUCCESS_TYPE | typeof SENT_TYPE

const ToastTypes: { [key: string]: (t: Toast, explorerUrl: string) => Renderable } = {
  [SENT_TYPE]: (t: Toast, explorerUrl: string) => (
    <ToastComponent
      icon={<SentIcon />}
      link={{ url: explorerUrl, text: 'Click to verify on Etherscan' }}
      t={t}
      title="Transaction Sent"
    />
  ),
  [ERROR_TYPE]: (t: Toast, explorerUrl: string) => (
    <ToastComponent
      icon={<FailedIcon />}
      link={{ url: explorerUrl, text: 'Click to seey on Etherscan' }}
      t={t}
      title="Transaction Failed"
    />
  ),
  [SUCCESS_TYPE]: (t: Toast, explorerUrl: string) => (
    <ToastComponent
      icon={<SuccessIcon />}
      link={{ url: explorerUrl, text: 'Click to verify on Etherscan' }}
      t={t}
      title="Transaction confirmed"
    />
  ),
}

const notify = ({ explorerUrl, type }: { type: ToastType; explorerUrl: string }) =>
  toast.custom((t: Toast) => ToastTypes[type](t, explorerUrl))

const Toast = () => (
  <Toaster
    containerStyle={{ position: 'absolute', marginBottom: '20px', marginLeft: '20px' }}
    position="bottom-right"
    toastOptions={{
      duration: ms('5s'),
    }}
  />
)

export default Toast
export { notify }
