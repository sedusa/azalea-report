import type { AboutSectionData } from '@azalea/shared/types';

interface AboutSectionProps {
  data: AboutSectionData;
}

export function AboutSection({ data }: AboutSectionProps) {
  const { title = 'About', content } = data;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-azalea-green mb-6 text-center">
        {title}
      </h2>
      <div className="max-w-4xl mx-auto bg-azalea-peach rounded-lg p-8">
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
