import { type MongoRepository } from 'typeorm';

import type ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import type INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import { MongoDataSource } from '@shared/infra/typeorm';

import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private readonly ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = MongoDataSource.getMongoRepository(Notification);
  }

  public async create({
    content,
    recipientId,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({ content, recipientId });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
