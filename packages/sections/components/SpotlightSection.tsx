import type { SpotlightSectionData } from '@azalea/shared/types';

interface SpotlightSectionProps {
  data: SpotlightSectionData;
}

export function SpotlightSection({ data }: SpotlightSectionProps) {
  const {
    sectionTitle = 'Resident Spotlight',
    name,
    image,
    birthplace,
    medicalSchool,
    funFact,
    favoriteDish,
    interests,
    postResidencyPlans,
  } = data;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-azalea-green mb-6 text-center">
        {sectionTitle}
      </h2>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {image && (
          <div className="mb-6 flex justify-center">
            <img
              src={image}
              alt={name}
              className="w-48 h-48 rounded-full object-cover shadow-lg"
            />
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
          {name}
        </h3>

        <div className="space-y-4 text-gray-700">
          {birthplace && (
            <div>
              <span className="font-semibold text-gray-900">Birth place:</span>{' '}
              {birthplace}
            </div>
          )}

          {medicalSchool && (
            <div>
              <span className="font-semibold text-gray-900">Medical School:</span>{' '}
              {medicalSchool}
            </div>
          )}

          {funFact && (
            <div>
              <span className="font-semibold text-gray-900">Fun fact:</span>{' '}
              {funFact}
            </div>
          )}

          {favoriteDish && (
            <div>
              <span className="font-semibold text-gray-900">Favorite dish:</span>{' '}
              {favoriteDish}
            </div>
          )}

          {interests && (
            <div>
              <span className="font-semibold text-gray-900">Interests:</span>{' '}
              {interests}
            </div>
          )}

          {postResidencyPlans && (
            <div>
              <span className="font-semibold text-gray-900">
                Post-residency plans:
              </span>{' '}
              {postResidencyPlans}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
