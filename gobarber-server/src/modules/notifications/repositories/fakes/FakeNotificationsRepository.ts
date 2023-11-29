import { ObjectId } from 'mongodb';

import type ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import type INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private readonly notifications: Notification[] = [];

  public async create({
    content,
    recipientId,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectId(), content, recipientId });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
