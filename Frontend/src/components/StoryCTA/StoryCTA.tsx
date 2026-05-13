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

        <button>
          Criar vaquinha
          <ArrowRight size={18} />
        </button>

      </div>

    </section>
  );
}