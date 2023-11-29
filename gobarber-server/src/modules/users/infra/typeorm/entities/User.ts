import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadconfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  avatar: string;

  @Expose({ name: 'avatarURL' })
  getAvatarURL(): string | null {
    if (this.avatar === null) {
      return null;
    }

    switch (uploadconfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL as string}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadconfig.config.aws.bucket}.s3.amazon3com/${this.avatar}`;
      default:
        return null;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default User;
