// Gedeelde utility types

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type AsyncFn<T = void> = () => Promise<T>
