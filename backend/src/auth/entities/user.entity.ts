import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from '../../events/entities/event.entity';
@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(() => Event, event => event.organizer)
    organizedEvents: Event[];

    @ManyToMany(() => Event, event => event.participants)
    @JoinTable()
    participatingEvents: Event[];

}