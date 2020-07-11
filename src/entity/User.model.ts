import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { ObjectType, Int, Field } from "type-graphql";
import { Movie } from "./Movie.model";

@ObjectType()
@Entity({ name: "users" })
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

    @Field(() => [Movie], { nullable: "items" })
    @ManyToMany(() => Movie)
    @JoinTable({ name: "users_like_movies" })
    likeMovies: Movie[];
}
