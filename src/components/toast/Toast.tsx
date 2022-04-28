import Image from 'next/image'

import ms from 'ms'
import { Renderable, Toast, Toaster, toast } from 'react-hot-toast'

import LoaderIcon from '@/public/resources/gif/toast-loader.gif'
import { Failed as FailedIcon } from '@/src/components/assets/Failed'
import { Success as SuccessIcon } from '@/src/components/assets/Success'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { ERROR_TYPE, SUCCESS_TYPE, WAITING_TYPE } from '@/src/components/toast/types'

type ToastType = typeof ERROR_TYPE | typeof SUCCESS_TYPE | typeof WAITING_TYPE

const ToastTypes: { [key: string]: (t: Toast, explorerUrl: string) => Renderable } = {
  [WAITING_TYPE]: (t: Toast, explorerUrl: string) => (
    <ToastComponent
      icon={<Image alt="Loading..." src={LoaderIcon} />}
      link={{ url: explorerUrl, text: 'Click to verify on Etherscan' }}
      t={t}
      title="Transaction Sent"
    />
  ),
  [ERROR_TYPE]: (t: Toast, explorerUrl: string) => (
    <ToastComponent
      icon={<FailedIcon />}
      link={{ url: explorerUrl, text: 'Click to see on Etherscan' }}
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
      duration: ms('10s'),
    }}
  />
)

export default Toast
export { notify }
