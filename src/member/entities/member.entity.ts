import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;
}
