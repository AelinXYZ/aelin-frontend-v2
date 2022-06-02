import Image from 'next/image'

import ms from 'ms'
import { Toast, Toaster, toast } from 'react-hot-toast'

import LoaderIcon from '@/public/resources/gif/toast-loader.gif'
import { Failed as FailedIcon } from '@/src/components/assets/Failed'
import { Success as SuccessIcon } from '@/src/components/assets/Success'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { FAILED_TYPE, SUCCESS_TYPE, WAITING_TYPE } from '@/src/components/toast/types'

type ToastType = typeof FAILED_TYPE | typeof SUCCESS_TYPE | typeof WAITING_TYPE

type ToastComponentProps = {
  t: Toast
  explorerUrl?: string
  message?: string
}

const ToastTypes = {
  [WAITING_TYPE]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<Image alt="Loading..." src={LoaderIcon} />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to verify on Etherscan' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction Sent"
    />
  ),
  [FAILED_TYPE]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<FailedIcon />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to see on Etherscan' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction Failed"
    />
  ),
  [SUCCESS_TYPE]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<SuccessIcon />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to verify on Etherscan' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction confirmed"
    />
  ),
}

const notify = ({
  explorerUrl,
  message,
  type,
}: {
  explorerUrl?: string
  message?: string
  type: ToastType
}) => toast.custom((t: Toast) => ToastTypes[type]({ t, explorerUrl, message }))

const Toast = () => (
  <Toaster
    position="bottom-right"
    toastOptions={{
      duration: ms('30s'),
    }}
  />
)

export default Toast
export { notify }
