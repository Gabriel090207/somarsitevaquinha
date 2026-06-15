import "./Privacy.css";

import termsBg from "../../assets/images/questions-bg.png";

export function Privacy() {

  return (

    <section className="privacy-page">

      <div
        className="privacy-hero"
        style={{
          backgroundImage: `url(${termsBg})`,
        }}
      >

        <div className="privacy-overlay" />

        <div className="privacy-hero-content">

          <span className="privacy-badge">
            Privacidade e proteção de dados
          </span>

          <h1>
            Política de
            <span> Privacidade</span>
          </h1>

          <p>
            Entenda como a Somar coleta, utiliza
            e protege seus dados pessoais.
          </p>

        </div>

      </div>

      <div className="privacy-container">

        <div className="privacy-updated">
          Última atualização: 12 de junho de 2026
        </div>

        <div className="privacy-section">
          <h2>1. Introdução</h2>

          <p>
            A Somar valoriza a privacidade, a segurança
            e a proteção dos dados pessoais de seus usuários.
            Esta Política de Privacidade descreve como
            coletamos, utilizamos, armazenamos e protegemos
            as informações fornecidas durante a utilização
            da plataforma.
          </p>
        </div>

        <div className="privacy-section">
          <h2>2. Dados coletados</h2>

          <p>
            Poderemos coletar nome, e-mail, telefone, CPF,
            CNPJ, dados de perfil, informações de campanhas,
            histórico de doações, dados de carteira, assinaturas
            mensais e transações realizadas na plataforma.
          </p>
        </div>

        <div className="privacy-section">
          <h2>3. Uso dos dados</h2>

          <p>
            Os dados são utilizados para funcionamento da
            plataforma, validação de campanhas, processamento
            de doações, prevenção de fraudes, suporte,
            segurança e cumprimento de obrigações legais.
          </p>
        </div>

       <div className="privacy-section">

  <h2>
    4. Pagamentos e meios de pagamento
  </h2>

  <p>
    Os pagamentos realizados na plataforma são
    processados por parceiros especializados,
    incluindo o Mercado Pago, que adota medidas
    de segurança para proteção das transações
    financeiras.
  </p>

  <p>
    A Somar permite o armazenamento de meios de
    pagamento para facilitar futuras doações,
    assinaturas recorrentes e demais operações
    realizadas na plataforma.
  </p>

  <p>
    Para viabilizar essa funcionalidade,
    poderão ser armazenadas informações
    relacionadas ao cartão utilizado pelo
    usuário, incluindo nome do titular,
    número do cartão, data de validade,
    bandeira do cartão e demais dados
    necessários para identificação e
    processamento de pagamentos autorizados.
  </p>

  <p>
    A Somar não armazena o código de segurança
    do cartão (CVV), que é utilizado apenas
    durante o processo de autenticação e
    autorização das transações financeiras.
  </p>

  <p>
    Os dados financeiros são protegidos por
    medidas técnicas e organizacionais de
    segurança, além dos mecanismos adotados
    pelos parceiros responsáveis pelo
    processamento dos pagamentos.
  </p>

</div>

        <div className="privacy-section">
          <h2>5. Compartilhamento</h2>

          <p>
            A Somar não comercializa dados pessoais. Informações
            poderão ser compartilhadas apenas quando necessário
            para execução dos serviços, processamento de
            pagamentos, prevenção de fraudes ou cumprimento
            de obrigações legais.
          </p>
        </div>

        <div className="privacy-section">
          <h2>6. Segurança</h2>

          <p>
            Adotamos medidas técnicas e organizacionais para
            proteger os dados contra acessos não autorizados,
            vazamentos, alterações indevidas ou uso ilícito.
          </p>
        </div>

        <div className="privacy-section">
          <h2>7. Direitos do usuário</h2>

          <p>
            Conforme a LGPD, o usuário poderá solicitar acesso,
            correção, atualização, exclusão ou informações sobre
            o tratamento de seus dados pessoais.
          </p>
        </div>

        <div className="privacy-section">
          <h2>8. Retenção dos dados</h2>

          <p>
            Os dados poderão ser mantidos pelo período necessário
            para cumprir finalidades da plataforma, obrigações
            legais, prevenção de fraudes e proteção dos usuários.
          </p>
        </div>

        <div className="privacy-section">
          <h2>9. Menores de idade</h2>

          <p>
            O uso por menores de idade deverá ocorrer com
            autorização e supervisão dos responsáveis legais.
          </p>
        </div>

        <div className="privacy-section">
          <h2>10. Contato</h2>

         <p>
  Para dúvidas ou solicitações sobre privacidade e
  proteção de dados, entre em contato pelo e-mail:{" "}

  <a
    href="mailto:somardoacoes@gmail.com"
    className="privacy-highlight-text"
  >
    somardoacoes@gmail.com
  </a>

</p>
         
        </div>

      </div>

    </section>

  );

}