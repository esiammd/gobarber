# Recuperação de senha

**RF** (Requisitos Funcionais)

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF** (Requisitos Não Funcionais)

- Utilizar Etherealmail para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mail deve acontecer em segundo plano (background job);

**RN** (Regras de Negócios)

- O link enviado por e-mail para resetar senha deve expiarar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF** (Requisitos Funcionais)

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RNF** (Requisitos Não Funcionais)

Não consta;

**RN** (Regras de Negócios)

- O usuário não pode alterar seu e-mail para um e-amil já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha (essa validação será feita na camada de controller e não na de testes);

# Painel do prestador

**RF** (Requisitos Funcionais)

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF** (Requisitos Não Funcionais)

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- AS notificações do prestador devvem ser enviadas em tempo-real utilizando Socket.io;

**RN** (Regras de Negócios)

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF** (Requisitos Funcionais)

- O usuário deve poder listar todos os prestadores de serviço cadastrados:
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF** (Requisitos Não Funcionais)

- A listagem de prestadores deve ser armazenada em cache;

**RN** (Regras de Negócios)

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h às 18h (primeiro horário às 8h, último horário às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;
