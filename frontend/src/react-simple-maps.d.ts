declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps, MouseEvent } from 'react'

  export interface ProjectionConfig {
    scale?: number
    center?: [number, number]
    rotate?: [number, number, number]
    parallels?: [number, number]
  }

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    style?: React.CSSProperties
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    rsmKey: string
    properties: Record<string, string>
  }

  export interface GeographyProps extends Omit<SVGProps<SVGPathElement>, 'onMouseEnter' | 'onMouseMove' | 'onMouseLeave'> {
    geography: Geography
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void
    onMouseMove?: (event: MouseEvent<SVGPathElement>) => void
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
  export function ZoomableGroup(props: Record<string, unknown>): JSX.Element
  export function Marker(props: Record<string, unknown>): JSX.Element
  export function Annotation(props: Record<string, unknown>): JSX.Element
  export function Graticule(props: Record<string, unknown>): JSX.Element
  export function Sphere(props: Record<string, unknown>): JSX.Element
}
