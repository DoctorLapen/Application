import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventVisibility } from "../types/events.types";
import { Tag } from "./tag.entity";



@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  dateTime: Date;

  @Column()
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'enum', enum: EventVisibility, default: EventVisibility.PUBLIC })
  visibility: EventVisibility;

  @ManyToMany(() => Tag, (tag) => tag.events, { eager: true })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, user => user.organizedEvents)
  organizer: User;

  @ManyToMany(() => User, user => user.participatingEvents)
  participants: User[];
}