interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  centered = true,
  light = false,
}: SectionTitleProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {subtitle && (
        <span
          className={`font-body text-sm font-semibold uppercase tracking-[3px] ${
            light ? "text-gold-light" : "text-gold"
          }`}
        >
          {subtitle}
        </span>
      )}
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-2 ${
          light ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h2>
      <div className="flex justify-center mt-4 mb-2">
        <div className="w-16 h-0.5 bg-gold" />
      </div>
      {description && (
        <p
          className={`mt-4 text-lg max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-gray-300" : "text-gray-dark/70"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
