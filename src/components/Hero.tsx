import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

function CountUpMetric({ value }: { value: string }) {
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.8 });
  const [displayValue, setDisplayValue] = useState('0');
  const isNumeric = /^\d+(\.\d+)?$/.test(value.trim());

  useEffect(() => {
    if (!isNumeric || !inView) return undefined;

    const decimals = value.includes('.') ? value.split('.')[1].length : 0;
    const target = Number(value);

    const controls = animate(0, target, {
      duration: 0.95,
      ease: [0.16, 0.77, 0.47, 0.97],
      onUpdate(latest) {
        setDisplayValue(latest.toFixed(decimals).replace(/\.0+$/, ''));
      },
    });

    return () => controls.stop();
  }, [inView, isNumeric, value]);

  if (!isNumeric) {
    return <span ref={nodeRef}>{value}</span>;
  }

  return <span ref={nodeRef}>{displayValue}</span>;
}

export default function Hero() {
  const { getContentValue } = useContent();

  const line1 = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const line2 = getContentValue('hero', 'headline_line2', 'not vague agency timelines.');
  const subheadline = getContentValue(
    'hero',
    'subheadline',
    'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.'
  );

  const stats = [
    { value: getContentValue('hero', 'stat_1_number', '5'), label: getContentValue('hero', 'stat_1_label', 'Senior builders') },
    { value: getContentValue('hero', 'stat_2_number', '1-3'), label: getContentValue('hero', 'stat_2_label', 'Week delivery') },
    { value: getContentValue('hero', 'stat_3_number', 'Always'), label: getContentValue('hero', 'stat_3_label', 'Post-launch iteration') },
  ];

  const systemSpecs = [
    { label: getContentValue('hero', 'spec_1_label', 'Delivery mode'), value: getContentValue('hero', 'spec_1_value', 'Embedded sprint') },
    { label: getContentValue('hero', 'spec_2_label', 'Iteration cycle'), value: getContentValue('hero', 'spec_2_value', '48-hour checkpoints') },
    { label: getContentValue('hero', 'spec_3_label', 'Stack bias'), value: getContentValue('hero', 'spec_3_value', 'React + TypeScript + Supabase') },
    { label: getContentValue('hero', 'spec_4_label', 'Launch profile'), value: getContentValue('hero', 'spec_4_value', 'Content-ready + measurable') },
  ];

  const coreServiceTitle = getContentValue('hero', 'info_1_title', 'Core Service');
  const coreServiceText = getContentValue('hero', 'info_1_text', 'Clear scoping, focused execution, and handoff-ready delivery in one loop.');
  const coreServiceImage = getContentValue('hero', 'info_1_image', '');
  const technicalSpecsTitle = getContentValue('hero', 'info_2_title', 'Technical Specs');
  const technicalSpecsImage = getContentValue('hero', 'info_2_image', '');
  const metricsTitle = getContentValue('hero', 'info_3_title', 'Delivery Metrics');
  const metricsImage = getContentValue('hero', 'info_3_image', '');

  const splitWords = (line: string) => line.split(/\s+/).filter(Boolean);
  const lineOneWords = splitWords(line1);
  const lineTwoWords = splitWords(line2);

  return (
    <section className="section-pad swiss-section relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="hero-mesh" />
      <div className="hero-particle-lines" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_15%,rgba(95,160,255,0.12),transparent_58%)]" />
      <span className="swiss-meta swiss-meta--tl">{getContentValue('hero', 'meta_left', 'hero.layout // 12-col')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('hero', 'meta_right', 'v3.1 // bento-grid')}</span>

      <div className="relative z-10 site-container swiss-grid max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="swiss-full-col flex items-center justify-between overflow-hidden border-b border-white/10 pb-8"
        >
          <span className="archive-tag text-[rgba(198,213,239,0.9)]">{getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}</span>
          <span className="archive-tag hidden md:block">{getContentValue('hero', 'proof_kicker', 'System specs')}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="swiss-full-col mt-6 overflow-hidden lg:col-span-8 lg:col-start-3"
        >
          <div className="overflow-hidden">
            <h1
              className="display-hero text-center text-[#e6edfa]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(48px, 10vw, 136px)',
                fontStyle: 'italic',
              }}
            >
              <span className="block">
                {lineOneWords.map((word, index) => (
                  <motion.span
                    key={`hero-line1-${word}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 + index * 0.045, ease }}
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block text-[rgba(239,244,255,0.95)]">
                {lineTwoWords.map((word, index) => (
                  <motion.span
                    key={`hero-line2-${word}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.24 + index * 0.045, ease }}
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p
              className="reading-track mx-auto mt-10 text-center text-[17px] leading-[1.9] text-[rgba(199,214,239,0.9)] md:text-[20px]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              {subheadline}
            </p>

            <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
              <Link
                to="/contact"
                className="shimmer-btn cta-btn inline-flex items-center justify-center gap-2.5 bg-accent px-9 py-4 text-[12px] uppercase tracking-[0.28em] text-[#050d22] transition-all duration-300 hover:brightness-110"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={14} />
              </Link>
              <Link
                to="/work"
                className="cta-btn inline-flex items-center justify-center gap-2.5 border border-white/20 bg-black/30 px-9 py-4 text-[12px] uppercase tracking-[0.28em] text-[rgba(214,227,248,0.92)] transition-all duration-300 hover:border-white/35 hover:text-white"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_secondary', 'See shipped work')}
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="swiss-full-col mt-12 grid grid-cols-1 gap-8 overflow-hidden lg:grid-cols-12 lg:gap-12">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            className="bento-card scanline-hover overflow-hidden border border-white/10 bg-zinc-900/50 p-8 md:p-10 lg:col-span-8"
          >
            {coreServiceImage && (
              <div className="mb-6 h-36 overflow-hidden border border-white/10 md:h-44">
                <img src={coreServiceImage} alt={coreServiceTitle} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            )}
            <p className="archive-tag mb-5">{coreServiceTitle}</p>
            <p className="reading-track text-[17px] leading-[1.9] text-[rgba(220,232,251,0.92)] md:text-[19px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {coreServiceText}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
              {stats.map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="bento-card min-h-[136px] overflow-hidden border border-white/10 bg-black/45 p-5 text-center">
                  <p className="text-[34px] leading-none text-[#e8f0ff]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic' }}>
                    <CountUpMetric value={stat.value} />
                  </p>
                  <p className="mono-readable mt-3 text-[11px] uppercase text-[rgba(164,188,225,0.86)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <div className="grid grid-cols-1 gap-6 overflow-hidden lg:col-span-4">
            <div className="overflow-hidden border border-white/20 bg-black/75">
              {technicalSpecsImage ? (
                <div className="relative h-24 overflow-hidden md:h-28">
                  <img src={technicalSpecsImage} alt={technicalSpecsTitle} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/45" />
                  <p className="archive-tag absolute bottom-2 left-3 text-[rgba(255,255,255,0.9)]">{technicalSpecsTitle}</p>
                </div>
              ) : (
                <div className="px-4 py-4">
                  <p className="archive-tag text-[rgba(255,255,255,0.82)]">{technicalSpecsTitle}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {systemSpecs.slice(0, 4).map((spec, index) => (
                <motion.article
                  key={spec.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, ease, delay: 0.05 * index }}
                  className="bento-card aspect-square overflow-hidden border border-white/20 bg-black/80 p-5"
                >
                  <p className="archive-tag text-[rgba(255,255,255,0.7)]">{spec.label}</p>
                  <p className="mono-readable mt-4 text-[12px] uppercase text-[rgba(226,236,252,0.92)]">{spec.value}</p>
                </motion.article>
              ))}
            </div>

            <div className="overflow-hidden border border-white/20 bg-black/70">
              {metricsImage ? (
                <div className="relative h-24 overflow-hidden md:h-28">
                  <img src={metricsImage} alt={metricsTitle} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/45" />
                  <p className="archive-tag absolute bottom-2 left-3 text-[rgba(255,255,255,0.9)]">{metricsTitle}</p>
                </div>
              ) : (
                <div className="px-4 py-4">
                  <p className="archive-tag text-[rgba(255,255,255,0.82)]">{metricsTitle}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
