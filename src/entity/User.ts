import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Int, Field } from "type-graphql";
import { Movie } from "./Movie";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field(() => Int)
  @Column("int", { default: 18 })
  age: number;

  @Field(() => [Movie], { nullable: 'items' })
  @ManyToMany(() => Movie)
  @JoinTable()
  likeMovies: Movie[]
}
