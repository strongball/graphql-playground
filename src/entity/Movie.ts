import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { MovieCategory } from "./MovieCategory";

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => Int)
  @Column("int", { default: 60 })
  minutes: number;

  @Field(() => Int)
  titleLength: number;

  @Field(() => [MovieCategory], { nullable: 'items' })
  @ManyToMany(() => MovieCategory)
  @JoinTable()
  categories: MovieCategory[]
}
