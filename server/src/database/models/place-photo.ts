import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { Place } from './place'

@Table({ tableName: 'place_photos' })
export class PlacePhoto extends Model {
  @ForeignKey(() => Place)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare placeId: number

  @AllowNull(false)
  @Column(DataType.STRING)
  declare filename: string

  @Column(DataType.STRING)
  declare originalName: string | null

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date

  @BelongsTo(() => Place, {
    foreignKey: 'placeId',
    as: 'place',
  })
  declare place: Place
}