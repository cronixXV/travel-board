import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasMany,
  ForeignKey,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user';
import { PlacePhoto } from './place-photo';

@Table({ tableName: 'places' })
export class Place extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.TEXT)
  declare description: string | null;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare lat: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare lng: number;

  @Column(DataType.STRING)
  declare country: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare continent: string | null;

  @Column(DataType.DATEONLY)
  declare visitedAt: string | null;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isPublic: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => PlacePhoto, {
    foreignKey: 'placeId',
    as: 'photos',
  })
  declare photos: PlacePhoto[];
}
