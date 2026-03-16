import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import {Event} from "./event.entity"
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'citext', unique: true })
  name: string;

  @ManyToMany(() => Event, (event) => event.tags)
  events: Event[];
}