import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventVisibility } from "../types/events.types";



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

 

  @ManyToOne(() => User, user => user.organizedEvents)
  organizer: User;

  @ManyToMany(() => User, user => user.participatingEvents)
  participants: User[];
}