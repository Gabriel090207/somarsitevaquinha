import "./Privacy.css";

import privacyBg from "../../assets/images/questions-bg.png";

export function Privacy() {

  return (

    <section className="privacy-page">

      {/* HERO */}

      <div
        className="privacy-hero"
        style={{
          backgroundImage: `url(${privacyBg})`,
        }}
      >

        <div className="privacy-overlay" />

        <div className="privacy-hero-content">

          <span className="privacy-badge">
            Transparência e proteção
          </span>

          <h1>
            Política de
            <br />
            <span>Privacidade</span>
          </h1>

          <p>
            Entenda como tratamos e protegemos seus dados.
          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="privacy-container">

        <div className="privacy-updated">

          Última atualização:
          25 de maio de 2026

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            1. Introdução
          </h2>

          <p>
            A <span className="privacy-highlight-text">
              Somar
            </span> valoriza a privacidade,
            segurança e transparência no tratamento
            dos dados pessoais de seus usuários.
          </p>

          <p>
            Esta Política de Privacidade explica como
            coletamos, utilizamos, armazenamos e protegemos
            as informações fornecidas durante a utilização
            da plataforma.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            2. Dados coletados
          </h2>

          <p>
            Podemos coletar informações cadastrais,
            documentos de identificação, dados de contato,
            informações bancárias, imagens, dados de navegação
            e demais informações necessárias para utilização
            dos serviços da plataforma.
          </p>

          <p>
            Algumas informações poderão ser coletadas
            automaticamente através de tecnologias como
            cookies, métricas de navegação e ferramentas
            analíticas.
          </p>

        </div>

        {/* HIGHLIGHT */}

        <div className="privacy-highlight">

          <strong>
            Seus dados são tratados com segurança.
          </strong>

          <span>
            Utilizamos medidas técnicas e organizacionais
            para proteger as informações armazenadas.
          </span>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            3. Como utilizamos os dados
          </h2>

          <p>
            Os dados coletados são utilizados para
            viabilizar campanhas, processar doações,
            prevenir fraudes, validar usuários,
            melhorar a experiência da plataforma e
            cumprir obrigações legais.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            4. Compartilhamento de informações
          </h2>

          <p>
            A Somar não comercializa dados pessoais.
            Informações poderão ser compartilhadas apenas
            quando necessário para processamento de pagamentos,
            cumprimento de obrigações legais, prevenção de
            fraudes ou funcionamento dos serviços da plataforma.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            5. Cookies e tecnologias
          </h2>

          <p>
            Utilizamos cookies e ferramentas tecnológicas
            para melhorar o desempenho da plataforma,
            analisar métricas de navegação, proteger contas
            e personalizar a experiência do usuário.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            6. Segurança das informações
          </h2>

          <p>
            Adotamos medidas técnicas e administrativas
            adequadas para proteger os dados pessoais
            contra acessos não autorizados, vazamentos,
            alterações indevidas e atividades ilícitas.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            7. Direitos do usuário
          </h2>

          <p>
            O usuário poderá solicitar acesso,
            atualização, correção ou exclusão de seus
            dados pessoais, observadas as obrigações
            legais aplicáveis.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            8. Retenção de dados
          </h2>

          <p>
            Os dados poderão ser armazenados pelo período
            necessário para cumprimento das finalidades
            descritas nesta política e obrigações legais.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            9. Alterações desta política
          </h2>

          <p>
            Esta Política de Privacidade poderá ser
            atualizada periodicamente para refletir
            melhorias da plataforma, alterações legais
            e novos serviços oferecidos pela Somar.
          </p>

        </div>

        {/* SECTION */}

        <div className="privacy-section">

          <h2>
            10. Contato
          </h2>

          <p>
            Em caso de dúvidas relacionadas à privacidade,
            proteção de dados ou utilização da plataforma,
            entre em contato com a equipe da Somar através
            dos canais oficiais disponibilizados no site.
          </p>

        </div>

      </div>

    </section>
  );
}