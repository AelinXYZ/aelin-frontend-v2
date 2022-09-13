import { useEffect, useState } from 'react'
import styled from 'styled-components'

import SpinnerCSS from '@/src/components/assets/SpinnerCSS'

const Image = styled.img<{ isDisabled?: boolean }>`
  border-radius: 8px;
  cursor: pointer;

  ${({ isDisabled }) => isDisabled && 'opacity: 0.2;'}
`

const Video = styled.video<{ isDisabled?: boolean }>`
  border-radius: 8px;
  cursor: pointer;

  ${({ isDisabled }) => isDisabled && 'opacity: 0.2;'}
`

const MediaPlaceHolder = styled.div<{
  height: number
  width: number
  isDisabled?: boolean
  onClick?: () => void
}>`
  border-radius: 8px;
  background-color: lightgray;
  position: absolute;
  z-index: 10;
  height: ${(props) => props.height + 'px'};
  width: ${(props) => props.width + 'px'};
  ${({ isDisabled }) => isDisabled && 'opacity: 0.2;'}
  ${({ onClick }) => !!onClick && 'cursor: pointer;'}
`

const MediaWrapper = styled.div<{ height: number; width: number }>`
  position: relative;
  display: flex;
  height: ${(props) => props.height + 'px'};
  width: ${(props) => props.width + 'px'};
`

const LoadingWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 20;
`

const NftMedia = ({
  height = 128,
  isDisabled = false,
  onClick,
  spinner = true,
  src,
  width = 128,
  ...rest
}: {
  src?: string
  height?: number
  width?: number
  isDisabled?: boolean
  onClick?: () => void
  spinner?: boolean
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(!!src)
  const [isVideo, setIsVideo] = useState<boolean>(false)

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((res) => res.headers.get('content-type'))
        .then((contentType) =>
          contentType?.includes('video') ? setIsVideo(true) : setIsVideo(false),
        )
        .catch(() => {
          return
        })
    }
  }, [src])

  return (
    <MediaWrapper height={height} width={width}>
      {!src ? (
        <MediaPlaceHolder height={height} isDisabled={isDisabled} onClick={onClick} width={width} />
      ) : isVideo ? (
        <Video
          {...rest}
          autoPlay
          height={height}
          isDisabled={isDisabled}
          loop
          onClick={onClick}
          onLoadedData={() => setIsLoading(false)}
          src={src}
          width={width}
        />
      ) : (
        <Image
          {...rest}
          alt=""
          height={height}
          isDisabled={isDisabled}
          onClick={onClick}
          onLoad={() => setIsLoading(false)}
          src={src}
          width={width}
        />
      )}
      {isLoading && (
        <>
          <MediaPlaceHolder height={height} width={width} />
          {spinner && (
            <LoadingWrapper>
              <SpinnerCSS height={height * 0.5} margin={2} stroke={1} width={width * 0.5} />
            </LoadingWrapper>
          )}
        </>
      )}
    </MediaWrapper>
  )
}

export default NftMedia
