import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Loading } from '@/src/components/common/Loading'

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

const MediaPlaceHolder = styled.div<{ height: number; width: number }>`
  border-radius: 8px;
  background-color: lightgray;
  position: absolute;
  z-index: 10;
  height: ${(props) => props.height + 'px'};
  width: ${(props) => props.width + 'px'};
`

const MediaWrapper = styled.div`
  position: relative;
  display: flex;
`

const LoadingWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 20;
`

const NftMedia = ({
  isDisabled = false,
  onClick,
  src,
  ...rest
}: {
  src: string
  isDisabled: boolean
  onClick: () => void
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
    <MediaWrapper>
      {isVideo ? (
        <Video
          {...rest}
          autoPlay
          height={128}
          isDisabled={isDisabled}
          loop
          onClick={onClick}
          onLoadedData={() => setIsLoading(false)}
          src={src}
          width={128}
        />
      ) : (
        <Image
          {...rest}
          alt=""
          height={128}
          isDisabled={isDisabled}
          onClick={onClick}
          onLoad={() => setIsLoading(false)}
          src={src}
          width={128}
        />
      )}
      {isLoading && (
        <>
          <MediaPlaceHolder height={128} width={128} />
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        </>
      )}
    </MediaWrapper>
  )
}

export default NftMedia
