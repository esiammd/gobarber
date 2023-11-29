/* eslint-disable @typescript-eslint/consistent-type-assertions */
interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver:
    process.env.MAIL_DRIVER !== undefined
      ? process.env.MAIL_DRIVER
      : 'ethereal',

  defaults: {
    from: {
      name: 'Equipe GoBarber',
      email: 'equipe@gobarber.com.br',
    },
  },
} as IMailConfig;
