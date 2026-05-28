import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Unique,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { Place } from './place'

@Table({ tableName: 'users' })
export class User extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string

  @AllowNull(false)
  @Column(DataType.STRING)
  declare passwordHash: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare username: string

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date

  @HasMany(() => Place)
  declare places: Place[]
}