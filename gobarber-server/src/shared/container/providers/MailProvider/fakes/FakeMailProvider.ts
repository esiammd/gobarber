import type ISendMailDTO from '../dtos/ISendMailDTO';
import type IMailProvider from '../models/IMailProvider';

class FakeMailProvider implements IMailProvider {
  private readonly messages: ISendMailDTO[] = [];

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    this.messages.push({ to, from, subject, templateData });
  }
}

export default FakeMailProvider;
