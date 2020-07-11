import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { MovieCategory } from "./MovieCategory.model";

@ObjectType()
@Entity({ name: "movies" })
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

    @Field(() => [MovieCategory], { nullable: true })
    @ManyToMany(() => MovieCategory, { eager: true })
    @JoinTable({ name: "movies_categories" })
    categories: MovieCategory[];
}
