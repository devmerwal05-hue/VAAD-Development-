import { m as motion } from 'framer-motion';

interface PageHeroProps {
  description: string;
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
}

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function PageHero({
  description,
  eyebrow,
  titleBefore,
  titleHighlight,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -left-16 top-[5%] h-[420px] w-[420px] rounded-full blur-[130px]"
          style={{ background: 'rgba(232,19,42,0.18)' }}
        />
        <div
          className="absolute -right-24 top-[10%] h-[520px] w-[520px] rounded-full blur-[150px]"
          style={{ background: 'rgba(12,33,88,0.85)' }}
        />
      </div>

      <div className="relative z-10 site-container">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="corner-marks border border-[rgba(232,19,42,0.22)] bg-[rgba(9,22,40,0.72)] px-6 py-8 md:px-8 md:py-12 lg:px-10"
          >
            <div className="mb-8 flex items-center gap-4">
              <span className="dot-red" />
              <span className="section-ref">{eyebrow}</span>
              <div className="h-[1px] w-20 bg-[rgba(232,19,42,0.35)]" />
            </div>

            <h1
              className="display-hero max-w-[18ch] text-text-primary"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(44px, 6.8vw, 94px)',
              }}
            >
              <span className="block break-words">{titleBefore}</span>
              <span className="mt-2 block break-words italic text-accent">{titleHighlight}</span>
            </h1>

            <div className="my-8 h-[1px] w-full max-w-[280px] bg-[linear-gradient(90deg,rgba(232,19,42,0.65),rgba(232,19,42,0.08),transparent)]" />

            <p
              className="reading-track max-w-[62ch] text-[15px] leading-[1.85] text-[rgba(234,230,219,0.62)] md:text-[17px]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.06 }}
            className="hidden lg:block"
          >
            <div className="corner-marks border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.78)] p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="annotation-label">00 / 01</span>
                <span className="annotation-label">01</span>
              </div>

              <div className="h-[1px] bg-[rgba(232,19,42,0.2)]" />

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="border border-[rgba(232,19,42,0.14)] px-4 py-2 text-center">
                    <span className="annotation-label">{String(n).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-[rgba(232,19,42,0.14)] px-4 py-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="dot-red" />
                  <span className="annotation-label">00 / 00</span>
                </div>
                <div className="h-[1px] bg-[rgba(232,19,42,0.2)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
