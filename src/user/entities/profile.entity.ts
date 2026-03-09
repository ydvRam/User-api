import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
