import type { InternsCornerSectionData } from '@azalea/shared/types';

interface InternsCornerSectionProps {
  data: InternsCornerSectionData;
}

export function InternsCornerSection({ data }: InternsCornerSectionProps) {
  const {
    sectionTitle = "Interns' Corner",
    title,
    author,
    content,
  } = data;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-azalea-green mb-6 text-center">
        {sectionTitle}
      </h2>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}

        {author && (
          <div className="text-sm text-gray-600 italic mb-4">
            By: {author}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
