export interface BaseRepository<T> {
  findAll: () => Promise<T[]>
}
