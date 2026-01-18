import type { GenericTextSectionData } from '@azalea/shared/types';

interface GenericTextSectionProps {
  data: GenericTextSectionData;
}

export function GenericTextSection({ data }: GenericTextSectionProps) {
  const { sectionTitle, content } = data;

  return (
    <section className="mb-12">
      {sectionTitle && (
        <h2 className="text-2xl font-bold text-azalea-green mb-6 text-center">
          {sectionTitle}
        </h2>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
