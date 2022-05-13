import React, { useMemo } from 'react'

import { curveMonotoneX } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, LinePath } from '@visx/shape'
import { extent, max } from 'd3-array'

import { theme } from '@/src/theme'

interface Props<DataType> {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
  data: DataType[]
  getXValue: (data: DataType) => Date
  getYValue: (data: DataType) => number
}

const AreaChart = <DataType,>({
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  data,
  getXValue,
  getYValue,
}: Props<DataType>) => {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(data, getXValue) as [Date, Date],
      }),
    [innerWidth, margin.left, data, getXValue],
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(data, getYValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight, data, getYValue],
  )

  if (width < 10) return null

  return (
    <div>
      <svg height={height} width={width}>
        <rect fill="none" height={height} width={width} x={0} y={0} />
        <LinePath<DataType>
          curve={curveMonotoneX}
          data={data}
          stroke={theme.colors.primary}
          strokeWidth={1}
          x={(data) => xScale(getXValue(data)) ?? 0}
          y={(data) => yScale(getYValue(data)) ?? 0}
        />
        <LinearGradient
          from={theme.colors.areaChartGradientStart}
          fromOpacity={0.4}
          id="area-gradient"
          to={theme.colors.areaChartGradientEnd}
          toOpacity={0.8}
        />
        <AreaClosed<DataType>
          curve={curveMonotoneX}
          data={data}
          fill="url(#area-gradient)"
          x={(data) => xScale(getXValue(data)) ?? 0}
          y={(data) => yScale(getYValue(data)) ?? 0}
          yScale={yScale}
        />
      </svg>
    </div>
  )
}

export default AreaChart
