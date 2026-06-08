import "./StoryCTA.css";

import { ArrowRight } from "lucide-react";

export function StoryCTA() {
  return (
    <section className="story-cta">

      <div className="story-cta-container">

        <div className="story-cta-left">

          <span>
            Conte sua história
          </span>

          <p>
            Sua campanha pode transformar vidas.
          </p>

        </div>

      <a
  href="https://wa.me/5586921427920?text=Olá!%20Gostaria%20de%20saber%20como%20criar%20uma%20vaquinha%20na%20Somar."
  target="_blank"
  rel="noopener noreferrer"
>
  <button>
    Criar vaquinha
    <ArrowRight size={18} />
  </button>
</a>

      </div>

    </section>
  );
}